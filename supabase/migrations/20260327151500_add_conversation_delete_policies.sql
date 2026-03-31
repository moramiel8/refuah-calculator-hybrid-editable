DO $$ BEGIN
  CREATE POLICY "Users can delete own direct conversations"
    ON public.conversations
    FOR DELETE
    TO authenticated
    USING (
      type = 'direct'
      AND public.is_conversation_participant(auth.uid(), id)
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can delete own group conversations"
    ON public.conversations
    FOR DELETE
    TO authenticated
    USING (
      type = 'group'
      AND EXISTS (
        SELECT 1
        FROM public.conversation_participants cp
        WHERE cp.conversation_id = conversations.id
          AND cp.user_id = auth.uid()
          AND cp.role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
