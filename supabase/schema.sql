-- ============================================================
-- Azure Cove template — Supabase schema
-- Run this in: Supabase Dashboard -> SQL Editor
-- ============================================================

-- ---------- Tables ----------

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  capacity int not null default 2,
  price numeric(10, 2) not null default 0,
  status text not null default 'available'
    check (status in ('available', 'unavailable', 'maintenance')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_images (
  id bigint generated always as identity primary key,
  room_id bigint not null references public.rooms(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.amenities (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  icon text not null default 'Star',
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id bigint generated always as identity primary key,
  image_url text not null,
  caption text,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  customer_name text not null,
  email text not null,
  phone text not null,
  room_id bigint references public.rooms(id) on delete set null,
  check_in date not null,
  check_out date not null,
  guests int not null default 1 check (guests > 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'rejected')),
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.business_settings (
  id bigint generated always as identity primary key,
  business_name text,
  phone text,
  email text,
  address text,
  facebook text,
  instagram text,
  map_url text,
  description text,
  updated_at timestamptz not null default now()
);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists rooms_touch on public.rooms;
create trigger rooms_touch before update on public.rooms
  for each row execute function public.touch_updated_at();

-- ---------- Row Level Security ----------

alter table public.users enable row level security;
alter table public.rooms enable row level security;
alter table public.room_images enable row level security;
alter table public.amenities enable row level security;
alter table public.gallery enable row level security;
alter table public.bookings enable row level security;
alter table public.inquiries enable row level security;
alter table public.business_settings enable row level security;

-- helper: is the caller an authenticated admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select auth.role() = 'authenticated';
$$;

-- Public website (anon) can READ display content
create policy "public read rooms" on public.rooms
  for select using (true);
create policy "public read room_images" on public.room_images
  for select using (true);
create policy "public read amenities" on public.amenities
  for select using (true);
create policy "public read gallery" on public.gallery
  for select using (true);
create policy "public read settings" on public.business_settings
  for select using (true);

-- Anyone (anon) can SUBMIT bookings and inquiries…
create policy "public insert bookings" on public.bookings
  for insert with check (true);
create policy "public insert inquiries" on public.inquiries
  for insert with check (true);

-- …but only admins can read/update/delete them
create policy "admin read bookings" on public.bookings
  for select using (public.is_admin());
create policy "admin update bookings" on public.bookings
  for update using (public.is_admin());
create policy "admin delete bookings" on public.bookings
  for delete using (public.is_admin());
create policy "admin read inquiries" on public.inquiries
  for select using (public.is_admin());
create policy "admin update inquiries" on public.inquiries
  for update using (public.is_admin());
create policy "admin delete inquiries" on public.inquiries
  for delete using (public.is_admin());

-- Full management of content tables requires authentication
create policy "admin write rooms" on public.rooms
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write room_images" on public.room_images
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write amenities" on public.amenities
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write gallery" on public.gallery
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write settings" on public.business_settings
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write users" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage buckets ----------

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true), ('room-images', 'room-images', true)
on conflict (id) do nothing;

create policy "public read files" on storage.objects
  for select using (bucket_id in ('gallery', 'room-images'));

create policy "admin upload files" on storage.objects
  for insert with check (bucket_id in ('gallery', 'room-images') and public.is_admin());

create policy "admin delete files" on storage.objects
  for delete using (bucket_id in ('gallery', 'room-images') and public.is_admin());

-- ---------- Seed data ----------

insert into public.rooms (name, description, capacity, price, status, featured) values
  ('Deluxe Seaview Room', 'Wake up to a panoramic view of the cove. Air-conditioned with a king bed, private balcony, and rain shower.', 2, 4500, 'available', true),
  ('Family Cottage', 'A spacious native cottage with two queen beds, a sala area, and a wide veranda facing the garden.', 6, 6800, 'available', true),
  ('Beachfront Villa', 'Our signature villa sits right on the sand with a private plunge pool and outdoor lounge.', 4, 12000, 'available', true),
  ('Garden Twin Room', 'A cozy, budget-friendly room with two single beds surrounded by tropical greenery.', 2, 2800, 'available', false);

insert into public.amenities (name, description, icon) values
  ('Infinity Pool', 'Ocean-facing pool open 7 AM – 10 PM', 'Waves'),
  ('Private Beach', 'Exclusive white-sand cove access', 'Umbrella'),
  ('Island Restaurant', 'Fresh seafood and Filipino classics daily', 'UtensilsCrossed'),
  ('Free Wi-Fi', 'High-speed internet in all rooms', 'Wifi'),
  ('Airport Transfer', 'Convenient pick-up and drop-off service', 'Ship'),
  ('Event Pavilion', 'Venue for weddings and corporate events', 'PartyPopper');

insert into public.business_settings
  (business_name, phone, email, address, facebook, instagram, map_url, description)
values
  ('Azure Cove Beach Resort', '+63 917 123 4567', 'hello@azurecove.ph',
   '123 Shoreline Road, Brgy. San Isidro, Batangas, Philippines',
   'https://facebook.com/azurecove', 'https://instagram.com/azurecove',
   'https://maps.google.com/?q=Batangas+Philippines',
   'Azure Cove Beach Resort is a beachfront getaway featuring native cottages, an infinity pool, and direct access to a private white-sand cove.');

-- ============================================================
-- After running this schema:
-- 1. Create an admin user under Authentication -> Users
-- 2. Insert its profile:
--    insert into public.users (id, name, email)
--    values ('<auth-user-uuid>', 'Owner', 'owner@example.com');
-- 3. Put VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
-- ============================================================


