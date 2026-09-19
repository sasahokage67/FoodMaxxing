-- =========================================================
-- FoodMaxxing: Таблица заказов и Realtime синхронизация
-- Вставьте этот код в Supabase -> SQL Editor -> Run
-- =========================================================

-- 1. Удаление старой таблицы, если уже существует (предотвращает ошибку 42P07: relation "orders" already exists)
drop table if exists public.orders cascade;

-- 2. Создание таблицы заказов
create table public.orders (
  id text primary key,
  order_number text not null,
  customer_id text,
  customer_name text not null,
  customer_phone text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric not null default 0,
  requested_pickup_time text not null,
  status text not null default 'SCHEDULED',
  estimated_ready_time text,
  scheduled_fire_time text,
  shelf_bay text,
  delay_minutes integer default 0,
  delay_reason text,
  created_at bigint not null,
  cooking_started_at bigint,
  ready_at bigint,
  picked_up_at bigint,
  actual_wait_time_seconds integer
);

-- 3. Включение Row Level Security (RLS)
alter table public.orders enable row level security;

-- 4. Политика доступа (разрешает чтение, добавление и изменение для анонимного ключа)
drop policy if exists "Allow public all access" on public.orders;
create policy "Allow public all access"
on public.orders
for all
to anon
using (true)
with check (true);

-- 5. Включение Realtime (безопасное добавление без ошибок)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;
