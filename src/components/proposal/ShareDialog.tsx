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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProposalContent } from "@/contexts/ProposalContentContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

const ShareDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [proposalTitle, setProposalTitle] = useState("");
  const { toast } = useToast();
  const { content } = useProposalContent();
  const { user, isAdmin } = useAuth();

  const generateShareLink = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can create shareable proposals.",
        variant: "destructive",
      });
      return;
    }

    if (!proposalTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for this proposal.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase
        .from("shared_proposals")
        .insert([{ 
          content: JSON.parse(JSON.stringify(content)) as Json,
          title: proposalTitle.trim(),
          creator_id: user?.id
        }])
        .select("share_id")
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const url = `${baseUrl}/view/${data.share_id}`;
      setShareUrl(url);

      toast({
        title: "Link generated!",
        description: "Your shareable link is ready. Anyone with the link can view this proposal.",
      });
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Error",
        description: "Failed to generate shareable link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
    if (!open) {
      setShareUrl("");
      setCopied(false);
      setProposalTitle("");
    }
  };

  // Don't show share button for non-admins
  if (!isAdmin) {
    return null;
  }

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
            Generate a shareable link to let others view this proposal. They will be able to navigate through all pages but won't be able to edit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {!shareUrl ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="proposal-title">Proposal Title</Label>
                <Input
                  id="proposal-title"
                  placeholder="e.g., Q1 Healthcare Proposal"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                />
              </div>
              <Button onClick={generateShareLink} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Generate Shareable Link
                  </>
                )}
              </Button>
            </>
          ) : (
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
          )}
          {shareUrl && (
            <p className="text-sm text-muted-foreground">
              This link will expire in 30 days. Anyone with this link can view the proposal.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
