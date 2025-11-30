import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface FreeLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FreeLimitModal({ open, onOpenChange }: FreeLimitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            You've reached the free preview limit
          </DialogTitle>
          <DialogDescription className="text-center">
            You've used your 3 free scene generations on this device. Start a 7-day
            free trial to keep generating AI video storyboards, save your scenes,
            and unlock the full visual prompt pack.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
            <Link to="/auth">Start 7-day free trial</Link>
          </Button>

          <Button variant="ghost" asChild className="w-full">
            <Link to="/auth">Log in to existing account</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          We cap anonymous prompts to protect the service. Creating an account
          removes this limit.
        </p>
      </DialogContent>
    </Dialog>
  );
}
