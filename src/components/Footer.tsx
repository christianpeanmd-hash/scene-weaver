import { Link } from "react-router-dom";
import { useState } from "react";
import { RequestInviteModal } from "./RequestInviteModal";

export function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-foreground">Techy Memo</span>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/library" className="hover:text-foreground transition-colors">
              Library
            </Link>
            <Link to="/videos" className="hover:text-foreground transition-colors">
              Videos
            </Link>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <button
              onClick={() => setIsContactOpen(true)}
              className="hover:text-foreground transition-colors"
            >
              Contact
            </button>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </nav>
        </div>

        {/* Contact email */}
        <div className="text-center mt-6 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Questions? Email us at{" "}
            <a 
              href="mailto:hello@techysurgeon.com" 
              className="text-primary hover:underline"
            >
              hello@techysurgeon.com
            </a>
          </p>
        </div>
      </div>

      <RequestInviteModal
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        type="contact"
      />
    </footer>
  );
}
