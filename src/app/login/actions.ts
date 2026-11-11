"use server";

import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import { createSession, destroySession, verifyPassword, ROLE_HOME } from "@/lib/auth";
import type { Role } from "@/types";

export type LoginState = { error: string } | null;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const r = await pool.query(
    "select id, name, role, kitchen_id, password_hash from users where username = $1",
    [username]
  );
  const u = r.rows[0];
  if (!u || !verifyPassword(password, u.password_hash)) {
    return { error: "Nama pengguna atau kata sandi salah" };
  }
  await createSession({ uid: u.id, name: u.name, role: u.role as Role, kid: u.kitchen_id });
  redirect(ROLE_HOME[u.role as Role]);
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
