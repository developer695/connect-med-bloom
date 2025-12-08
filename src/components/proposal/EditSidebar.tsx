import { Plus, DollarSign, Clock } from "lucide-react";
import { useProposalContent, Deliverable, Package, formatPrice } from "@/contexts/ProposalContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const EditSidebar = () => {
  const { content, updateContent, isEditMode } = useProposalContent();

  if (!isEditMode) return null;

  const { proposal, value } = content;

  const updateDeliverableRate = (index: number, rate: number) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], rate };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const updateDeliverableHours = (index: number, hours: number) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], hours };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const togglePackageAutoCalculate = (index: number) => {
    const newPackages = [...proposal.packages];
    newPackages[index] = { 
      ...newPackages[index], 
      autoCalculate: !newPackages[index].autoCalculate 
    };
    updateContent("proposal", { packages: newPackages });
  };

  const handleAddDeliverable = (item: Deliverable) => {
    const newDeliverables = [...proposal.deliverables, item];
    const newHidden = (proposal.hiddenDeliverables || []).filter(d => d.title !== item.title);
    updateContent("proposal", { deliverables: newDeliverables, hiddenDeliverables: newHidden });
  };

  const handleAddPackage = (item: Package) => {
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

  const hasHiddenItems = 
    (proposal.hiddenDeliverables?.length || 0) > 0 ||
    (proposal.hiddenPackages?.length || 0) > 0 ||
    (value.hiddenPillars?.length || 0) > 0 ||
    (value.hiddenDifferentiators?.length || 0) > 0;

  return (
    <div className="w-72 bg-muted/50 border-l border-border flex flex-col h-full">
      <div className="p-3 border-b border-border bg-background">
        <h3 className="font-semibold text-sm text-foreground">Proposal Settings</h3>
        <p className="text-xs text-muted-foreground mt-1">Configure rates and timeline</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {/* Deliverable Pricing Section */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Deliverable Pricing
            </h4>
            <div className="space-y-3">
              {proposal.deliverables.map((deliverable, index) => (
                <div 
                  key={`rate-${index}`}
                  className="p-3 rounded-md bg-background border border-border/50"
                >
                  <p className="text-xs font-medium text-foreground mb-2 truncate" title={deliverable.title}>
                    {deliverable.title}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Rate/hr</Label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={deliverable.rate}
                          onChange={(e) => updateDeliverableRate(index, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs pl-5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Hours</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={deliverable.hours}
                          onChange={(e) => updateDeliverableHours(index, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs"
                        />
                        <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs text-primary font-medium">
                      Total: {formatPrice(deliverable.rate * deliverable.hours)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Auto-Calculate Settings */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Package Pricing Mode
            </h4>
            <div className="space-y-2">
              {proposal.packages.map((pkg, index) => (
                <div 
                  key={`pkg-calc-${index}`}
                  className="p-2 rounded-md bg-background border border-border/50 flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-foreground">{pkg.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {pkg.autoCalculate ? 'Auto' : 'Manual'}
                    </span>
                    <Switch
                      checked={pkg.autoCalculate}
                      onCheckedChange={() => togglePackageAutoCalculate(index)}
                      className="scale-75"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Items Section */}
          {hasHiddenItems && (
            <>
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Available Items
                </h4>
                <p className="text-[10px] text-muted-foreground mb-3">Click to add back</p>
              </div>

              {/* Hidden Deliverables */}
              {(proposal.hiddenDeliverables?.length || 0) > 0 && (
                <div>
                  <h5 className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase">Deliverables</h5>
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
                  <h5 className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase">Packages</h5>
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
                  <h5 className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase">Value Pillars</h5>
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
                  <h5 className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase">Differentiators</h5>
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
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditSidebar;
