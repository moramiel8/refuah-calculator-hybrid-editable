create or replace function public.can_moderate_community(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = uid
      and (
        is_admin = true
        or primary_role in ('owner', 'admin', 'moderator')
        or role in ('owner', 'admin', 'moderator')
      )
  );
$$;

drop policy if exists "Users or admins can delete questions" on public.community_questions;
drop policy if exists "Admins can update any question" on public.community_questions;

create policy "Users or community managers can delete questions"
on public.community_questions
for delete
to authenticated
using (auth.uid() = user_id or public.can_moderate_community(auth.uid()));

create policy "Community managers can update any question"
on public.community_questions
for update
to authenticated
using (public.can_moderate_community(auth.uid()));

drop policy if exists "Users or admins can delete replies" on public.community_replies;
drop policy if exists "Admins can update any reply" on public.community_replies;

create policy "Users or community managers can delete replies"
on public.community_replies
for delete
to authenticated
using (auth.uid() = user_id or public.can_moderate_community(auth.uid()));

create policy "Community managers can update any reply"
on public.community_replies
for update
to authenticated
using (public.can_moderate_community(auth.uid()));
