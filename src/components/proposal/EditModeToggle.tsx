import { useProposalContent } from "@/contexts/ProposalContentContext";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditModeToggle = () => {
  const { isEditMode, setIsEditMode, resetContent } = useProposalContent();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isEditMode ? "default" : "outline"}
        size="sm"
        onClick={() => setIsEditMode(!isEditMode)}
        className="gap-2"
      >
        {isEditMode ? (
          <>
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Preview</span>
          </>
        ) : (
          <>
            <Pencil className="w-4 h-4" />
            <span className="hidden md:inline">Edit</span>
          </>
        )}
      </Button>

      {isEditMode && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
           
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all content?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all proposal content back to the default values. Your changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetContent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default EditModeToggle;
