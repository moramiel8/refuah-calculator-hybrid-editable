UPDATE public.profiles
SET
  primary_role = 'owner',
  role = 'owner',
  is_admin = true
WHERE
  user_id = 'e154ae72-ebca-49c9-85f1-63a473063420'
  OR lower(coalesce(email, '')) = 'morku8@gmail.com'
  OR lower(coalesce(username, '')) = 'moramiel98';
