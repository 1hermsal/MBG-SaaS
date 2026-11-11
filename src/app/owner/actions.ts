"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export type PriceState = { error?: string; ok?: boolean } | null;

export async function savePrices(_prev: PriceState, fd: FormData): Promise<PriceState> {
  await requireRole("owner");
  const c = await pool.connect();
  try {
    await c.query("begin");
    for (const [k, v] of fd.entries()) {
      if (v === "") continue;
      const n = Number(v);
      if (!(n >= 0)) throw new Error("Harga harus angka 0 atau lebih");
      if (k.startsWith("kitchen_")) {
        await c.query("update kitchens set price_per_portion = $1 where id = $2", [n, Number(k.slice(8))]);
      } else if (k.startsWith("item_")) {
        await c.query("update stock_items set unit_price = $1 where id = $2", [n, Number(k.slice(5))]);
      }
    }
    await c.query("commit");
  } catch (e) {
    await c.query("rollback");
    return { error: e instanceof Error ? e.message : "Gagal menyimpan" };
  } finally {
    c.release();
  }
  revalidatePath("/owner");
  revalidatePath("/dapur");
  return { ok: true };
}
