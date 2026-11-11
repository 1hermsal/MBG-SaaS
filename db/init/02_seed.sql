insert into kitchens (name) values ('Dapur Contoh 1');

insert into users (kitchen_id, username, password_hash, name, role) values
  (1, 'kepala', '53b3ffa6700c053f:dab98884aa5a0ba8e6df8f68cce52f2acd30e2814eb083048fead460ab5f56616827c2c3775bf7f03f2318efd54697227d309a07963082e6a61d340fe9118608', 'Kepala Dapur', 'kepala_dapur'),
  (1, 'gizi', 'fc34cd6184827986:9673b7c91a6e196626e0a743e6876502e8ee66bba6cebdc56062dac831ebbf0c06af7da291a82b619cd740e74d9701ff63108ad8cf49e7df7c045ce531ad52df', 'Ahli Gizi', 'ahli_gizi'),
  (1, 'kurir', '37edc7876e86e966:c880e8e39cc92d6596bf2bb70d7c260c55813a277b555e1b3cb7c188df81acfa9edcf98f5c721e72c7ff20e8815f8a03657eb0a1fe51584a9df350875b6b5f8b', 'Kurir', 'kurir'),
  (null, 'owner', 'a31fde991a10e162:b7e5e05df1a4399f5a1b6cc25d109e2691df14f705649fa8fcc6eccbce4c42adb9a4c4e5500e0ccaa352b463aa325b9e1d10c59849c87bf9e090178b1d5a5cfb', 'Owner', 'owner'),
  (null, 'yayasan', '6a5f2889710468ed:6652813357c1c2e3deb29c7ecf0826b38b8adf9d2fe952a3f0d7ff327e7dceaa74313f137b11aed5c25d2be72078419bf77b28e3a1e28de302b149d7d735ab77', 'Admin Yayasan', 'admin_yayasan');

insert into schools (kitchen_id, name, daily_portions) values
  (1, 'SDN 1 Contoh', 300), (1, 'SDN 2 Contoh', 200);

insert into stock_items (kitchen_id, name, unit, qty, min_qty) values
  (1, 'Beras', 'kg', 120, 20),
  (1, 'Ayam', 'kg', 60, 25),
  (1, 'Sayur', 'kg', 40, 10);

insert into menus (kitchen_id, menu_date, name, target_portions) values
  (1, current_date, 'Nasi, ayam goreng, sayur', 500),
  (1, current_date - 1, 'Nasi, telur, sayur', 480);

insert into menu_ingredients (menu_id, stock_item_id, qty_per_portion) values
  (1, 1, 0.1), (1, 2, 0.08), (1, 3, 0.05);

-- data kemarin untuk contoh laporan
insert into productions (menu_id, portions, created_by) values (2, 480, 1);
insert into deliveries (menu_id, school_id, portions, status, courier_id, delivered_at) values
  (2, 1, 290, 'sampai', 3, now() - interval '1 day'),
  (2, 2, 190, 'sampai', 3, now() - interval '1 day');
