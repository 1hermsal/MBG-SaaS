import Link from "next/link";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { rupiah } from "@/lib/finance";
import AppHeader from "@/components/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import ExpenseForm from "./ExpenseForm";
import { deleteExpense } from "./actions";

export const dynamic = "force-dynamic";

export default async function BiayaPage() {
  const s = await requireRole("owner");
  const kitchens = await pool.query<{ id: number; name: string }>("select id, name from kitchens order by name");
  const recent = await pool.query<{ id: number; d: string; kitchen: string; category: string; amount: number; note: string | null }>(
    `select e.id, e.expense_date::text as d, k.name as kitchen, e.category, e.amount::float as amount, e.note
     from expenses e join kitchens k on k.id = e.kitchen_id
     order by e.expense_date desc, e.id desc limit 10`
  );
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <AppHeader session={s} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Biaya</h1>
        <Link href="/owner" className="muted hover:underline">Kembali</Link>
      </div>
      <ExpenseForm kitchens={kitchens.rows} defaultDate={today} />
      {recent.rows.length > 0 && (
        <GlassCard>
          <ul className="line">
            {recent.rows.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p>{e.category} · {rupiah(e.amount)}</p>
                  <p className="muted text-sm">{e.d} · {e.kitchen}{e.note ? ` · ${e.note}` : ""}</p>
                </div>
                <form action={deleteExpense}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="muted text-sm hover:underline">Hapus</button>
                </form>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </main>
  );
}
