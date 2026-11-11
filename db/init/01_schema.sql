create table kitchens (
  id serial primary key,
  name text not null
);

create table users (
  id serial primary key,
  kitchen_id int references kitchens(id),
  username text not null unique,
  password_hash text not null,
  name text not null,
  role text not null check (role in ('ahli_gizi','kepala_dapur','kurir','owner','admin_yayasan'))
);

create table schools (
  id serial primary key,
  kitchen_id int not null references kitchens(id),
  name text not null,
  daily_portions int not null default 0
);

create table stock_items (
  id serial primary key,
  kitchen_id int not null references kitchens(id),
  name text not null,
  unit text not null,
  qty numeric not null default 0,
  min_qty numeric not null default 0
);

create table menus (
  id serial primary key,
  kitchen_id int not null references kitchens(id),
  menu_date date not null,
  name text not null,
  target_portions int not null,
  unique (kitchen_id, menu_date)
);

create table menu_ingredients (
  menu_id int references menus(id) on delete cascade,
  stock_item_id int references stock_items(id),
  qty_per_portion numeric not null,
  primary key (menu_id, stock_item_id)
);

create table productions (
  id serial primary key,
  menu_id int not null unique references menus(id),
  portions int not null,
  created_by int references users(id),
  created_at timestamptz not null default now()
);

create table stock_movements (
  id serial primary key,
  stock_item_id int not null references stock_items(id),
  change numeric not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table deliveries (
  id serial primary key,
  menu_id int not null references menus(id),
  school_id int not null references schools(id),
  portions int not null,
  status text not null default 'disiapkan' check (status in ('disiapkan','dikirim','sampai')),
  courier_id int references users(id),
  delivered_at timestamptz
);
