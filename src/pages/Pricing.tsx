import { Link } from "react-router-dom";
import { TechyMemoLogo } from "@/components/MemoableLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ArrowLeft, Library, Film } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Pricing"
        description="Simple, transparent pricing for TechyMemo. Start free and upgrade when you need more AI generations, team features, and advanced templates."
      />

      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <TechyMemoLogo size="sm" />
          </Link>
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
          </div>
        </div>
      </nav>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Pricing Section */}
      <div className="flex-grow">
        <PricingSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
