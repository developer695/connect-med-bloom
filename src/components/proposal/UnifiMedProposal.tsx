import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExportDialog from "./ExportDialog";
import EditModeToggle from "./EditModeToggle";
import EditSidebar from "./EditSidebar";
import { useProposalContent } from "@/contexts/ProposalContentContext";

import CoverPage from "./pages/CoverPage";
import LetterPage from "./pages/LetterPage";
import AboutPage from "./pages/AboutPage";
import HowWeWorkPage from "./pages/HowWeWorkPage";
import SolutionsPage from "./pages/SolutionsPage";
import MarketsPage from "./pages/MarketsPage";
import ClientsPage from "./pages/ClientsPage";
import TeamPage from "./pages/TeamPage";
import ProposalPage from "./pages/ProposalPage";
import ValuePage from "./pages/ValuePage";
import ContactPage from "./pages/ContactPage";

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

const UnifiMedProposal = () => {
  const { isEditMode } = useProposalContent();
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
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Main content area with optional sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document area */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-2 md:p-4">
            <div id="proposal-content" className="w-full h-full max-w-7xl mx-auto bg-card rounded-lg shadow-elevated overflow-hidden">
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
        
        {/* Edit sidebar - outside the document */}
        {isEditMode && <EditSidebar />}
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
            <ExportDialog />
            <EditModeToggle />
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
  );
};

export default UnifiMedProposal;
