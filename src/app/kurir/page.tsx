import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { advance } from "./actions";

export const dynamic = "force-dynamic";

export default async function KurirPage() {
  const s = await requireRole("kurir");
  const r = await pool.query<{ id: number; name: string; portions: number; status: string }>(
    `select d.id, sc.name, d.portions, d.status from deliveries d
     join schools sc on sc.id = d.school_id join menus m on m.id = d.menu_id
     where m.kitchen_id = $1 and m.menu_date = current_date
     order by (d.status = 'sampai'), sc.name`,
    [s.kid]
  );

  return (
    <main className="mx-auto max-w-xl space-y-4 px-5 py-6">
      <AppHeader session={s} />
      {r.rows.length === 0 && (
        <GlassCard><p className="muted text-xl">Belum ada pengantaran.</p></GlassCard>
      )}
      {r.rows.map((d) => (
        <GlassCard key={d.id} className="space-y-4">
          <div>
            <p className="text-2xl font-semibold">{d.name}</p>
            <p className="muted text-lg">{d.portions} porsi</p>
          </div>
          {d.status === "sampai" ? (
            <p className="ok text-xl font-semibold">Sampai</p>
          ) : (
            <form action={advance}>
              <input type="hidden" name="id" value={d.id} />
              <Button type="submit">{d.status === "disiapkan" ? "Berangkat" : "Sampai"}</Button>
            </form>
          )}
        </GlassCard>
      ))}
    </main>
  );
}
