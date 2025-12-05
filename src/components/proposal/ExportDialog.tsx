import { useState } from "react";
import { FileText, FileDown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { exportToWord, exportToPDF } from "@/utils/exportProposal";
import { useToast } from "@/hooks/use-toast";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const ExportDialog = () => {
  const [isExporting, setIsExporting] = useState<"pdf" | "word" | null>(null);
  const { toast } = useToast();
  const { content } = useProposalContent();

  const handleExportPDF = async () => {
    setIsExporting("pdf");
    try {
      await exportToPDF(content);
      toast({
        title: "PDF Exported",
        description: "Your complete proposal has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportWord = async () => {
    setIsExporting("word");
    try {
      await exportToWord(content);
      toast({
        title: "Word Document Exported",
        description: "Your proposal has been downloaded as a Word document.",
      });
    } catch (error) {
      console.error("Word export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileDown className="w-4 h-4" />
          <span className="hidden md:inline">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Export Proposal</DialogTitle>
          <DialogDescription>
            Download the proposal in your preferred format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="justify-start gap-3 h-auto py-4"
            onClick={handleExportWord}
            disabled={isExporting !== null}
          >
            {isExporting === "word" ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div className="text-left">
              <div className="font-semibold">Word Document</div>
              <div className="text-xs text-muted-foreground">
                Download as .docx for editing
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-3 h-auto py-4"
            onClick={handleExportPDF}
            disabled={isExporting !== null}
          >
            {isExporting === "pdf" ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <FileDown className="w-5 h-5 text-red-600" />
              </div>
            )}
            <div className="text-left">
              <div className="font-semibold">PDF Document</div>
              <div className="text-xs text-muted-foreground">
                Download all 9 pages as PDF
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
