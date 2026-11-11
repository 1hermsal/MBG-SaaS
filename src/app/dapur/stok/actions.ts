"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export type StokState = { error?: string; ok?: boolean } | null;

export async function addStock(_prev: StokState, fd: FormData): Promise<StokState> {
  const s = await requireRole("kepala_dapur");
  const id = Number(fd.get("itemId"));
  const qty = Number(fd.get("qty"));
  if (!id || !(qty > 0)) return { error: "Pilih bahan dan isi jumlah" };

  const c = await pool.connect();
  try {
    await c.query("begin");
    const r = await c.query("update stock_items set qty = qty + $1 where id = $2 and kitchen_id = $3 returning id", [qty, id, s.kid]);
    if (!r.rowCount) throw new Error("Bahan tidak ditemukan");
    await c.query("insert into stock_movements (stock_item_id, change, reason) values ($1, $2, 'masuk')", [id, qty]);
    await c.query("commit");
  } catch (e) {
    await c.query("rollback");
    return { error: e instanceof Error ? e.message : "Gagal menyimpan" };
  } finally {
    c.release();
  }
  revalidatePath("/dapur/stok");
  revalidatePath("/dapur");
  return { ok: true };
}
