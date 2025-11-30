-- Add deny policy for anonymous reads on invite_requests
CREATE POLICY "Deny anonymous reads on invite_requests" 
ON public.invite_requests 
FOR SELECT 
TO anon 
USING (false);