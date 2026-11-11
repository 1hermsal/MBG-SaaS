"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export type ExpenseState = { error?: string; ok?: boolean } | null;

export async function addExpense(_prev: ExpenseState, fd: FormData): Promise<ExpenseState> {
  await requireRole("owner");
  const kitchen = Number(fd.get("kitchen"));
  const date = String(fd.get("date") ?? "");
  const category = String(fd.get("category") ?? "").trim();
  const amount = Number(fd.get("amount"));
  const note = String(fd.get("note") ?? "").trim() || null;
  if (!kitchen || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !category || !(amount > 0)) {
    return { error: "Lengkapi dapur, tanggal, kategori, dan jumlah" };
  }
  await pool.query(
    "insert into expenses (kitchen_id, expense_date, category, amount, note) values ($1, $2, $3, $4, $5)",
    [kitchen, date, category, amount, note]
  );
  revalidatePath("/owner");
  revalidatePath("/owner/biaya");
  revalidatePath("/dapur");
  return { ok: true };
}

export async function deleteExpense(fd: FormData) {
  await requireRole("owner");
  const id = Number(fd.get("id"));
  if (!id) return;
  await pool.query("delete from expenses where id = $1", [id]);
  revalidatePath("/owner");
  revalidatePath("/owner/biaya");
  revalidatePath("/dapur");
}
