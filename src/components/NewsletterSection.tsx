import { Mail, ArrowRight } from "lucide-react";
import techySurgeonLogo from "@/assets/techy-surgeon-logo.png";

export function NewsletterSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center shadow-sm">
          {/* Techy Surgeon Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={techySurgeonLogo} 
              alt="Techy Surgeon - Decoding the Future of Medicine" 
              className="h-24 md:h-32 w-auto"
            />
          </div>

          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            From the makers of TechyMemo
          </h2>
          
          {/* Subheadline */}
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Love this tool? <span className="font-semibold text-foreground">Techy Surgeon</span> is the newsletter where I break down how to build AI-powered tools like this, the latest trends in AI for healthcare and beyond, and tutorials you can actually use.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>AI tool tutorials</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>Build your own apps</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>AI trends & insights</span>
            </div>
          </div>

          {/* Substack Embed */}
          <div className="flex justify-center">
            <iframe 
              src="https://techysurgeon.substack.com/embed" 
              width="100%" 
              height="150" 
              style={{ 
                maxWidth: '480px',
                border: 'none',
                borderRadius: '12px',
                background: 'transparent'
              }}
              frameBorder="0" 
              scrolling="no"
              title="Subscribe to Techy Surgeon Newsletter"
            />
          </div>

          {/* Trust indicator */}
          <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />
            Free newsletter from Techy Surgeon. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
