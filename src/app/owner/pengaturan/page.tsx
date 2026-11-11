import Link from "next/link";
import { pool } from "@/lib/db";
import { requireRole, ROLE_LABEL } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
import PriceForm from "../PriceForm";
import { SekolahForm, DapurForm, AkunForm } from "./Forms";
import type { Role } from "@/types";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const s = await requireRole("owner");
  const kitchens = await pool.query<{ id: number; name: string; price: number }>(
    "select id, name, price_per_portion::float as price from kitchens order by name"
  );
  const items = await pool.query<{ id: number; kitchen_id: number; name: string; unit: string; price: number }>(
    "select id, kitchen_id, name, unit, unit_price::float as price from stock_items order by name"
  );
  const schools = await pool.query<{ id: number; name: string; kitchen: string; portions: number }>(
    "select sc.id, sc.name, k.name as kitchen, sc.daily_portions as portions from schools sc join kitchens k on k.id = sc.kitchen_id order by k.name, sc.name"
  );
  const users = await pool.query<{ id: number; name: string; username: string; role: Role }>(
    "select id, name, username, role from users order by id"
  );
  const roles = (Object.keys(ROLE_LABEL) as Role[]).map((v) => ({ value: v, label: ROLE_LABEL[v] }));

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <AppHeader session={s} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <Link href="/owner" className="muted hover:underline">Kembali</Link>
      </div>
      <PriceForm kitchens={kitchens.rows} items={items.rows} />
      <SekolahForm schools={schools.rows} kitchens={kitchens.rows} />
      <DapurForm />
      <AkunForm
        users={users.rows.map((u) => ({ id: u.id, name: u.name, username: u.username, label: ROLE_LABEL[u.role] }))}
        kitchens={kitchens.rows}
        roles={roles}
      />
    </main>
  );
}
