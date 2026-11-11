import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import MenuForm from "./MenuForm";

export const dynamic = "force-dynamic";

export default async function GiziPage() {
  const s = await requireRole("ahli_gizi");
  const items = await pool.query<{ id: number; name: string; unit: string }>(
    "select id, name, unit from stock_items where kitchen_id = $1 order by name",
    [s.kid]
  );
  const recent = await pool.query<{ d: string; name: string; target_portions: number }>(
    "select menu_date::text as d, name, target_portions from menus where kitchen_id = $1 order by menu_date desc limit 5",
    [s.kid]
  );
  const tomorrow = new Date(Date.now() + 864e5).toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <AppHeader session={s} />
      <h1 className="text-3xl font-bold">Menu</h1>
      <MenuForm items={items.rows} defaultDate={tomorrow} />
      {recent.rows.length > 0 && (
        <GlassCard>
          <ul className="line">
            {recent.rows.map((r) => (
              <li key={r.d} className="flex items-center justify-between py-3">
                <span>{r.name}</span>
                <span className="muted">{r.d} · {r.target_portions}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </main>
  );
}
