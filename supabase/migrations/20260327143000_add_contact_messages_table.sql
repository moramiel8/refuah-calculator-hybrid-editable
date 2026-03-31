CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  resend_message_id text,
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Service role can read contact messages"
    ON public.contact_messages FOR SELECT
    USING (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Service role can insert contact messages"
    ON public.contact_messages FOR INSERT
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_sender_user_id
  ON public.contact_messages(sender_user_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status
  ON public.contact_messages(status);

DELETE FROM public.email_send_log
WHERE status = 'pending'
  AND (
    template_name ILIKE '%contact%'
    OR recipient_email = 'support@refuah.io'
    OR coalesce(metadata->>'source', '') = 'contact-support'
    OR coalesce(metadata->>'flow', '') = 'contact-support'
  );
