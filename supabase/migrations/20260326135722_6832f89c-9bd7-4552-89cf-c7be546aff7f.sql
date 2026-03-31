-- Allow conversation admins to update other participants (for role promotion)
CREATE POLICY "Admins can update participant roles"
ON public.conversation_participants
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
    AND cp.role = 'admin'
  )
);

-- Allow conversation admins to remove participants
CREATE POLICY "Admins can remove participants"
ON public.conversation_participants
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
    AND cp.role = 'admin'
  )
);

-- Create a security definer function for system messages and admin promotion on leave
CREATE OR REPLACE FUNCTION public.leave_group_and_promote(
  _conversation_id uuid,
  _user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _name text;
  _my_role text;
  _new_admin_id uuid;
  _new_admin_name text;
  _remaining_count int;
BEGIN
  -- Get user name
  SELECT first_name INTO _name FROM profiles WHERE user_id = _user_id;
  IF _name IS NULL THEN _name := 'מישהו'; END IF;

  -- Get user's role in the group
  SELECT role INTO _my_role FROM conversation_participants
    WHERE conversation_id = _conversation_id AND user_id = _user_id;

  -- Remove user from group
  DELETE FROM conversation_participants
    WHERE conversation_id = _conversation_id AND user_id = _user_id;

  -- Count remaining
  SELECT count(*) INTO _remaining_count FROM conversation_participants
    WHERE conversation_id = _conversation_id;

  IF _remaining_count = 0 THEN
    DELETE FROM conversations WHERE id = _conversation_id;
    RETURN;
  END IF;

  -- If admin left, promote oldest member
  IF _my_role = 'admin' THEN
    IF NOT EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = _conversation_id AND role = 'admin') THEN
      SELECT user_id INTO _new_admin_id FROM conversation_participants
        WHERE conversation_id = _conversation_id
        ORDER BY created_at ASC LIMIT 1;

      UPDATE conversation_participants SET role = 'admin'
        WHERE conversation_id = _conversation_id AND user_id = _new_admin_id;

      SELECT first_name INTO _new_admin_name FROM profiles WHERE user_id = _new_admin_id;
      
      INSERT INTO messages (conversation_id, sender_id, content, message_type)
        VALUES (_conversation_id, '00000000-0000-0000-0000-000000000000', 
          COALESCE(_new_admin_name, 'מישהו') || ' הפך/ה למנהל/ת הקבוצה', 'system');
    END IF;
  END IF;

  -- System message for leaving
  INSERT INTO messages (conversation_id, sender_id, content, message_type)
    VALUES (_conversation_id, '00000000-0000-0000-0000-000000000000', 
      _name || ' עזב/ה את הקבוצה', 'system');
END;
$$;

-- Also create function for system messages (used by other operations)
CREATE OR REPLACE FUNCTION public.send_system_message(
  _conversation_id uuid,
  _content text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO messages (conversation_id, sender_id, content, message_type)
    VALUES (_conversation_id, '00000000-0000-0000-0000-000000000000', _content, 'system');
END;
$$;