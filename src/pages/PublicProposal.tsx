import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProposalContentProvider } from "@/contexts/ProposalContentContext";
import UnifiMedProposal from "@/components/proposal/UnifiMedProposal";
import { Loader2 } from "lucide-react";

const PublicProposal = () => {
  const { viewToken } = useParams<{ viewToken: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalContent, setProposalContent] = useState<any>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!viewToken) {
        setError("Invalid link");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("proposals")
        .select("content, title")
        .eq("view_token", viewToken)
        .maybeSingle();

      if (error) {
        setError("Failed to load proposal");
      } else if (!data) {
        setError("Proposal not found");
      } else {
        setProposalContent(data.content);
      }
      setLoading(false);
    };

    fetchProposal();
  }, [viewToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {error}
          </h1>
          <p className="text-muted-foreground">
            The proposal you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProposalContentProvider initialContent={proposalContent} readOnly>
      <UnifiMedProposal />
    </ProposalContentProvider>
  );
};

export default PublicProposal;
