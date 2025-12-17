import { useState } from "react";
import { Share2, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const ShareDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { proposalId } = useProposalContent();

  // Fetch the view_token when dialog opens
  const fetchShareLink = async () => {
    if (!proposalId) {
      toast({
        title: "Error",
        description: "No proposal selected to share.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("view_token")
        .eq("id", proposalId)
        .maybeSingle();

      if (error) throw error;

      if (data?.view_token) {
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/proposal/${data.view_token}`;
        setShareUrl(url);
      } else {
        toast({
          title: "Error",
          description: "Could not find shareable link for this proposal.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching share link:", error);
      toast({
        title: "Error",
        description: "Failed to get shareable link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && proposalId) {
      fetchShareLink();
    }
    if (!open) {
      setShareUrl("");
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          <span className="hidden md:inline">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Proposal</DialogTitle>
          <DialogDescription>
            Share this link with clients. They will see the latest version of the proposal in view-only mode.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : shareUrl ? (
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Unable to load share link.
            </p>
          )}
          {shareUrl && (
            <p className="text-sm text-muted-foreground">
              This link always shows the most recent version of the proposal. Any updates you make will be reflected automatically.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
