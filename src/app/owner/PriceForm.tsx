"use client";

import { useActionState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { savePrices } from "./actions";

type Kitchen = { id: number; name: string; price: number };
type Item = { id: number; kitchen_id: number; name: string; unit: string; price: number };

export default function PriceForm({ kitchens, items }: { kitchens: Kitchen[]; items: Item[] }) {
  const [state, formAction, pending] = useActionState(savePrices, null);
  return (
    <GlassCard>
      <form action={formAction} className="space-y-6">
        <p className="text-xl font-semibold">Harga</p>
        {kitchens.map((k) => (
          <div key={k.id} className="space-y-2">
            <p className="muted">{k.name}</p>
            <ul className="line">
              <li className="flex items-center justify-between gap-4 py-3 text-lg">
                <span>Per porsi</span>
                <input name={`kitchen_${k.id}`} type="number" min={0} step="100" inputMode="numeric" defaultValue={k.price} aria-label={`Harga per porsi ${k.name}`} className="field !h-12 !w-40 text-right" />
              </li>
              {items.filter((i) => i.kitchen_id === k.id).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 py-3 text-lg">
                  <span>{i.name} <span className="muted">/ {i.unit}</span></span>
                  <input name={`item_${i.id}`} type="number" min={0} step="100" inputMode="numeric" defaultValue={i.price} aria-label={`Harga ${i.name}`} className="field !h-12 !w-40 text-right" />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {state?.error && <p className="bad">{state.error}</p>}
        {state?.ok && <p className="ok">Tersimpan</p>}
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan"}</Button>
      </form>
    </GlassCard>
  );
}
