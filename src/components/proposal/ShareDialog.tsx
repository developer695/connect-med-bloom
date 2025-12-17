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
import type { Json } from "@/integrations/supabase/types";

const ShareDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { proposalId, content } = useProposalContent();

  const generateShareLink = async () => {
    setIsLoading(true);
    try {
      let viewToken: string | null = null;

      if (proposalId) {
        // Existing proposal - fetch view_token
        const { data, error } = await supabase
          .from("proposals")
          .select("view_token")
          .eq("id", proposalId)
          .maybeSingle();

        if (error) throw error;
        viewToken = data?.view_token || null;
      } else {
        // No existing proposal - create new one with current content
        const { data, error } = await supabase
          .from("proposals")
          .insert({
            title: content.cover.title || "Untitled Proposal",
            content: JSON.parse(JSON.stringify(content)) as Json,
            author: content.letter.signature || null,
          })
          .select("view_token")
          .single();

        if (error) throw error;
        viewToken = data?.view_token || null;
      }

      if (viewToken) {
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/proposal/${viewToken}`;
        setShareUrl(url);
        toast({
          title: "Link generated!",
          description: "Your shareable link is ready.",
        });
      } else {
        throw new Error("Could not generate view token");
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Error",
        description: "Failed to generate shareable link. Please try again.",
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
            Generate a shareable link. Clients will see the latest version in view-only mode.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {!shareUrl ? (
            <Button onClick={generateShareLink} disabled={isLoading} className="w-full">
              {isLoading ? (
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
              This link always shows the most recent version of the proposal.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
