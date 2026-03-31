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

  DELETE FROM public.conversations
  WHERE id = _conversation_id;
END;
$$;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by uuid;

CREATE OR REPLACE FUNCTION public.delete_message_with_audit(
  _message_id uuid,
  _user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sender_id uuid;
  _conversation_id uuid;
  _is_group_admin boolean;
BEGIN
  IF auth.uid() IS DISTINCT FROM _user_id THEN
    RAISE EXCEPTION 'Unauthorized message delete';
  END IF;

  SELECT sender_id, conversation_id
  INTO _sender_id, _conversation_id
  FROM public.messages
  WHERE id = _message_id;

  IF _conversation_id IS NULL THEN
    RAISE EXCEPTION 'Message not found';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE conversation_id = _conversation_id
      AND user_id = _user_id
      AND role = 'admin'
  )
  INTO _is_group_admin;

  IF _sender_id IS DISTINCT FROM _user_id AND NOT _is_group_admin THEN
    RAISE EXCEPTION 'Only the sender or a group admin can delete this message';
  END IF;

  UPDATE public.messages
  SET
    deleted_at = now(),
    deleted_by = _user_id,
    content = '',
    file_url = null,
    file_type = null,
    reply_to_id = null
  WHERE id = _message_id;
END;
$$;
