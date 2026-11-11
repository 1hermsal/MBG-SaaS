"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function advance(formData: FormData) {
  const s = await requireRole("kurir");
  const id = Number(formData.get("id"));
  if (!id) return;
  await pool.query(
    `update deliveries d set
       status = case d.status when 'disiapkan' then 'dikirim' when 'dikirim' then 'sampai' else d.status end,
       courier_id = $2,
       delivered_at = case when d.status = 'dikirim' then now() else d.delivered_at end
     from menus m
     where d.id = $1 and m.id = d.menu_id and m.kitchen_id = $3`,
    [id, s.uid, s.kid]
  );
  revalidatePath("/kurir");
}
