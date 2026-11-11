import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import Stat from "@/components/ui/Stat";

export const dynamic = "force-dynamic";

type Row = { id: number; name: string; target: number; cooked: number; arrived: number; low: number };

export default async function OwnerPage() {
  const s = await requireRole("owner");
  const r = await pool.query<Row>(
    `select k.id, k.name,
       coalesce(m.target_portions, 0)::int as target,
       coalesce(p.portions, 0)::int as cooked,
       coalesce((select sum(d.portions) from deliveries d where d.menu_id = m.id and d.status = 'sampai'), 0)::int as arrived,
       (select count(*) from stock_items si where si.kitchen_id = k.id and si.qty <= si.min_qty)::int as low
     from kitchens k
     left join menus m on m.kitchen_id = k.id and m.menu_date = current_date
     left join productions p on p.menu_id = m.id
     order by k.name`
  );
  const sum = (f: (x: Row) => number) => r.rows.reduce((a, x) => a + f(x), 0);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <AppHeader session={s} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Target" value={sum((x) => x.target)} />
        <Stat label="Dimasak" value={sum((x) => x.cooked)} />
        <Stat label="Sampai" value={sum((x) => x.arrived)} />
        <Stat label="Stok menipis" value={sum((x) => x.low)} bad={sum((x) => x.low) > 0} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {r.rows.map((k) => (
          <GlassCard key={k.id}>
            <p className="text-xl font-semibold">{k.name}</p>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {([["Target", k.target], ["Dimasak", k.cooked], ["Sampai", k.arrived], ["Menipis", k.low]] as const).map(([l, v]) => (
                <div key={l}>
                  <p className="muted text-sm">{l}</p>
                  <p className="text-2xl font-bold">{v}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
