import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

const q = (v: string) => `"${v.replace(/"/g, '""')}"`;

export async function GET() {
  await requireRole("admin_yayasan");
  const r = await pool.query<{ date: string; kitchen: string; target: number; cooked: number; arrived: number }>(
    `select m.menu_date::text as date, k.name as kitchen, m.target_portions as target,
       coalesce(p.portions, 0)::int as cooked,
       coalesce(sum(d.portions) filter (where d.status = 'sampai'), 0)::int as arrived
     from menus m
     join kitchens k on k.id = m.kitchen_id
     left join productions p on p.menu_id = m.id
     left join deliveries d on d.menu_id = m.id
     where m.menu_date >= current_date - 29
     group by m.id, k.name, p.portions
     order by m.menu_date desc, k.name`
  );
  const lines = ["Tanggal,Dapur,Target,Dimasak,Sampai", ...r.rows.map((x) => [x.date, q(x.kitchen), x.target, x.cooked, x.arrived].join(","))];
  return new Response("\uFEFF" + lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="laporan-mbg-30-hari.csv"',
    },
  });
}
