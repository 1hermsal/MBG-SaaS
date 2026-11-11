-- Jalankan sekali: docker exec -i mbg_db psql -U mbg -d mbg_dev < db/migrations/002_biaya_operasional.sql
create table if not exists expenses (
  id serial primary key,
  kitchen_id int not null references kitchens(id),
  expense_date date not null default current_date,
  category text not null,
  amount numeric not null check (amount >= 0),
  note text,
  created_at timestamptz not null default now()
);
