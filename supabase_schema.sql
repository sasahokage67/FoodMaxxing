-- =========================================================
-- FoodMaxxing: Таблица заказов и Realtime синхронизация
-- Вставьте этот код в Supabase -> SQL Editor -> Run
-- =========================================================

-- 1. Создание таблицы заказов
create table if not exists public.orders (
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

-- 2. Включение Row Level Security (RLS)
alter table public.orders enable row level security;

-- 3. Политика доступа (разрешает чтение, добавление и изменение для анонимного ключа)
drop policy if exists "Allow public all access" on public.orders;
create policy "Allow public all access"
on public.orders
for all
to anon
using (true)
with check (true);

-- 4. Включение Realtime (мгновенные уведомления без перезагрузки)
alter publication supabase_realtime add table public.orders;
