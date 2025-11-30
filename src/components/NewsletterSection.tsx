import { Mail, Sparkles, ArrowRight } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center shadow-sm">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Want to build your own AI tools?
          </h2>
          
          {/* Subheadline */}
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Like TechyMemo? Learn how to create AI-powered apps like this one, 
            stay ahead of the latest trends, and get exclusive tutorials delivered 
            to your inbox.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>AI development tutorials</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>Latest AI tool reviews</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>No-code/low-code tips</span>
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
            Join the Techy Surgeon community. Free newsletter, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
