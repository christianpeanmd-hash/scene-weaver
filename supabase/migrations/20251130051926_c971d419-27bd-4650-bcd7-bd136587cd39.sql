-- Fix usage_tracking RLS: Remove overly permissive policy and add proper ones
DROP POLICY IF EXISTS "Service role can manage usage tracking" ON public.usage_tracking;

-- Allow edge functions (using service role) to manage usage tracking
CREATE POLICY "Service role full access" 
ON public.usage_tracking 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Deny anonymous users from accessing usage_tracking
CREATE POLICY "Deny anonymous access to usage_tracking" 
ON public.usage_tracking 
FOR ALL 
TO anon 
USING (false);

-- Deny anonymous users from reading profiles
CREATE POLICY "Deny anonymous reads on profiles" 
ON public.profiles 
FOR SELECT 
TO anon 
USING (false);

-- Deny anonymous users from reading user_roles
CREATE POLICY "Deny anonymous reads on user_roles" 
ON public.user_roles 
FOR SELECT 
TO anon 
USING (false);