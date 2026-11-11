import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
import GlassCard from "@/components/ui/GlassCard";

export const dynamic = "force-dynamic";

export default async function YayasanPage() {
  const s = await requireRole("admin_yayasan");
  const r = await pool.query<{ date: string; kitchen: string; target: number; cooked: number; arrived: number }>(
    `select m.menu_date::text as date, k.name as kitchen, m.target_portions as target,
       coalesce(p.portions, 0)::int as cooked,
       coalesce(sum(d.portions) filter (where d.status = 'sampai'), 0)::int as arrived
     from menus m
     join kitchens k on k.id = m.kitchen_id
     left join productions p on p.menu_id = m.id
     left join deliveries d on d.menu_id = m.id
     where m.menu_date >= current_date - 6
     group by m.id, k.name, p.portions
     order by m.menu_date desc, k.name`
  );

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <AppHeader session={s} />
      <h1 className="text-3xl font-bold">Laporan</h1>
      <GlassCard className="overflow-x-auto !p-2">
        <table className="w-full text-left text-lg">
          <thead className="muted">
            <tr>
              {["Tanggal", "Dapur", "Target", "Dimasak", "Sampai"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="line">
            {r.rows.map((x) => (
              <tr key={x.date + x.kitchen}>
                <td className="px-4 py-3">{x.date}</td>
                <td className="px-4 py-3">{x.kitchen}</td>
                <td className="px-4 py-3">{x.target}</td>
                <td className="px-4 py-3">{x.cooked}</td>
                <td className="px-4 py-3">{x.arrived}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </main>
  );
}
