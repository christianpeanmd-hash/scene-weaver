-- Create generation_logs table to track each generation event
CREATE TABLE public.generation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  generation_type TEXT NOT NULL, -- 'template', 'image', 'infographic'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own generation logs
CREATE POLICY "Users can view their own generation logs"
  ON public.generation_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert generation logs (from edge functions)
CREATE POLICY "Service role can insert generation logs"
  ON public.generation_logs
  FOR INSERT
  WITH CHECK (true);

-- Create index for efficient queries
CREATE INDEX idx_generation_logs_user_created ON public.generation_logs(user_id, created_at DESC);
CREATE INDEX idx_generation_logs_created ON public.generation_logs(created_at DESC);