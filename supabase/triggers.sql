-- ============================================================
-- Email notification triggers (alternative to Dashboard Webhooks)
-- Run ONCE in Supabase SQL Editor.
-- Uses pg_net to call the booking-notification Edge Function
-- automatically on booking/inquiry changes. No dashboard config.
-- ============================================================

create extension if not exists pg_net;

-- ---------- bookings: INSERT + UPDATE ----------
create or replace function public.notify_booking_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://kcwhoxtolfqyaaypagwf.supabase.co/functions/v1/booking-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'sb_publishable_LONJ36WwuqzBxUIZMsZrLg_uiWKfKpN'
    ),
    body := jsonb_build_object(
      'type', tg_op,
      'table', 'bookings',
      'record', to_jsonb(NEW),
      'old_record', case when tg_op = 'UPDATE' then to_jsonb(OLD) else null end
    )
  );
  return coalesce(NEW, OLD);
end $$;

drop trigger if exists bookings_notify on public.bookings;
create trigger bookings_notify
after insert or update on public.bookings
for each row execute function public.notify_booking_event();

-- ---------- inquiries: INSERT ----------
create or replace function public.notify_inquiry_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://kcwhoxtolfqyaaypagwf.supabase.co/functions/v1/booking-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'sb_publishable_LONJ36WwuqzBxUIZMsZrLg_uiWKfKpN'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'inquiries',
      'record', to_jsonb(NEW),
      'old_record', null
    )
  );
  return coalesce(NEW, OLD);
end $$;

drop trigger if exists inquiries_notify on public.inquiries;
create trigger inquiries_notify
after insert on public.inquiries
for each row execute function public.notify_inquiry_event();

-- ---------- replies: INSERT (admin reply -> email the guest) ----------
-- Server-to-server fan-out via pg_net, so the browser never calls the
-- Edge Function directly (avoids CORS entirely).
create or replace function public.notify_reply_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://kcwhoxtolfqyaaypagwf.supabase.co/functions/v1/booking-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'sb_publishable_LONJ36WwuqzBxUIZMsZrLg_uiWKfKpN'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'replies',
      'record', to_jsonb(NEW),
      'old_record', null
    )
  );
  return coalesce(NEW, OLD);
end $$;

drop trigger if exists replies_notify on public.replies;
create trigger replies_notify
after insert on public.replies
for each row execute function public.notify_reply_event();
