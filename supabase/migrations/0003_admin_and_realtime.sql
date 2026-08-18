-- Let the single authorized owner self-register as admin on first sign-in.
-- (Coexists with the is_admin() policy; permissive policies OR together.)
drop policy if exists "bootstrap authorized admin" on public.admins;
create policy "bootstrap authorized admin"
  on public.admins for insert
  with check (
    id = auth.uid()
    and lower(auth.jwt() ->> 'email') = lower('tanishkprajapati2026@gmail.com')
  );

-- Enable Supabase Realtime for the tables the app subscribes to
-- (storefront live catalogue + admin new-order badge). Guarded so re-runs are safe.
do $$
begin
  begin execute 'alter publication supabase_realtime add table public.products'; exception when others then null; end;
  begin execute 'alter publication supabase_realtime add table public.product_variants'; exception when others then null; end;
  begin execute 'alter publication supabase_realtime add table public.product_images'; exception when others then null; end;
  begin execute 'alter publication supabase_realtime add table public.orders'; exception when others then null; end;
end $$;
