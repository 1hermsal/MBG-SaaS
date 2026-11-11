"use client";

import { useActionState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);
  return (
    <GlassCard className="w-full max-w-md">
      <form action={formAction} className="space-y-4">
        <h1 className="text-3xl font-bold">MBG</h1>
        <input name="username" aria-label="Nama pengguna" placeholder="Nama pengguna" autoComplete="username" autoCapitalize="none" required className="field" />
        <input name="password" type="password" aria-label="Kata sandi" placeholder="Kata sandi" autoComplete="current-password" required className="field" />
        {state?.error && <p className="bad">{state.error}</p>}
        <Button type="submit" disabled={pending}>{pending ? "Memeriksa..." : "Masuk"}</Button>
      </form>
    </GlassCard>
  );
}
