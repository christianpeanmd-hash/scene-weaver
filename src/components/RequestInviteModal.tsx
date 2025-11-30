import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, User, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const requestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  message: z.string().max(1000).optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface RequestInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "invite" | "contact" | "enterprise";
}

export function RequestInviteModal({ open, onOpenChange, type }: RequestInviteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const titles = {
    invite: "Join the waitlist",
    contact: "Contact us",
    enterprise: "Enterprise inquiry",
  };

  const descriptions = {
    invite: "We'll notify you when your spot is ready.",
    contact: "Have questions? We'd love to hear from you.",
    enterprise: "Tell us about your team's needs.",
  };

  const handleSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase.from("invite_requests").insert({
        name: data.name,
        email: data.email,
        message: data.message || null,
        request_type: type,
      });

      if (dbError) throw dbError;

      // Send email notification via edge function
      const { error: fnError } = await supabase.functions.invoke("send-invite-request", {
        body: {
          name: data.name,
          email: data.email,
          message: data.message,
          type,
        },
      });

      if (fnError) {
        console.error("Email notification failed:", fnError);
        // Don't throw - the request was saved
      }

      toast.success("Request submitted! We'll be in touch soon.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titles[type]}</DialogTitle>
          <DialogDescription>{descriptions[type]}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Your name"
                className="pl-10"
                {...form.register("name")}
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Message <span className="text-muted-foreground">(optional)</span>
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="message"
                placeholder={
                  type === "enterprise"
                    ? "Tell us about your team size and use case..."
                    : "Anything you'd like us to know?"
                }
                className="pl-10 min-h-[100px]"
                {...form.register("message")}
              />
            </div>
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
