-- Create library tables for cloud-synced user content

-- Characters library
CREATE TABLE public.library_characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID, -- For Studio tier team sharing
  name TEXT NOT NULL,
  look TEXT,
  demeanor TEXT,
  role TEXT,
  enhanced_look TEXT,
  enhanced_demeanor TEXT,
  enhanced_role TEXT,
  source_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Environments library
CREATE TABLE public.library_environments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID,
  name TEXT NOT NULL,
  setting TEXT,
  lighting TEXT,
  audio TEXT,
  props TEXT,
  enhanced_setting TEXT,
  enhanced_lighting TEXT,
  enhanced_audio TEXT,
  enhanced_props TEXT,
  source_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Scene styles library
CREATE TABLE public.library_scene_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  is_preset BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Brands library
CREATE TABLE public.library_brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  colors TEXT[], -- Array of color strings
  fonts TEXT,
  logo_url TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Favorite photos library
CREATE TABLE public.library_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID,
  name TEXT NOT NULL,
  image_base64 TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Teams table for Studio tier collaboration
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team members junction table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  invited_email TEXT,
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.library_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_scene_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Helper function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE user_id = _user_id AND team_id = _team_id
  )
$$;

-- RLS Policies for library_characters
CREATE POLICY "Users can view their own characters"
  ON public.library_characters FOR SELECT
  USING (auth.uid() = user_id OR (team_id IS NOT NULL AND public.is_team_member(auth.uid(), team_id)));

CREATE POLICY "Users can insert their own characters"
  ON public.library_characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
  ON public.library_characters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
  ON public.library_characters FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for library_environments
CREATE POLICY "Users can view their own environments"
  ON public.library_environments FOR SELECT
  USING (auth.uid() = user_id OR (team_id IS NOT NULL AND public.is_team_member(auth.uid(), team_id)));

CREATE POLICY "Users can insert their own environments"
  ON public.library_environments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own environments"
  ON public.library_environments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own environments"
  ON public.library_environments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for library_scene_styles
CREATE POLICY "Users can view their own scene styles"
  ON public.library_scene_styles FOR SELECT
  USING (auth.uid() = user_id OR (team_id IS NOT NULL AND public.is_team_member(auth.uid(), team_id)));

CREATE POLICY "Users can insert their own scene styles"
  ON public.library_scene_styles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scene styles"
  ON public.library_scene_styles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scene styles"
  ON public.library_scene_styles FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for library_brands
CREATE POLICY "Users can view their own brands"
  ON public.library_brands FOR SELECT
  USING (auth.uid() = user_id OR (team_id IS NOT NULL AND public.is_team_member(auth.uid(), team_id)));

CREATE POLICY "Users can insert their own brands"
  ON public.library_brands FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands"
  ON public.library_brands FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands"
  ON public.library_brands FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for library_photos
CREATE POLICY "Users can view their own photos"
  ON public.library_photos FOR SELECT
  USING (auth.uid() = user_id OR (team_id IS NOT NULL AND public.is_team_member(auth.uid(), team_id)));

CREATE POLICY "Users can insert their own photos"
  ON public.library_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON public.library_photos FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for teams
CREATE POLICY "Users can view teams they own or belong to"
  ON public.teams FOR SELECT
  USING (auth.uid() = owner_id OR public.is_team_member(auth.uid(), id));

CREATE POLICY "Users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams"
  ON public.teams FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete their teams"
  ON public.teams FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their teams"
  ON public.team_members FOR SELECT
  USING (public.is_team_member(auth.uid(), team_id) OR 
         EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND owner_id = auth.uid()));

CREATE POLICY "Team owners can manage team members"
  ON public.team_members FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND owner_id = auth.uid()));

CREATE POLICY "Team owners can update team members"
  ON public.team_members FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND owner_id = auth.uid()));

CREATE POLICY "Team owners can remove team members"
  ON public.team_members FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND owner_id = auth.uid()) OR auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_library_characters_user ON public.library_characters(user_id);
CREATE INDEX idx_library_characters_team ON public.library_characters(team_id);
CREATE INDEX idx_library_environments_user ON public.library_environments(user_id);
CREATE INDEX idx_library_environments_team ON public.library_environments(team_id);
CREATE INDEX idx_library_scene_styles_user ON public.library_scene_styles(user_id);
CREATE INDEX idx_library_scene_styles_team ON public.library_scene_styles(team_id);
CREATE INDEX idx_library_brands_user ON public.library_brands(user_id);
CREATE INDEX idx_library_brands_team ON public.library_brands(team_id);
CREATE INDEX idx_library_photos_user ON public.library_photos(user_id);
CREATE INDEX idx_library_photos_team ON public.library_photos(team_id);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_library_characters_updated_at
  BEFORE UPDATE ON public.library_characters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_library_environments_updated_at
  BEFORE UPDATE ON public.library_environments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_library_scene_styles_updated_at
  BEFORE UPDATE ON public.library_scene_styles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_library_brands_updated_at
  BEFORE UPDATE ON public.library_brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();