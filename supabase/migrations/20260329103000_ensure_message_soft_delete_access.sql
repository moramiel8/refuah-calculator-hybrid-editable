GRANT DELETE ON TABLE public.messages TO authenticated;
GRANT UPDATE ON TABLE public.messages TO authenticated;

DO $$ BEGIN
  CREATE POLICY "Users can delete own messages"
    ON public.messages
    FOR DELETE
    TO authenticated
    USING (sender_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can soft delete own messages"
    ON public.messages
    FOR UPDATE
    TO authenticated
    USING (sender_id = auth.uid())
    WITH CHECK (sender_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
