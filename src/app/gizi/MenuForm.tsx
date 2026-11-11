"use client";

import { useActionState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { saveMenu } from "./actions";

type Item = { id: number; name: string; unit: string };

export default function MenuForm({ items, defaultDate }: { items: Item[]; defaultDate: string }) {
  const [state, formAction, pending] = useActionState(saveMenu, null);
  return (
    <GlassCard>
      <form action={formAction} className="space-y-4">
        <input name="date" type="date" defaultValue={defaultDate} aria-label="Tanggal" className="field" />
        <input name="name" placeholder="Nama menu" aria-label="Nama menu" className="field" />
        <input name="portions" type="number" inputMode="numeric" min={1} placeholder="Target porsi" aria-label="Target porsi" className="field" />
        <p className="muted pt-2">Bahan per porsi</p>
        <ul className="line">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-4 py-3 text-lg">
              <span>{i.name}</span>
              <span className="flex items-center gap-2">
                <input name={`ing_${i.id}`} type="number" step="0.001" min={0} inputMode="decimal" placeholder="0" aria-label={i.name} className="field !h-12 !w-28 text-right" />
                <span className="muted w-8">{i.unit}</span>
              </span>
            </li>
          ))}
        </ul>
        {state?.error && <p className="bad">{state.error}</p>}
        {state?.ok && <p className="ok">Tersimpan</p>}
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan"}</Button>
      </form>
    </GlassCard>
  );
}
