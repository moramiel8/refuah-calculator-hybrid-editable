
-- Add group chat columns to conversations
ALTER TABLE public.conversations 
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS group_name text,
  ADD COLUMN IF NOT EXISTS group_avatar text;

-- Add file_url column to messages for attachments
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS file_url text,
  ADD COLUMN IF NOT EXISTS file_type text;
