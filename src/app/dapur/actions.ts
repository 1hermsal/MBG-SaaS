"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export type CookState = { error: string } | null;

export async function cook(_prev: CookState, formData: FormData): Promise<CookState> {
  const s = await requireRole("kepala_dapur");
  const menuId = Number(formData.get("menuId"));
  const portions = Number(formData.get("portions"));
  if (!menuId || !Number.isInteger(portions) || portions <= 0) {
    return { error: "Isi jumlah porsi dengan benar" };
  }

  const client = await pool.connect();
  try {
    await client.query("begin");
    const own = await client.query("select 1 from menus where id = $1 and kitchen_id = $2", [menuId, s.kid]);
    if (!own.rowCount) throw new Error("Menu tidak ditemukan");
    const done = await client.query("select 1 from productions where menu_id = $1", [menuId]);
    if (done.rowCount) throw new Error("Sudah tercatat hari ini");

    const ing = await client.query(
      `select s.id, s.qty::float as qty, mi.qty_per_portion::float as per
       from menu_ingredients mi join stock_items s on s.id = mi.stock_item_id
       where mi.menu_id = $1 for update of s`,
      [menuId]
    );
    for (const r of ing.rows) {
      const use = r.per * portions;
      if (r.qty < use) throw new Error("Stok tidak cukup");
      await client.query("update stock_items set qty = qty - $1 where id = $2", [use, r.id]);
      await client.query(
        "insert into stock_movements (stock_item_id, change, reason) values ($1, $2, 'produksi')",
        [r.id, -use]
      );
    }
    await client.query("insert into productions (menu_id, portions, created_by) values ($1, $2, $3)", [menuId, portions, s.uid]);
    await client.query(
      `insert into deliveries (menu_id, school_id, portions)
       select $1, id, daily_portions from schools where kitchen_id = $2 and daily_portions > 0`,
      [menuId, s.kid]
    );
    await client.query("commit");
  } catch (e) {
    await client.query("rollback");
    return { error: e instanceof Error ? e.message : "Gagal menyimpan" };
  } finally {
    client.release();
  }
  revalidatePath("/dapur");
  return null;
}
