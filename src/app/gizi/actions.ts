"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export type MenuState = { error?: string; ok?: boolean } | null;

export async function saveMenu(_prev: MenuState, fd: FormData): Promise<MenuState> {
  const s = await requireRole("ahli_gizi");
  const date = String(fd.get("date") ?? "");
  const name = String(fd.get("name") ?? "").trim();
  const portions = Number(fd.get("portions"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !name || !Number.isInteger(portions) || portions <= 0) {
    return { error: "Lengkapi tanggal, menu, dan porsi" };
  }
  const ing = [...fd.entries()]
    .filter(([k, v]) => k.startsWith("ing_") && Number(v) > 0)
    .map(([k, v]) => [Number(k.slice(4)), Number(v)] as const);
  if (!ing.length) return { error: "Isi minimal satu bahan" };

  const c = await pool.connect();
  try {
    await c.query("begin");
    const m = await c.query(
      `insert into menus (kitchen_id, menu_date, name, target_portions) values ($1, $2, $3, $4)
       on conflict (kitchen_id, menu_date) do update set name = excluded.name, target_portions = excluded.target_portions
       returning id`,
      [s.kid, date, name, portions]
    );
    const id = m.rows[0].id;
    const done = await c.query("select 1 from productions where menu_id = $1", [id]);
    if (done.rowCount) throw new Error("Menu ini sudah dimasak");
    await c.query("delete from menu_ingredients where menu_id = $1", [id]);
    for (const [sid, q] of ing) {
      await c.query(
        `insert into menu_ingredients (menu_id, stock_item_id, qty_per_portion)
         select $1::int, id, $3::numeric from stock_items where id = $2 and kitchen_id = $4`,
        [id, sid, q, s.kid]
      );
    }
    await c.query("commit");
  } catch (e) {
    await c.query("rollback");
    return { error: e instanceof Error ? e.message : "Gagal menyimpan" };
  } finally {
    c.release();
  }
  revalidatePath("/gizi");
  return { ok: true };
}
