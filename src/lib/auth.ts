import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import type { Role } from "@/types";

export type Session = { uid: number; name: string; role: Role; kid: number | null };

export const ROLE_HOME: Record<Role, string> = {
  kepala_dapur: "/dapur",
  ahli_gizi: "/gizi",
  kurir: "/kurir",
  owner: "/owner",
  admin_yayasan: "/yayasan",
};

export const ROLE_LABEL: Record<Role, string> = {
  kepala_dapur: "Kepala dapur",
  ahli_gizi: "Ahli gizi",
  kurir: "Kurir",
  owner: "Owner",
  admin_yayasan: "Admin yayasan",
};

const COOKIE = "mbg_session";
const WEEK = 7 * 24 * 60 * 60;

function sign(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET belum diisi di .env.local");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const a = scryptSync(password, salt, 64);
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession(s: Session) {
  const body = Buffer.from(JSON.stringify({ ...s, exp: Date.now() + WEEK * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: WEEK,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;
  const [body, sig] = value.split(".");
  if (!body || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(body));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const d = JSON.parse(Buffer.from(body, "base64url").toString());
  if (d.exp < Date.now()) return null;
  return { uid: d.uid, name: d.name, role: d.role, kid: d.kid };
}

export async function requireRole(role: Role): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== role) redirect(ROLE_HOME[s.role]);
  return s;
}
