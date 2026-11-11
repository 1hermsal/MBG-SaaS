import Link from "next/link";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import StokForm from "./StokForm";

export const dynamic = "force-dynamic";

export default async function StokPage() {
  const s = await requireRole("kepala_dapur");
  const r = await pool.query<{ id: number; name: string; unit: string; qty: number; min_qty: number }>(
    "select id, name, unit, qty::float as qty, min_qty::float as min_qty from stock_items where kitchen_id = $1 order by name",
    [s.kid]
  );
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <AppHeader session={s} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stok</h1>
        <Link href="/dapur" className="muted hover:underline">Kembali</Link>
      </div>
      <GlassCard>
        <ul className="line">
          {r.rows.map((i) => (
            <li key={i.id} className="flex items-center justify-between py-3 text-lg">
              <span>{i.name}</span>
              <span className={i.qty <= i.min_qty ? "bad font-semibold" : "muted"}>{i.qty} {i.unit}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
      <StokForm items={r.rows} />
    </main>
  );
}
