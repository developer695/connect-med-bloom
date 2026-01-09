import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UnifiMedProposal from "@/components/proposal/UnifiMedProposal";
import { ProposalContentProvider } from "@/contexts/ProposalContentContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AcceptInvitation from "@/components/proposal/pages/AcceptInvitation";

const Index = () => {
  const { proposalId } = useParams<{ proposalId?: string }>();
  const { user, isAdmin, canEdit, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!proposalId);
  const [proposalContent, setProposalContent] = useState<any>(null);

  useEffect(() => {
    // If editing a proposal, check auth and load content
    if (proposalId) {
      if (!authLoading && !user) {
        navigate("/auth");
        return;
      }
      if (!authLoading && user && !isAdmin) {
        // toast({
        //   title: "Access Denied",
        //   description: "Only administrators can edit proposals.",
        //   variant: "destructive",
        // });
        navigate("/auth");
        return;
      }
      if (!authLoading && isAdmin) {
        loadProposal();
      }
    }
  }, [proposalId, user, isAdmin, authLoading, navigate, toast]);

  const loadProposal = async () => {
    if (!proposalId) return;

    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", proposalId)
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Failed to load proposal",
        variant: "destructive",
      });
      navigate("/d");
    } else {
      setProposalContent(data.content);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProposalContentProvider
      initialContent={proposalContent || undefined}
      proposalId={proposalId}
      readOnly={!canEdit}
    >
      <UnifiMedProposal />
      {/* <AcceptInvitation /> */}
    </ProposalContentProvider>
  );
};

export default Index;
