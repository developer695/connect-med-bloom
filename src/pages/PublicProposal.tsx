import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProposalContentProvider, ProposalContent } from "@/contexts/ProposalContentContext";
import UnifiMedProposal from "@/components/proposal/UnifiMedProposal";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const getCurrentDateFormatted = () => format(new Date(), "MMMM yyyy");
const getCurrentDateFullFormatted = () => format(new Date(), "MMMM d, yyyy");

const PublicProposal = () => {
  const { viewToken } = useParams<{ viewToken: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalContent, setProposalContent] = useState<ProposalContent | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!viewToken) {
        setError("Invalid link");
        setLoading(false);
        return;
      }

    
      try {
        // ✅ Select ALL columns from the new schema
        const { data, error: fetchError } = await supabase
          .from("site_content")
          .select("*") // Get all columns
          .eq("view_token", viewToken)
          .eq("content_type", "proposal")
          .eq("is_active", true)
          .maybeSingle();

       

        if (fetchError) {
          console.error("❌ Supabase error:", fetchError);
          setError(`Failed to load proposal: ${fetchError.message}`);
        } else if (!data) {
          console.warn("⚠️ No proposal found with this view_token");
          setError("Proposal not found");
        } else {
       

          // ✅ Reconstruct ProposalContent from individual columns
          const reconstructedContent: ProposalContent = {
            cover: data.cover ? {
              ...data.cover,
              date: getCurrentDateFormatted(), // Add current date
            } : {
              tagline: "",
              title: "",
              subtitle: "",
              date: getCurrentDateFormatted(),
              company: "",
              email: "",
            },
            letter: data.letter ? {
              ...data.letter,
              date: getCurrentDateFullFormatted(), // Add current date
            } : {
              date: getCurrentDateFullFormatted(),
              salutation: "",
              paragraphs: [],
              closing: "",
              signature: "",
              footer: "",
            },
            about: data.about || {
              sectionLabel: "",
              title: "",
              intro: "",
              stats: [],
              expertiseTitle: "",
              expertiseText: "",
              missionTitle: "",
              missionText: "",
              quote: "",
            },
            howWeWork: data.how_we_work || {
              sectionLabel: "",
              title: "",
              steps: [],
              collaborativeTitle: "",
              collaborativeText: "",
            },
            solutions: data.solutions || {
              sectionLabel: "",
              title: "",
              services: [],
              integratedTitle: "",
              integratedText: "",
            },
            markets: data.markets || {
              sectionLabel: "",
              title: "",
              segments: [],
              crossFunctionalTitle: "",
              crossFunctionalText: "",
            },
            clients: data.clients || {
              sectionLabel: "",
              title: "",
              intro: "",
              clientTypes: [],
              tailoredTitle: "",
              tailoredText: "",
            },
            team: data.team || {
              sectionLabel: "",
              title: "",
              intro: "",
              members: [],
              collectiveTitle: "",
              collectiveText: "",
            },
            proposal: data.proposal || {
              sectionLabel: "",
              title: "",
              projectTeamTitle: "",
              projectTeam: [],
              scopeTitle: "",
              scopeText: "",
              deliverablesTitle: "",
              deliverables: [],
              hiddenDeliverables: [],
              packagesTitle: "",
              packages: [],
              hiddenPackages: [],
              termsTitle: "",
              termsText: "",
            },
            value: data.value || {
              sectionLabel: "",
              title: "",
              pillars: [],
              hiddenPillars: [],
              differentiatorsTitle: "",
              differentiators: [],
              hiddenDifferentiators: [],
            },
            contact: data.contact || {
              sectionLabel: "",
              title: "",
              conversationTitle: "",
              intro: "",
              email: "",
              location: "",
              website: "",
              nextStepsTitle: "",
              nextSteps: [],
              ctaButton: "",
              academyTitle: "",
              academyText: "",
            },
            shapes: data.shapes || {},
          };

          setProposalContent(reconstructedContent);
        }
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
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

  if (!proposalContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            No Content Available
          </h1>
          <p className="text-muted-foreground">
            The proposal content could not be loaded.
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