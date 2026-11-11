import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import Stat from "@/components/ui/Stat";
import Stepper from "./Stepper";
import type { Ingredient, TodayMenu } from "@/types";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { disiapkan: "Disiapkan", dikirim: "Dikirim", sampai: "Sampai" };

export default async function DapurPage() {
  const s = await requireRole("kepala_dapur");

  const m = await pool.query<TodayMenu>(
    `select m.id, m.name, m.target_portions, (p.id is not null) as done, p.portions as made
     from menus m left join productions p on p.menu_id = m.id
     where m.kitchen_id = $1 and m.menu_date = current_date`,
    [s.kid]
  );
  const menu = m.rows[0];

  const ing = menu
    ? await pool.query<Ingredient>(
        `select s.name, s.unit, s.qty::float as stock, (mi.qty_per_portion * m.target_portions)::float as need
         from menu_ingredients mi
         join stock_items s on s.id = mi.stock_item_id
         join menus m on m.id = mi.menu_id
         where mi.menu_id = $1 order by s.name`,
        [menu.id]
      )
    : { rows: [] as Ingredient[] };

  const low = await pool.query<{ n: number }>(
    "select count(*)::int as n from stock_items where kitchen_id = $1 and qty <= min_qty",
    [s.kid]
  );
  const del = await pool.query<{ name: string; portions: number; status: string }>(
    `select sc.name, d.portions, d.status from deliveries d
     join schools sc on sc.id = d.school_id join menus m on m.id = d.menu_id
     where m.kitchen_id = $1 and m.menu_date = current_date order by sc.name`,
    [s.kid]
  );
  const arrived = del.rows.filter((d) => d.status === "sampai").reduce((a, d) => a + d.portions, 0);

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <AppHeader session={s} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Target" value={menu?.target_portions ?? 0} />
        <Stat label="Dimasak" value={menu?.made ?? 0} />
        <Stat label="Sampai" value={arrived} />
        <Stat label="Stok menipis" value={low.rows[0].n} bad={low.rows[0].n > 0} />
      </div>

      {menu ? (
        <Stepper menu={menu} ingredients={ing.rows} />
      ) : (
        <GlassCard><p className="muted text-xl">Belum ada menu.</p></GlassCard>
      )}

      {del.rows.length > 0 && (
        <GlassCard>
          <p className="mb-2 text-xl font-semibold">Distribusi</p>
          <ul className="line">
            {del.rows.map((d) => (
              <li key={d.name} className="flex items-center justify-between py-3 text-lg">
                <span>{d.name}</span>
                <span className={d.status === "sampai" ? "ok" : "muted"}>
                  {d.portions} porsi · {STATUS[d.status]}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </main>
  );
}
