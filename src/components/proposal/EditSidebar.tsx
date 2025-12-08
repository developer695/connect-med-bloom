import { Plus } from "lucide-react";
import { useProposalContent } from "@/contexts/ProposalContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const EditSidebar = () => {
  const { content, updateContent, isEditMode } = useProposalContent();

  if (!isEditMode) return null;

  const { proposal, value } = content;

  const hasHiddenItems = 
    (proposal.hiddenDeliverables?.length || 0) > 0 ||
    (proposal.hiddenPackages?.length || 0) > 0 ||
    (value.hiddenPillars?.length || 0) > 0 ||
    (value.hiddenDifferentiators?.length || 0) > 0;

  if (!hasHiddenItems) return null;

  const handleAddDeliverable = (item: { title: string; description: string }) => {
    const newDeliverables = [...proposal.deliverables, item];
    const newHidden = (proposal.hiddenDeliverables || []).filter(d => d.title !== item.title);
    updateContent("proposal", { deliverables: newDeliverables, hiddenDeliverables: newHidden });
  };

  const handleAddPackage = (item: { name: string; description: string; price: string; duration: string; features: string[] }) => {
    const newPackages = [...proposal.packages, item];
    const newHidden = (proposal.hiddenPackages || []).filter(p => p.name !== item.name);
    updateContent("proposal", { packages: newPackages, hiddenPackages: newHidden });
  };

  const handleAddPillar = (item: { title: string; description: string }) => {
    const newPillars = [...value.pillars, item];
    const newHidden = ((value as any).hiddenPillars || []).filter((p: any) => p.title !== item.title);
    updateContent("value", { pillars: newPillars, hiddenPillars: newHidden } as any);
  };

  const handleAddDifferentiator = (item: { title: string; description: string }) => {
    const newDiffs = [...value.differentiators, item];
    const newHidden = ((value as any).hiddenDifferentiators || []).filter((d: any) => d.title !== item.title);
    updateContent("value", { differentiators: newDiffs, hiddenDifferentiators: newHidden } as any);
  };

  return (
    <div className="w-64 bg-muted/50 border-l border-border flex flex-col h-full">
      <div className="p-3 border-b border-border bg-background">
        <h3 className="font-semibold text-sm text-foreground">Available Items</h3>
        <p className="text-xs text-muted-foreground mt-1">Click to add back to document</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Hidden Deliverables */}
          {(proposal.hiddenDeliverables?.length || 0) > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Deliverables</h4>
              <div className="space-y-1">
                {proposal.hiddenDeliverables?.map((item, index) => (
                  <button
                    key={`del-${index}`}
                    onClick={() => handleAddDeliverable(item)}
                    className="w-full text-left p-2 rounded-md bg-background hover:bg-primary/10 border border-border/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hidden Packages */}
          {(proposal.hiddenPackages?.length || 0) > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Packages</h4>
              <div className="space-y-1">
                {proposal.hiddenPackages?.map((item, index) => (
                  <button
                    key={`pkg-${index}`}
                    onClick={() => handleAddPackage(item)}
                    className="w-full text-left p-2 rounded-md bg-background hover:bg-primary/10 border border-border/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-5">{item.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hidden Pillars */}
          {((value as any).hiddenPillars?.length || 0) > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Value Pillars</h4>
              <div className="space-y-1">
                {(value as any).hiddenPillars?.map((item: any, index: number) => (
                  <button
                    key={`pil-${index}`}
                    onClick={() => handleAddPillar(item)}
                    className="w-full text-left p-2 rounded-md bg-background hover:bg-primary/10 border border-border/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs font-medium text-foreground">{item.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hidden Differentiators */}
          {((value as any).hiddenDifferentiators?.length || 0) > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Differentiators</h4>
              <div className="space-y-1">
                {(value as any).hiddenDifferentiators?.map((item: any, index: number) => (
                  <button
                    key={`diff-${index}`}
                    onClick={() => handleAddDifferentiator(item)}
                    className="w-full text-left p-2 rounded-md bg-background hover:bg-primary/10 border border-border/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditSidebar;
