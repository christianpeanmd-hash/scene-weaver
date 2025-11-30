import { Sparkles, Video, Image, Wand2, ArrowRight, FileText, Library, LogIn, User, Crown, Zap, Settings, Receipt, BarChart3, Play, Film } from "lucide-react";
import { Link } from "react-router-dom";
import { TechyMemoLogo } from "./MemoableLogo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BillingHistoryDialog } from "./BillingHistoryDialog";
import { UsageAnalyticsDialog } from "./UsageAnalyticsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BuilderType = "video" | "image" | "animate" | "infographic";

interface HeroSectionProps {
  activeBuilder: BuilderType;
  onSelectBuilder: (builder: BuilderType) => void;
}

const tierColors: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  creator: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  pro: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  studio: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function HeroSection({ activeBuilder, onSelectBuilder }: HeroSectionProps) {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { tier, generationsRemaining, generationLimit, openCustomerPortal } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error("Failed to open subscription portal");
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-4 pb-8 md:pt-6 md:pb-10">
        {/* Sticky Navigation */}
        <nav className="flex items-center justify-between mb-8 animate-fade-in">
          <TechyMemoLogo size="md" />
          
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/videos"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Videos</span>
            </Link>
            <Link
              to="/library"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {tier !== "free" ? (
                      <Crown className="w-4 h-4 text-amber-500" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{profile?.full_name || user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-popover">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{profile?.full_name || "Account"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Subscription Status */}
                  <div className="px-2 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Plan</span>
                      <Badge variant="secondary" className={cn("text-xs capitalize", tierColors[tier])}>
                        {tier}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Generations</span>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium">
                          {tier === "studio" ? "Unlimited" : `${generationsRemaining} / ${generationLimit}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {tier === "free" ? (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <a href="#pricing" className="flex items-center gap-2 text-primary">
                          <Crown className="w-4 h-4" />
                          Upgrade Plan
                        </a>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={handleManageSubscription} className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Subscription
                      </DropdownMenuItem>
                      <BillingHistoryDialog>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Receipt className="w-4 h-4 mr-2" />
                          Billing History
                        </DropdownMenuItem>
                      </BillingHistoryDialog>
                    </>
                  )}
                  
                  <UsageAnalyticsDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Usage Analytics
                    </DropdownMenuItem>
                  </UsageAnalyticsDialog>
                  
                  <DropdownMenuSeparator />
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
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
        </nav>

        {/* Tagline */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight animate-slide-up">
            Production-ready prompts for{" "}
            <span className="gradient-text">AI media and infographics</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mt-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Build consistent characters, environments, and scenes for Veo, Sora, Midjourney, and more.
          </p>
        </div>

        {/* Builder Toggle */}
        <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex p-1 bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-lg">
            <button
              onClick={() => onSelectBuilder("video")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300",
                activeBuilder === "video"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Video className="w-4 h-4" />
              <span>Video</span>
            </button>
            <button
              onClick={() => onSelectBuilder("animate")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300",
                activeBuilder === "animate"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Play className="w-4 h-4" />
              <span>Animate</span>
            </button>
            <button
              onClick={() => onSelectBuilder("image")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300",
                activeBuilder === "image"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Image className="w-4 h-4" />
              <span>Image</span>
            </button>
            <button
              onClick={() => onSelectBuilder("infographic")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300",
                activeBuilder === "infographic"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>Infographic</span>
            </button>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <FeatureBadge icon={Sparkles} label="AI-Powered" />
          <FeatureBadge icon={Wand2} label="Production-Ready" />
          <FeatureBadge icon={ArrowRight} label="Copy & Go" />
        </div>
      </div>
    </div>
  );
}

function FeatureBadge({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-card/60 backdrop-blur-sm border border-border/50 rounded-full text-xs text-muted-foreground">
      <Icon className="w-3 h-3 text-primary" />
      <span>{label}</span>
    </div>
  );
}
