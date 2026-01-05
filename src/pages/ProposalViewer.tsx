import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ProposalContent, ProposalContentProvider } from "@/contexts/ProposalContentContext";

import CoverPage from "@/components/proposal/pages/CoverPage";
import LetterPage from "@/components/proposal/pages/LetterPage";
import AboutPage from "@/components/proposal/pages/AboutPage";
import HowWeWorkPage from "@/components/proposal/pages/HowWeWorkPage";
import SolutionsPage from "@/components/proposal/pages/SolutionsPage";
import MarketsPage from "@/components/proposal/pages/MarketsPage";
import ClientsPage from "@/components/proposal/pages/ClientsPage";
import TeamPage from "@/components/proposal/pages/TeamPage";
import ProposalPage from "@/components/proposal/pages/ProposalPage";
import ValuePage from "@/components/proposal/pages/ValuePage";
import ContactPage from "@/components/proposal/pages/ContactPage";

const pages = [
  { id: "cover", label: "Cover", component: CoverPage },
  { id: "letter", label: "Letter", component: LetterPage },
  { id: "about", label: "About", component: AboutPage },
  { id: "methodology", label: "Methodology", component: HowWeWorkPage },
  { id: "solutions", label: "Solutions", component: SolutionsPage },
  { id: "markets", label: "Markets", component: MarketsPage },
  { id: "clients", label: "Clients", component: ClientsPage },
  { id: "value", label: "Why UnifiMed", component: ValuePage },
  { id: "team", label: "Team", component: TeamPage },
  { id: "proposal", label: "Proposal", component: ProposalPage },
  { id: "contact", label: "Close", component: ContactPage },
];

const ProposalViewerContent = ({ content }: { content: ProposalContent }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToPage = useCallback((index: number) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
  }, [currentPage]);

  const goNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const CurrentPageComponent = pages[currentPage].component;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <ProposalContentProvider initialContent={content} readOnly>
      <div className="w-full min-h-screen bg-background flex flex-col">
        {/* View-only banner */}
        <div className="bg-muted border-b border-border px-4 py-2 text-center">
          <span className="text-sm text-muted-foreground">
            👁️ View-only mode — This is a shared proposal
          </span>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-2 md:p-4">
              <div className="w-full h-full max-w-7xl mx-auto bg-card rounded-lg shadow-elevated overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="w-full h-full"
                  >
                    <CurrentPageComponent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="bg-card border-t border-border px-4 md:px-8 py-3 md:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Previous/Next buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={currentPage === 0}
                className="gap-1 md:gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Previous</span>
              </Button>
              <Button
                size="sm"
                onClick={goNext}
                disabled={currentPage === pages.length - 1}
                className="gap-1 md:gap-2"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Page indicators */}
            <div className="flex items-center gap-1 md:gap-2">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => goToPage(index)}
                  className="relative group"
                  aria-label={`Go to ${page.label}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentPage === index
                        ? "w-6 bg-primary"
                        : "w-2 bg-border hover:bg-muted-foreground/50"
                    }`}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                    {page.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Page counter */}
            <div className="text-xs md:text-sm text-muted-foreground min-w-[80px] text-right">
              <span className="font-semibold text-foreground">{currentPage + 1}</span>
              <span> / {pages.length}</span>
            </div>
          </div>
        </div>
      </div>
    </ProposalContentProvider>
  );
};

const ProposalViewer = () => {
  const { shareId } = useParams<{ shareId: string }>();

  
  const navigate = useNavigate();
  const [content, setContent] = useState<ProposalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!shareId) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("site_content")
          .select("content, expires_at")
          .eq("view_token", shareId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError("Proposal not found or link has expired");
          setLoading(false);
          return;
        }

        // Check if expired
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setError("This shared link has expired");
          setLoading(false);
          return;
        }

        setContent(data.content as unknown as ProposalContent);
      } catch (err) {
        console.error("Error fetching shared proposal:", err);
        setError("Failed to load proposal. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h1 className="text-xl font-semibold mb-2">Unable to Load Proposal</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return <ProposalViewerContent content={content} />;
};

export default ProposalViewer;
