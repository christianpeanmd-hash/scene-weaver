-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update all profiles (for tier management)
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all generation logs
CREATE POLICY "Admins can view all generation logs"
ON public.generation_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));