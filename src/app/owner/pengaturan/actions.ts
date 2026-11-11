"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireRole, hashPassword } from "@/lib/auth";

export type FormState = { error?: string; ok?: boolean } | null;

const ROLES = ["kepala_dapur", "ahli_gizi", "kurir", "owner", "admin_yayasan"];
const NEEDS_KITCHEN = ["kepala_dapur", "ahli_gizi", "kurir"];

export async function saveSchools(_p: FormState, fd: FormData): Promise<FormState> {
  await requireRole("owner");
  const c = await pool.connect();
  try {
    await c.query("begin");
    for (const [k, v] of fd.entries()) {
      if (!k.startsWith("school_") || v === "") continue;
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0) throw new Error("Jatah porsi harus angka bulat");
      await c.query("update schools set daily_portions = $1 where id = $2", [n, Number(k.slice(7))]);
    }
    const name = String(fd.get("new_name") ?? "").trim();
    const kitchen = Number(fd.get("new_kitchen"));
    const portions = Number(fd.get("new_portions") || 0);
    if (name && kitchen) {
      if (!Number.isInteger(portions) || portions < 0) throw new Error("Jatah sekolah baru harus angka bulat");
      await c.query("insert into schools (kitchen_id, name, daily_portions) values ($1, $2, $3)", [kitchen, name, portions]);
    }
    await c.query("commit");
  } catch (e) {
    await c.query("rollback");
    return { error: e instanceof Error ? e.message : "Gagal menyimpan" };
  } finally {
    c.release();
  }
  revalidatePath("/owner/pengaturan");
  return { ok: true };
}

export async function addKitchen(_p: FormState, fd: FormData): Promise<FormState> {
  await requireRole("owner");
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { error: "Isi nama dapur" };
  await pool.query("insert into kitchens (name) values ($1)", [name]);
  revalidatePath("/owner");
  revalidatePath("/owner/pengaturan");
  return { ok: true };
}

export async function addUser(_p: FormState, fd: FormData): Promise<FormState> {
  await requireRole("owner");
  const name = String(fd.get("name") ?? "").trim();
  const username = String(fd.get("username") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const role = String(fd.get("role") ?? "");
  const kitchen = Number(fd.get("kitchen")) || null;

  if (!name || !/^[a-z0-9._-]{3,}$/.test(username)) return { error: "Nama dan nama pengguna (min 3 huruf/angka) wajib diisi" };
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter" };
  if (!ROLES.includes(role)) return { error: "Pilih peran" };
  if (NEEDS_KITCHEN.includes(role) && !kitchen) return { error: "Peran ini perlu dapur" };

  try {
    await pool.query(
      "insert into users (kitchen_id, username, password_hash, name, role) values ($1, $2, $3, $4, $5)",
      [NEEDS_KITCHEN.includes(role) ? kitchen : null, username, hashPassword(password), name, role]
    );
  } catch (e) {
    if ((e as { code?: string }).code === "23505") return { error: "Nama pengguna sudah dipakai" };
    return { error: "Gagal menyimpan" };
  }
  revalidatePath("/owner/pengaturan");
  return { ok: true };
}
