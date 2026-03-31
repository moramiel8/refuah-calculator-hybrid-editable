create or replace function public.can_manage_admissions(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = uid
      and (
        p.primary_role in ('owner', 'admin')
        or p.is_admin = true
        or (
          p.primary_role = 'editor'
          and coalesce(p.permissions, '{}'::text[]) @> array['admissions']::text[]
        )
      )
  );
$$;

drop policy if exists "Admins can insert score_thresholds" on public.score_thresholds;
drop policy if exists "Admins can update score_thresholds" on public.score_thresholds;
drop policy if exists "Admins can delete score_thresholds" on public.score_thresholds;

create policy "Admissions managers can insert score_thresholds"
on public.score_thresholds
for insert
to authenticated
with check (public.can_manage_admissions(auth.uid()));

create policy "Admissions managers can update score_thresholds"
on public.score_thresholds
for update
to authenticated
using (public.can_manage_admissions(auth.uid()))
with check (public.can_manage_admissions(auth.uid()));

create policy "Admissions managers can delete score_thresholds"
on public.score_thresholds
for delete
to authenticated
using (public.can_manage_admissions(auth.uid()));
