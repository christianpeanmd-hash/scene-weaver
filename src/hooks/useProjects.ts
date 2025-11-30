import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface ProjectScene {
  id: string;
  project_id: string;
  scene_name: string;
  scene_prompt: string | null;
  video_url: string | null;
  video_status: string;
  order_index: number;
  character_ids: string[] | null;
  environment_id: string | null;
  style_id: string | null;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  team_id: string | null;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  scenes?: ProjectScene[];
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          scenes:project_scenes(*)
        `)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProjects((data as any[]) || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name: string, description?: string, teamId?: string): Promise<Project | null> => {
    if (!user) {
      toast.error("Please sign in to create projects");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          team_id: teamId || null,
          name,
          description: description || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newProject = data as Project;
      setProjects(prev => [newProject, ...prev]);
      toast.success("Project created!");
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error("Failed to create project");
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Pick<Project, 'name' | 'description'>>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
      ));
      toast.success("Project updated!");
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error("Failed to update project");
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("Project deleted!");
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error("Failed to delete project");
    }
  };

  const addScene = async (
    projectId: string, 
    sceneName: string, 
    options?: {
      prompt?: string;
      characterIds?: string[];
      environmentId?: string;
      styleId?: string;
      durationSeconds?: number;
    }
  ): Promise<ProjectScene | null> => {
    try {
      // Get current max order index
      const project = projects.find(p => p.id === projectId);
      const maxOrder = project?.scenes?.reduce((max, s) => Math.max(max, s.order_index), -1) ?? -1;

      const { data, error } = await supabase
        .from('project_scenes')
        .insert({
          project_id: projectId,
          scene_name: sceneName,
          scene_prompt: options?.prompt || null,
          character_ids: options?.characterIds || null,
          environment_id: options?.environmentId || null,
          style_id: options?.styleId || null,
          duration_seconds: options?.durationSeconds || 8,
          order_index: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;

      const newScene = data as ProjectScene;
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            scenes: [...(p.scenes || []), newScene],
            updated_at: new Date().toISOString()
          };
        }
        return p;
      }));

      toast.success("Scene added!");
      return newScene;
    } catch (err) {
      console.error('Error adding scene:', err);
      toast.error("Failed to add scene");
      return null;
    }
  };

  const updateScene = async (sceneId: string, updates: Partial<ProjectScene>) => {
    try {
      const { error } = await supabase
        .from('project_scenes')
        .update(updates)
        .eq('id', sceneId);

      if (error) throw error;

      setProjects(prev => prev.map(p => ({
        ...p,
        scenes: p.scenes?.map(s => 
          s.id === sceneId ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
        )
      })));
    } catch (err) {
      console.error('Error updating scene:', err);
      toast.error("Failed to update scene");
    }
  };

  const deleteScene = async (sceneId: string) => {
    try {
      const { error } = await supabase
        .from('project_scenes')
        .delete()
        .eq('id', sceneId);

      if (error) throw error;

      setProjects(prev => prev.map(p => ({
        ...p,
        scenes: p.scenes?.filter(s => s.id !== sceneId)
      })));
      toast.success("Scene deleted!");
    } catch (err) {
      console.error('Error deleting scene:', err);
      toast.error("Failed to delete scene");
    }
  };

  const reorderScenes = async (projectId: string, sceneIds: string[]) => {
    try {
      // Update order_index for each scene
      const updates = sceneIds.map((id, index) => 
        supabase
          .from('project_scenes')
          .update({ order_index: index })
          .eq('id', id)
      );

      await Promise.all(updates);

      // Update local state
      setProjects(prev => prev.map(p => {
        if (p.id === projectId && p.scenes) {
          const sortedScenes = sceneIds
            .map(id => p.scenes?.find(s => s.id === id))
            .filter((s): s is ProjectScene => !!s)
            .map((s, index) => ({ ...s, order_index: index }));
          
          return { ...p, scenes: sortedScenes };
        }
        return p;
      }));
    } catch (err) {
      console.error('Error reordering scenes:', err);
      toast.error("Failed to reorder scenes");
    }
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addScene,
    updateScene,
    deleteScene,
    reorderScenes,
  };
}
