
-- Add role column to conversation_participants
ALTER TABLE public.conversation_participants 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member';

-- Add message_type column for system messages
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS message_type text NOT NULL DEFAULT 'user';
