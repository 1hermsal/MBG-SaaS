-- Harga contoh untuk instalasi baru (bisa diubah owner dari aplikasi)
update kitchens set price_per_portion = 15000;
update stock_items set unit_price = case name
  when 'Beras' then 14000 when 'Ayam' then 38000 when 'Sayur' then 12000 else 0 end;
insert into menu_ingredients (menu_id, stock_item_id, qty_per_portion) values (2, 1, 0.1), (2, 3, 0.06);
