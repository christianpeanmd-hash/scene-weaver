-- Add generation tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS monthly_generations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS generation_reset_at timestamp with time zone DEFAULT now();

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_generation_reset ON public.profiles (generation_reset_at);