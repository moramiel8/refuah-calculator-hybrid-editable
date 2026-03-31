update public.profiles
set username = lower(username)
where username is not null
  and username <> lower(username);

create unique index if not exists profiles_username_lower_unique_idx
on public.profiles (lower(username))
where username is not null
  and btrim(username) <> '';
