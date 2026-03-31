CREATE OR REPLACE FUNCTION public.delete_direct_conversation(
  _conversation_id uuid,
  _user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _conversation_type text;
BEGIN
  IF auth.uid() IS DISTINCT FROM _user_id THEN
    RAISE EXCEPTION 'Unauthorized conversation delete';
  END IF;

  SELECT type
  INTO _conversation_type
  FROM public.conversations
  WHERE id = _conversation_id;

  IF _conversation_type IS DISTINCT FROM 'direct' THEN
    RAISE EXCEPTION 'Only direct conversations can be deleted with this function';
  END IF;

  IF NOT public.is_conversation_participant(_user_id, _conversation_id) THEN
    RAISE EXCEPTION 'Only conversation participants can delete a conversation';
  END IF;

  DELETE FROM public.messages
  WHERE conversation_id = _conversation_id;

  DELETE FROM public.conversation_participants
  WHERE conversation_id = _conversation_id;

  DELETE FROM public.conversations
  WHERE id = _conversation_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_group_conversation(
  _conversation_id uuid,
  _admin_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _conversation_type text;
  _role text;
BEGIN
  IF auth.uid() IS DISTINCT FROM _admin_user_id THEN
    RAISE EXCEPTION 'Unauthorized group delete';
  END IF;

  SELECT type
  INTO _conversation_type
  FROM public.conversations
  WHERE id = _conversation_id;

  IF _conversation_type IS DISTINCT FROM 'group' THEN
    RAISE EXCEPTION 'Only groups can be deleted with this function';
  END IF;

  SELECT role
  INTO _role
  FROM public.conversation_participants
  WHERE conversation_id = _conversation_id
    AND user_id = _admin_user_id;

  IF _role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Only group admins can delete a group conversation';
  END IF;

  DELETE FROM public.messages
  WHERE conversation_id = _conversation_id;

  DELETE FROM public.conversation_participants
  WHERE conversation_id = _conversation_id;

  DELETE FROM public.conversations
  WHERE id = _conversation_id;
END;
$$;
