
-- Conversations table
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Conversation participants
CREATE TABLE public.conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  last_read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- Now create the function (table exists)
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_user_id uuid, _conversation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE user_id = _user_id AND conversation_id = _conversation_id
  )
$$;

-- Conversations RLS
CREATE POLICY "Users can view own conversations" ON public.conversations
FOR SELECT TO authenticated
USING (public.is_conversation_participant(auth.uid(), id));

CREATE POLICY "Auth users can create conversations" ON public.conversations
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own conversations" ON public.conversations
FOR UPDATE TO authenticated
USING (public.is_conversation_participant(auth.uid(), id));

-- Participants RLS
CREATE POLICY "Users can view participants of own conversations" ON public.conversation_participants
FOR SELECT TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Auth users can insert participants" ON public.conversation_participants
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update own participation" ON public.conversation_participants
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations" ON public.messages
FOR SELECT TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Users can send messages to own conversations" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid() AND public.is_conversation_participant(auth.uid(), conversation_id));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Reports
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_user_id uuid,
  entity_type text NOT NULL DEFAULT 'post',
  entity_id uuid,
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON public.reports
FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports" ON public.reports
FOR SELECT TO authenticated
USING (reporter_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Admins can update reports" ON public.reports
FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete reports" ON public.reports
FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Friendships
CREATE TABLE public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  addressee_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships" ON public.friendships
FOR SELECT TO authenticated
USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "Auth users can create friendships" ON public.friendships
FOR INSERT TO authenticated
WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update friendships addressed to them" ON public.friendships
FOR UPDATE TO authenticated
USING (addressee_id = auth.uid());

CREATE POLICY "Users can delete own friendships" ON public.friendships
FOR DELETE TO authenticated
USING (requester_id = auth.uid() OR addressee_id = auth.uid());

-- User files (personal library)
CREATE TABLE public.user_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own files" ON public.user_files
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own files" ON public.user_files
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own files" ON public.user_files
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Storage bucket for user files
INSERT INTO storage.buckets (id, name, public) VALUES ('user-files', 'user-files', true);

CREATE POLICY "Users can upload own files to user-files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own files from user-files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view user-files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'user-files');
