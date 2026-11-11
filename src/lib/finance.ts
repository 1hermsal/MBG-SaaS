import { pool } from "./db";

export type Money = { omset: number; biaya: number; ops: number; laba: number };
export type Finance = { today: Money; month: Money };

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const money = (omset: number, biaya: number, ops: number): Money => ({ omset, biaya, ops, laba: omset - biaya - ops });

// Omset = harga per porsi x porsi yang sampai. Biaya = bahan terpakai x harga bahan (harga saat ini).
// Biaya operasional = pengeluaran yang dicatat owner. Laba bersih = omset - biaya bahan - biaya operasional.
export async function getFinance(kid: number | null): Promise<Finance> {
  const [r, e] = await Promise.all([
    pool.query<{ today: boolean; omset: number; biaya: number }>(
      `select (m.menu_date = current_date) as today,
         coalesce(sum(a.arrived * k.price_per_portion), 0)::float as omset,
         coalesce(sum(c.cost), 0)::float as biaya
       from menus m
       join kitchens k on k.id = m.kitchen_id
       left join productions p on p.menu_id = m.id
       left join lateral (
         select coalesce(sum(d.portions), 0) as arrived
         from deliveries d where d.menu_id = m.id and d.status = 'sampai'
       ) a on true
       left join lateral (
         select p.portions * sum(mi.qty_per_portion * s.unit_price) as cost
         from menu_ingredients mi join stock_items s on s.id = mi.stock_item_id
         where mi.menu_id = m.id and p.id is not null
       ) c on true
       where m.menu_date >= date_trunc('month', current_date)
         and ($1::int is null or m.kitchen_id = $1)
       group by (m.menu_date = current_date)`,
      [kid]
    ),
    pool.query<{ today: boolean; ops: number }>(
      `select (expense_date = current_date) as today, coalesce(sum(amount), 0)::float as ops
       from expenses
       where expense_date >= date_trunc('month', current_date)
         and ($1::int is null or kitchen_id = $1)
       group by (expense_date = current_date)`,
      [kid]
    ),
  ]);
  const t = r.rows.find((x) => x.today);
  const et = e.rows.find((x) => x.today);
  return {
    today: money(t?.omset ?? 0, t?.biaya ?? 0, et?.ops ?? 0),
    month: money(
      r.rows.reduce((a, x) => a + x.omset, 0),
      r.rows.reduce((a, x) => a + x.biaya, 0),
      e.rows.reduce((a, x) => a + x.ops, 0)
    ),
  };
}
