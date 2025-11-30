-- Add style_type column to library_scene_styles to support different style types
ALTER TABLE public.library_scene_styles 
ADD COLUMN IF NOT EXISTS style_type text NOT NULL DEFAULT 'video';

-- Create index for faster lookups by type
CREATE INDEX IF NOT EXISTS idx_library_scene_styles_type ON public.library_scene_styles(style_type);

-- Update existing RLS policies are already in place and work for this use case