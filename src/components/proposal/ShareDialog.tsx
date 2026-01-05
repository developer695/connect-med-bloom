import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Download, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const ShareDialog = () => {
  const { currentProposalUuid } = useProposalContent();
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [allowDownload, setAllowDownload] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareLink = async () => {
    setIsGenerating(true);

    try {
      if (!currentProposalUuid) {
        alert("Please save the proposal first before sharing");
        setIsGenerating(false);
        return;
      }

     
      const { data: existingProposal, error: fetchError } = await supabase
        .from("site_content")
        .select("view_token, id")
        .eq("id", currentProposalUuid)
        .single();

      if (fetchError) {
        console.error("❌ Fetch error:", fetchError);
        throw fetchError;
      }



      let viewToken = existingProposal?.view_token;

      if (!viewToken) {
    
        viewToken = crypto.randomUUID();

        const { error: updateError } = await supabase
          .from("site_content")
          .update({
            view_token: viewToken,
            expires_at: expiresAt || null,
            allow_download: allowDownload,
          })
          .eq("id", currentProposalUuid);

        if (updateError) {
          console.error("❌ Update error:", updateError);
          throw updateError;
        }

    
      } else {
    
      }

      const url = `${window.location.origin}/proposal/${viewToken}`;
      setShareUrl(url);

      console.log("🎉 Public share link generated:", url);
    } catch (error: any) {
      console.error("❌ Error generating share link:", error);
      alert(`Error: ${error.message || 'Failed to generate share link'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          <span className="hidden md:inline">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Proposal</DialogTitle>
        </DialogHeader>

        {!shareUrl ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {currentProposalUuid
                ? 'Generate a shareable link for this proposal'
                : '⚠️ Please save the proposal first before sharing'}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="download" className="text-sm font-medium">
                  Allow PDF Download
                </Label>
                <Switch
                  id="download"
                  checked={allowDownload}
                  onCheckedChange={setAllowDownload}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires" className="text-sm font-medium">
                  Link Expiration (Optional)
                </Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={generateShareLink}
              disabled={!currentProposalUuid || isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Share Link'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Download className="w-4 h-4" />
                <span>PDF Download: {allowDownload ? 'Enabled' : 'Disabled'}</span>
              </div>
              {expiresAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Expires: {new Date(expiresAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setShareUrl("")}
              className="w-full"
            >
              Generate New Link
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;