-- Auto groups created before "first member = admin" had only members; group actions need an admin.
UPDATE public.conversation_participants cp
SET role = 'admin'
FROM (
  SELECT DISTINCT ON (c.id)
    c.id AS cid,
    cp_first.user_id AS uid
  FROM public.conversations c
  INNER JOIN public.conversation_participants cp_first ON cp_first.conversation_id = c.id
  WHERE c.auto_group_key IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.conversation_participants x
      WHERE x.conversation_id = c.id AND x.role = 'admin'
    )
  ORDER BY c.id, cp_first.created_at ASC
) sub
WHERE cp.conversation_id = sub.cid
  AND cp.user_id = sub.uid;
