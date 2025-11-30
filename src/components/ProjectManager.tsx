import { useState } from "react";
import { 
  FolderPlus, 
  Film, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  ChevronDown,
  Download,
  Play,
  Clock,
  Sparkles,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProjects, Project, ProjectScene } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProjectManagerProps {
  onAddSceneFromBuilder?: (projectId: string, sceneName: string) => void;
  currentPrompt?: string;
}

export function ProjectManager({ onAddSceneFromBuilder, currentPrompt }: ProjectManagerProps) {
  const { user } = useAuth();
  const { projects, isLoading, createProject, updateProject, deleteProject, addScene, deleteScene } = useProjects();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [addingSceneTo, setAddingSceneTo] = useState<string | null>(null);
  const [newSceneName, setNewSceneName] = useState("");

  const toggleExpand = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    const project = await createProject(newProjectName.trim());
    if (project) {
      setNewProjectName("");
      setIsCreating(false);
      setExpandedProjects(prev => new Set(prev).add(project.id));
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditName(project.name);
  };

  const handleSaveEdit = async (projectId: string) => {
    if (!editName.trim()) return;
    await updateProject(projectId, { name: editName.trim() });
    setEditingProject(null);
  };

  const handleAddScene = async (projectId: string) => {
    if (!newSceneName.trim()) {
      toast.error("Please enter a scene name");
      return;
    }

    await addScene(projectId, newSceneName.trim(), {
      prompt: currentPrompt || undefined,
    });
    setNewSceneName("");
    setAddingSceneTo(null);
  };

  const handleAddCurrentPromptToProject = async (projectId: string) => {
    if (!currentPrompt) {
      toast.error("Generate a prompt first");
      return;
    }

    const sceneName = `Scene ${(projects.find(p => p.id === projectId)?.scenes?.length || 0) + 1}`;
    await addScene(projectId, sceneName, { prompt: currentPrompt });
    
    // Expand the project to show the new scene
    setExpandedProjects(prev => new Set(prev).add(projectId));
  };

  const getVideoStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-emerald-500">Ready</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="animate-pulse">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <FolderPlus className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-3">
          Sign in to create projects and organize your scenes
        </p>
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
          Sign In
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-teal-500" />
          <span className="text-sm font-medium">Projects</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="h-8"
        >
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        {/* Create New Project */}
        {isCreating && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg animate-fade-in">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="flex-1 h-8"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateProject();
                if (e.key === 'Escape') setIsCreating(false);
              }}
            />
            <Button size="sm" className="h-8" onClick={handleCreateProject}>
              Create
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-6">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-6">
            <FolderPlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No projects yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Create a project to organize multiple scenes
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border border-border/50 rounded-lg overflow-hidden">
              {/* Project Header */}
              <div 
                className="flex items-center gap-2 p-3 bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => toggleExpand(project.id)}
              >
                {expandedProjects.has(project.id) ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                
                {editingProject === project.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 h-7"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(project.id);
                      if (e.key === 'Escape') setEditingProject(null);
                    }}
                    onBlur={() => handleSaveEdit(project.id)}
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 font-medium text-sm">{project.name}</span>
                )}

                <span className="text-xs text-muted-foreground">
                  {project.scenes?.length || 0} scenes
                </span>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {currentPrompt && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleAddCurrentPromptToProject(project.id)}
                      title="Add current prompt as scene"
                    >
                      <Plus className="w-3.5 h-3.5 text-teal-500" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleStartEdit(project)}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>

              {/* Expanded Scenes */}
              {expandedProjects.has(project.id) && (
                <div className="border-t border-border/30 bg-muted/20">
                  {project.scenes && project.scenes.length > 0 ? (
                    <div className="divide-y divide-border/30">
                      {project.scenes
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((scene) => (
                          <div 
                            key={scene.id} 
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors"
                          >
                            <Film className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{scene.scene_name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {scene.duration_seconds}s
                                </span>
                                {getVideoStatusBadge(scene.video_status)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {scene.video_url ? (
                                <>
                                  <Button variant="ghost" size="icon-sm" title="Play">
                                    <Play className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon-sm" title="Download">
                                    <Download className="w-3.5 h-3.5" />
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 text-xs gap-1"
                                  title="Generate video (Premium)"
                                >
                                  <Crown className="w-3 h-3 text-amber-500" />
                                  Generate
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => deleteScene(scene.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-2">No scenes yet</p>
                    </div>
                  )}

                  {/* Add Scene */}
                  {addingSceneTo === project.id ? (
                    <div className="p-3 border-t border-border/30 flex items-center gap-2">
                      <Input
                        value={newSceneName}
                        onChange={(e) => setNewSceneName(e.target.value)}
                        placeholder="Scene name..."
                        className="flex-1 h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddScene(project.id);
                          if (e.key === 'Escape') setAddingSceneTo(null);
                        }}
                      />
                      <Button size="sm" className="h-8" onClick={() => handleAddScene(project.id)}>
                        Add
                      </Button>
                    </div>
                  ) : (
                    <button
                      className="w-full p-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center justify-center gap-1 border-t border-border/30"
                      onClick={() => setAddingSceneTo(project.id)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Scene
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Premium Video Generation Info */}
      <div className="p-3 border-t border-border/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="flex items-center gap-2 text-xs">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-muted-foreground">
            <strong className="text-foreground">Pro/Studio:</strong> Generate videos directly & download for CapCut
          </span>
        </div>
      </div>
    </Card>
  );
}
