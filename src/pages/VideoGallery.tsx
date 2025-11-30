import { useState, useEffect } from "react";
import { Film, Download, Play, Calendar, Clock, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GeneratedVideo {
  id: string;
  scene_name: string;
  scene_prompt: string;
  video_url: string;
  video_status: string;
  duration_seconds: number;
  created_at: string;
  project_name?: string;
}

export default function VideoGallery() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('project_scenes')
        .select(`
          id,
          scene_name,
          scene_prompt,
          video_url,
          video_status,
          duration_seconds,
          created_at,
          projects(name)
        `)
        .not('video_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedVideos = (data || []).map((item: any) => ({
        ...item,
        project_name: item.projects?.name,
      }));

      setVideos(formattedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('project_scenes')
        .update({ video_url: null, video_status: 'pending' })
        .eq('id', id);

      if (error) throw error;

      setVideos(prev => prev.filter(v => v.id !== id));
      if (selectedVideo?.id === id) setSelectedVideo(null);
      toast.success('Video removed');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-4">
            Please sign in to view your generated videos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth">
              <Button className="w-full sm:w-auto">Sign In</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-500" />
                Video Gallery
              </h1>
              <p className="text-sm text-muted-foreground">
                {videos.length} video{videos.length !== 1 ? 's' : ''} generated
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : videos.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <Film className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Videos Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Generate your first video using the Animate or Video builder. 
              Videos created with Runway ML will appear here.
            </p>
            <Link to="/">
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className={cn(
                  "overflow-hidden cursor-pointer transition-all hover:shadow-lg",
                  selectedVideo?.id === video.id && "ring-2 ring-purple-500"
                )}
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video bg-black">
                  <video
                    src={video.video_url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-black ml-1" />
                    </div>
                  </div>
                  {video.duration_seconds && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration_seconds}s
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground truncate">
                    {video.scene_name || 'Untitled Scene'}
                  </h3>
                  {video.project_name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Project: {video.project_name}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(video.created_at)}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = video.video_url;
                          link.download = `${video.scene_name || 'video'}.mp4`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(video.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Video Preview Modal */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="bg-card rounded-xl max-w-4xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                className="w-full aspect-video"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{selectedVideo.scene_name || 'Untitled Scene'}</h3>
                {selectedVideo.scene_prompt && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {selectedVideo.scene_prompt}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedVideo.video_url;
                      link.download = `${selectedVideo.scene_name || 'video'}.mp4`;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedVideo(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
