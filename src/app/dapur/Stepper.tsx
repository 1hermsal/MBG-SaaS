"use client";

import { useActionState, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { cook } from "./actions";
import type { Ingredient, TodayMenu } from "@/types";

export default function Stepper({ menu, ingredients }: { menu: TodayMenu; ingredients: Ingredient[] }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [state, formAction, pending] = useActionState(cook, null);
  const kurang = ingredients.some((i) => i.stock < i.need);

  return (
    <div className="space-y-6">
      <GlassCard>
        <p className="text-2xl font-semibold">{menu.name}</p>
        <p className="muted mt-1 text-lg">{menu.target_portions} porsi</p>
      </GlassCard>

      {menu.done ? (
        <GlassCard>
          <p className="ok text-2xl font-semibold">Selesai</p>
          <p className="muted mt-1 text-lg">{menu.made} porsi tercatat</p>
        </GlassCard>
      ) : step === 1 ? (
        <GlassCard className="space-y-4">
          <p className="text-xl font-semibold">Stok</p>
          <ul className="line">
            {ingredients.map((i) => (
              <li key={i.name} className="flex items-center justify-between py-3 text-lg">
                <span>{i.name}</span>
                <span className={i.stock >= i.need ? "muted" : "bad font-semibold"}>
                  {i.stock} / {i.need} {i.unit}
                </span>
              </li>
            ))}
          </ul>
          <Button disabled={kurang} onClick={() => setStep(2)}>
            {kurang ? "Stok kurang" : "Lanjut"}
          </Button>
        </GlassCard>
      ) : (
        <GlassCard>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="menuId" value={menu.id} />
            <label className="block text-xl font-semibold" htmlFor="portions">Porsi dimasak</label>
            <input id="portions" name="portions" type="number" inputMode="numeric" min={1} defaultValue={menu.target_portions} className="field !h-16 text-2xl" />
            {state?.error && <p className="bad text-lg">{state.error}</p>}
            <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan"}</Button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
