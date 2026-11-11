"use client";

import { useActionState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { saveSchools, addKitchen, addUser } from "./actions";

type Kitchen = { id: number; name: string };

function Msg({ s }: { s: { error?: string; ok?: boolean } | null }) {
  return (
    <>
      {s?.error && <p className="bad">{s.error}</p>}
      {s?.ok && <p className="ok">Tersimpan</p>}
    </>
  );
}

export function SekolahForm({ schools, kitchens }: { schools: { id: number; name: string; kitchen: string; portions: number }[]; kitchens: Kitchen[] }) {
  const [state, formAction, pending] = useActionState(saveSchools, null);
  return (
    <GlassCard>
      <form action={formAction} className="space-y-4">
        <p className="text-xl font-semibold">Sekolah</p>
        <ul className="line">
          {schools.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 py-3 text-lg">
              <span>{s.name} <span className="muted">· {s.kitchen}</span></span>
              <input name={`school_${s.id}`} type="number" min={0} inputMode="numeric" defaultValue={s.portions} aria-label={`Jatah ${s.name}`} className="field !h-12 !w-28 text-right" />
            </li>
          ))}
        </ul>
        <p className="muted">Sekolah baru</p>
        <select name="new_kitchen" aria-label="Dapur" className="field">
          {kitchens.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <input name="new_name" placeholder="Nama sekolah" aria-label="Nama sekolah" className="field" />
        <input name="new_portions" type="number" min={0} inputMode="numeric" placeholder="Jatah porsi" aria-label="Jatah porsi" className="field" />
        <Msg s={state} />
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan"}</Button>
      </form>
    </GlassCard>
  );
}

export function DapurForm() {
  const [state, formAction, pending] = useActionState(addKitchen, null);
  return (
    <GlassCard>
      <form action={formAction} className="space-y-4">
        <p className="text-xl font-semibold">Dapur baru</p>
        <input name="name" placeholder="Nama dapur" aria-label="Nama dapur" className="field" />
        <Msg s={state} />
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Tambah"}</Button>
      </form>
    </GlassCard>
  );
}

export function AkunForm({ users, kitchens, roles }: { users: { id: number; name: string; username: string; label: string }[]; kitchens: Kitchen[]; roles: { value: string; label: string }[] }) {
  const [state, formAction, pending] = useActionState(addUser, null);
  return (
    <GlassCard>
      <form action={formAction} className="space-y-4">
        <p className="text-xl font-semibold">Akun</p>
        <ul className="line">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between py-3">
              <span>{u.name} <span className="muted">· {u.username}</span></span>
              <span className="muted">{u.label}</span>
            </li>
          ))}
        </ul>
        <p className="muted">Akun baru</p>
        <input name="name" placeholder="Nama" aria-label="Nama" className="field" />
        <input name="username" placeholder="Nama pengguna" aria-label="Nama pengguna" autoCapitalize="none" className="field" />
        <input name="password" type="password" placeholder="Kata sandi (min 8)" aria-label="Kata sandi" autoComplete="new-password" className="field" />
        <select name="role" aria-label="Peran" className="field">
          {roles.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select name="kitchen" aria-label="Dapur" className="field">
          <option value="">Tanpa dapur (owner, yayasan)</option>
          {kitchens.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <Msg s={state} />
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Tambah akun"}</Button>
      </form>
    </GlassCard>
  );
}
