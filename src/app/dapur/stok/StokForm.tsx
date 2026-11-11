"use client";

import { useActionState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { addStock } from "./actions";

export default function StokForm({ items }: { items: { id: number; name: string; unit: string }[] }) {
  const [state, formAction, pending] = useActionState(addStock, null);
  return (
    <GlassCard>
      <form action={formAction} className="space-y-4">
        <p className="text-xl font-semibold">Stok masuk</p>
        <select name="itemId" aria-label="Bahan" className="field">
          {items.map((i) => (
            <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
          ))}
        </select>
        <input name="qty" type="number" step="0.001" min={0} inputMode="decimal" placeholder="Jumlah" aria-label="Jumlah" className="field" />
        {state?.error && <p className="bad">{state.error}</p>}
        {state?.ok && <p className="ok">Tersimpan</p>}
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan"}</Button>
      </form>
    </GlassCard>
  );
}
