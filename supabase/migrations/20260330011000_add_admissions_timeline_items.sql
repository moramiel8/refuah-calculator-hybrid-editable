create table if not exists public.admissions_timeline_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  description text,
  tags text[] not null default '{}'::text[],
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.admissions_timeline_items enable row level security;

create or replace function public.can_manage_timeline(uid uuid)
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
          and coalesce(p.permissions, '{}'::text[]) @> array['timeline']::text[]
        )
      )
  );
$$;

drop policy if exists "Anyone can view admissions timeline items" on public.admissions_timeline_items;
create policy "Anyone can view admissions timeline items"
on public.admissions_timeline_items
for select
using (deleted_at is null);

drop policy if exists "Timeline managers can insert admissions timeline items" on public.admissions_timeline_items;
create policy "Timeline managers can insert admissions timeline items"
on public.admissions_timeline_items
for insert
to authenticated
with check (public.can_manage_timeline(auth.uid()));

drop policy if exists "Timeline managers can update admissions timeline items" on public.admissions_timeline_items;
create policy "Timeline managers can update admissions timeline items"
on public.admissions_timeline_items
for update
to authenticated
using (public.can_manage_timeline(auth.uid()))
with check (public.can_manage_timeline(auth.uid()));

drop policy if exists "Timeline managers can delete admissions timeline items" on public.admissions_timeline_items;
create policy "Timeline managers can delete admissions timeline items"
on public.admissions_timeline_items
for delete
to authenticated
using (public.can_manage_timeline(auth.uid()));

insert into public.admissions_timeline_items (title, event_date, description, tags, sort_order)
select * from (
  values
    ('פסיכומטרי אביב', '2026-04-10'::date, 'המועד הקרוב לבחינת הפסיכומטרי. כדאי לסגור הרשמה ולעקוב אחרי הפרסומים הרשמיים.', array['פסיכומטרי', 'הרשמה']::text[], 0),
    ('תחילת בגרויות קיץ', '2026-05-20'::date, 'פתיחת תקופת בגרויות הקיץ לבחינות המרכזיות.', array['בגרויות', 'קיץ']::text[], 1),
    ('פסיכומטרי קיץ', '2026-07-05'::date, 'מועד נוסף לפסיכומטרי למי שמשפרים או ניגשים לראשונה.', array['פסיכומטרי']::text[], 2),
    ('היערכות למו״ר / מרק״ם', '2026-08-15'::date, 'חלון זמן מומלץ להשלמת הכנה לראיונות ולמבחנים האישיותיים.', array['מו״ר', 'מרק״ם']::text[], 3)
) as seed(title, event_date, description, tags, sort_order)
where not exists (
  select 1 from public.admissions_timeline_items existing where existing.deleted_at is null
);
