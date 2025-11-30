-- Add ip_hash column to invite_requests for rate limiting
ALTER TABLE public.invite_requests 
ADD COLUMN IF NOT EXISTS ip_hash text;

-- Create index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_invite_requests_ip_hash_created 
ON public.invite_requests (ip_hash, created_at DESC);

-- Update the INSERT policy to be more restrictive (only via edge function with service role)
DROP POLICY IF EXISTS "Anyone can submit invite requests" ON public.invite_requests;

-- Only allow inserts through service role (edge function)
-- This prevents direct client-side inserts that could bypass rate limiting
CREATE POLICY "Service role can insert invite requests" 
ON public.invite_requests 
FOR INSERT 
TO service_role
WITH CHECK (true);