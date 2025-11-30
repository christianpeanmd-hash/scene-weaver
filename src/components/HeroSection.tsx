import { LogIn, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BuilderType = "video" | "image" | "infographic";

interface HeroSectionProps {
  onStartScene: () => void;
}

export function HeroSection({ onStartScene }: HeroSectionProps) {
  const { user, profile, signOut, isAdmin } = useAuth();

  return (
    <div className="relative">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-foreground">
            Techy Memo Scenes
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#tutorials" className="text-muted-foreground hover:text-foreground transition-colors">
              Tutorials
            </a>
          </div>

          <div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {profile?.full_name || user.email?.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/library">My Library</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Copy */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              AI video storyboard templates for short clips
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Describe your idea once. Techy Memo turns it into a 3–10 second, scene-by-scene video prompt you can film—or paste into Sora, Veo, or Runway—and also generates matching infographics and images right in the app for family portraits, marketing campaigns, and research figures.
            </p>
            
            <p className="text-sm text-muted-foreground">
              Stop rewriting prompts from scratch. Build reusable scene and style templates you can use again and again.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
              <Button 
                size="lg" 
                onClick={onStartScene}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Start a new scene
              </Button>
              
              <button 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-4 h-4" />
                View an example
              </button>
            </div>
          </div>

          {/* Right side - Mockup */}
          <div className="relative hidden lg:block">
            {/* Main mockup card */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 space-y-4 ml-8">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Concept</label>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-foreground">
                  Bigfoot energy drink ad, bold and playful
                </div>
              </div>
              
              <div className="flex gap-2">
                {['7s', '10s'].map((duration, i) => (
                  <div
                    key={duration}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      i === 0 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {duration}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground">🎬 Mockumentary</span>
                <span className="px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground">🦶 Bigfoot</span>
                <span className="px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground">🌲 Forest</span>
              </div>
            </div>

            {/* SceneBlock overlay card */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 bg-card border border-border rounded-xl shadow-xl p-4 w-64">
              <div className="text-xs font-semibold text-primary mb-2">SceneBlock</div>
              <div className="space-y-1.5 text-xs text-muted-foreground font-mono leading-relaxed">
                <p>0–2s: Bigfoot cracks open neon-green drink.</p>
                <p>2–4s: Close-up fizz, can and logo.</p>
                <p>4–6s: Bigfoot charges through forest, tagline.</p>
              </div>
            </div>

            {/* Visual style overlay card */}
            <div className="absolute -top-6 right-0 bg-card border border-border rounded-xl shadow-xl p-4 w-52">
              <div className="text-xs font-semibold text-foreground mb-1">Visual Style: Bold Retro Ad</div>
              <p className="text-xs text-muted-foreground leading-relaxed">High-contrast Bigfoot can art, poster-ready.</p>
              <div className="mt-2 text-[10px] text-primary">Includes infographic & image prompts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
