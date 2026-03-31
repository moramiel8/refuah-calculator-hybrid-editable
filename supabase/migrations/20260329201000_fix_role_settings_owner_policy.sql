drop policy if exists "Owner can update role settings" on public.role_settings;
drop policy if exists "Owner can insert role settings" on public.role_settings;

create policy "Owner can update role settings"
on public.role_settings
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and (
        primary_role = 'owner'
        or role = 'owner'
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and (
        primary_role = 'owner'
        or role = 'owner'
      )
  )
);

create policy "Owner can insert role settings"
on public.role_settings
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and (
        primary_role = 'owner'
        or role = 'owner'
      )
  )
);
