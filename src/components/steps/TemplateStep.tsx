import { Copy, Check, CheckCircle, Film, Loader2, Download, Crown, History } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AIToolLinks } from "@/components/AIToolLinks";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useSubscription } from "@/hooks/useSubscription";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateStepProps {
  template: string;
  copied: boolean;
  onCopy: () => void;
  onEdit: () => void;
  onApprove: () => void;
}

export function TemplateStep({ template, copied, onCopy, onEdit, onApprove }: TemplateStepProps) {
  const { tier } = useSubscription();
  const videoGen = useVideoGeneration();
  const isPremium = tier === 'pro' || tier === 'studio';
  const [videoDuration, setVideoDuration] = useState<'5' | '10'>('5');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');

  const handleGenerateVideo = async () => {
    try {
      await videoGen.generateVideo({
        prompt: template,
        duration: parseInt(videoDuration),
        aspectRatio: aspectRatio,
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDownloadVideo = () => {
    if (videoGen.videoUrl) {
      window.open(videoGen.videoUrl, '_blank');
    }
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <span className="text-foreground font-medium">Production Template</span>
          <button
            onClick={onCopy}
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="p-5 max-h-[400px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
          <pre className="text-muted-foreground text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {template}
          </pre>
        </div>
        <div className="p-4 border-t border-border/50 bg-card">
          <AIToolLinks type="video" />
        </div>
      </Card>

      {/* Quick Video Generation for Premium */}
      {isPremium && (
        <Card className="p-4 space-y-4 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-foreground">Quick Video Generation</span>
            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
              Premium
            </span>
          </div>

          {videoGen.status === 'idle' && (
            <>
              <p className="text-sm text-muted-foreground">
                Generate a video directly from this template without adding scenes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Select value={videoDuration} onValueChange={(v) => setVideoDuration(v as '5' | '10')}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 sec</SelectItem>
                    <SelectItem value="10">10 sec</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={aspectRatio} onValueChange={(v) => setAspectRatio(v as '16:9' | '9:16' | '1:1')}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="9:16">9:16</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={handleGenerateVideo}
                  disabled={videoGen.isGenerating}
                >
                  <Film className="w-4 h-4" />
                  Generate Video
                </Button>
              </div>
            </>
          )}

          {/* Video Generation Progress */}
          {(videoGen.isGenerating || videoGen.status === 'running' || videoGen.status === 'pending') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-sm text-foreground">
                  {videoGen.status === 'pending' ? 'Starting generation...' : 'Generating video...'}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {videoGen.progress}%
                </span>
              </div>
              <Progress value={videoGen.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                This may take 30-60 seconds. Don't close this page.
              </p>
            </div>
          )}

          {/* Video Result */}
          {videoGen.status === 'succeeded' && videoGen.videoUrl && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  src={videoGen.videoUrl}
                  controls
                  className="w-full max-h-[300px]"
                  autoPlay
                  loop
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleDownloadVideo}>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={videoGen.reset}>
                  Generate Another
                </Button>
              </div>
            </div>
          )}

          {/* Error State */}
          {videoGen.status === 'failed' && (
            <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive">{videoGen.error}</p>
              <Button variant="ghost" size="sm" onClick={videoGen.reset} className="mt-2">
                Try Again
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Premium hint for non-premium users */}
      {!isPremium && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
          <Crown className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <span className="font-medium">Pro/Studio:</span> Generate videos directly from your template with Runway ML
          </p>
        </div>
      )}

      {/* Video Gallery Link */}
      <Link 
        to="/videos" 
        className="flex items-center justify-center gap-2 p-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border/50 hover:border-border hover:bg-muted/50"
      >
        <History className="w-4 h-4" />
        View your video history
      </Link>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onEdit}>
          Edit Setup
        </Button>
        <Button variant="hero" className="flex-1" onClick={onApprove}>
          <CheckCircle className="w-5 h-5" />
          Approve & Add Scenes
        </Button>
      </div>
    </div>
  );
}
