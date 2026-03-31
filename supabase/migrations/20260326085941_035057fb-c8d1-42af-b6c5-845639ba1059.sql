
-- Tighten conversation insert: user must also add themselves as participant
DROP POLICY "Auth users can create conversations" ON public.conversations;
CREATE POLICY "Auth users can create conversations" ON public.conversations
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = id AND user_id = auth.uid()
  )
  OR NOT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = id
  )
);

-- Tighten participant insert: user must be participant or adding themselves
DROP POLICY "Auth users can insert participants" ON public.conversation_participants;
CREATE POLICY "Auth users can insert participants" ON public.conversation_participants
FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() OR public.is_conversation_participant(auth.uid(), conversation_id)
);
