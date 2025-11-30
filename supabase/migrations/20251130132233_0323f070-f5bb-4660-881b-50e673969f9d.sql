-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_scenes table
CREATE TABLE public.project_scenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  scene_name TEXT NOT NULL,
  scene_prompt TEXT,
  video_url TEXT,
  video_status TEXT DEFAULT 'pending',
  order_index INTEGER NOT NULL DEFAULT 0,
  character_ids UUID[],
  environment_id UUID,
  style_id UUID,
  duration_seconds INTEGER DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = user_id OR is_team_member(team_id, auth.uid()));

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id OR is_team_member(team_id, auth.uid()));

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on project_scenes
ALTER TABLE public.project_scenes ENABLE ROW LEVEL SECURITY;

-- Create policies for project_scenes (based on parent project ownership)
CREATE POLICY "Users can view scenes of their projects" 
ON public.project_scenes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_scenes.project_id 
  AND (projects.user_id = auth.uid() OR is_team_member(projects.team_id, auth.uid()))
));

CREATE POLICY "Users can create scenes in their projects" 
ON public.project_scenes 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_scenes.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can update scenes in their projects" 
ON public.project_scenes 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_scenes.project_id 
  AND (projects.user_id = auth.uid() OR is_team_member(projects.team_id, auth.uid()))
));

CREATE POLICY "Users can delete scenes in their projects" 
ON public.project_scenes 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = project_scenes.project_id 
  AND projects.user_id = auth.uid()
));

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_scenes_updated_at
BEFORE UPDATE ON public.project_scenes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();