-- Chaudhary Bake & Cake — initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists pgcrypto;

-- =========================================================
-- ADMINS  (auth handled by Supabase Auth; this stores role)
-- =========================================================
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'staff' check (role in ('owner','staff')),
  created_at timestamptz not null default now()
);

-- helper: is the current auth user an admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- =========================================================
-- CATEGORIES
-- =========================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- PRODUCTS
-- =========================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  category_id uuid references public.categories(id) on delete set null,
  is_eggless boolean not null default true,
  tags text[] not null default '{}',
  in_stock boolean not null default true,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  weight_label text not null,           -- '500g', '1kg'
  price numeric(10,2) not null,
  stock_qty int not null default 0,
  sort_order int not null default 0
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  is_main boolean not null default false
);

-- =========================================================
-- CUSTOMERS
-- =========================================================
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- ORDERS
-- =========================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  pincode text not null,
  delivery_date date,
  delivery_slot text,
  status text not null default 'placed'
    check (status in ('placed','confirmed','baking','out_for_delivery','delivered','cancelled')),
  payment_method text not null check (payment_method in ('cod','online')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  razorpay_payment_id text,
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  cake_message text,
  special_instructions text,
  cancel_reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  variant_label text not null,
  unit_price numeric(10,2) not null,
  quantity int not null default 1,
  cake_message text
);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_images_product on public.product_images(product_id);
create index if not exists idx_items_order on public.order_items(order_id);

-- =========================================================
-- ROW-LEVEL SECURITY
-- =========================================================
alter table public.admins            enable row level security;
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.product_variants  enable row level security;
alter table public.product_images    enable row level security;
alter table public.customers         enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;

-- Public (anon) can READ the storefront catalogue
create policy "public read categories"       on public.categories       for select using (true);
create policy "public read products"          on public.products         for select using (true);
create policy "public read variants"          on public.product_variants for select using (true);
create policy "public read images"            on public.product_images   for select using (true);

-- Public can CREATE orders/customers/items (checkout), but not read others' orders
create policy "public create customers"       on public.customers        for insert with check (true);
create policy "public create orders"          on public.orders           for insert with check (true);
create policy "public create order_items"     on public.order_items      for insert with check (true);

-- Admins can do everything
create policy "admin all admins"      on public.admins           for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all categories"  on public.categories       for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all products"    on public.products         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all variants"    on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all images"      on public.product_images   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all customers"   on public.customers        for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all orders"      on public.orders           for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all order_items" on public.order_items      for all using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- STORAGE BUCKETS  (public read, admin write)
-- =========================================================
insert into storage.buckets (id, name, public) values ('product-images','product-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('category-images','category-images', true)
  on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "admin write product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

create policy "public read category images" on storage.objects
  for select using (bucket_id = 'category-images');
create policy "admin write category images" on storage.objects
  for insert with check (bucket_id = 'category-images' and public.is_admin());
