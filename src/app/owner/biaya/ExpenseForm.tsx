"use client";

import { useActionState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { addExpense } from "./actions";

const CATEGORIES = ["Gaji", "Gas", "Listrik & air", "Transport", "Lainnya"];

export default function ExpenseForm({ kitchens, defaultDate }: { kitchens: { id: number; name: string }[]; defaultDate: string }) {
  const [state, formAction, pending] = useActionState(addExpense, null);
  return (
    <GlassCard>
      <form action={formAction} className="space-y-4">
        <select name="kitchen" aria-label="Dapur" className="field">
          {kitchens.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <input name="date" type="date" defaultValue={defaultDate} aria-label="Tanggal" className="field" />
        <select name="category" aria-label="Kategori" className="field">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input name="amount" type="number" min={0} step="1000" inputMode="numeric" placeholder="Jumlah (Rp)" aria-label="Jumlah" className="field" />
        <input name="note" placeholder="Catatan (opsional)" aria-label="Catatan" className="field" />
        {state?.error && <p className="bad">{state.error}</p>}
        {state?.ok && <p className="ok">Tersimpan</p>}
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan"}</Button>
      </form>
    </GlassCard>
  );
}
