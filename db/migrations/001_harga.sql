-- Jalankan sekali di database yang sudah ada (tanpa reset data):
-- docker exec -i mbg_db psql -U mbg -d mbg_dev < db/migrations/001_harga.sql
alter table kitchens add column if not exists price_per_portion numeric not null default 0;
alter table stock_items add column if not exists unit_price numeric not null default 0;

update kitchens set price_per_portion = 15000 where price_per_portion = 0;
update stock_items set unit_price = case name
  when 'Beras' then 14000 when 'Ayam' then 38000 when 'Sayur' then 12000 else 0 end
  where unit_price = 0;

insert into menu_ingredients (menu_id, stock_item_id, qty_per_portion)
  select 2, id, case name when 'Beras' then 0.1 else 0.06 end
  from stock_items
  where kitchen_id = 1 and name in ('Beras', 'Sayur') and exists (select 1 from menus where id = 2)
on conflict do nothing;
