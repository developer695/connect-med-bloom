import { useState } from "react";
import { Plus, Briefcase, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useProposalContent, Deliverable, Package, DurationUnit, formatPrice, calculateDeliverableHours, calculateDeliverableCost } from "@/contexts/ProposalContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const EditSidebar = () => {
  const { content, updateContent, isEditMode } = useProposalContent();
  const [expandedDeliverable, setExpandedDeliverable] = useState<number | null>(null);

  if (!isEditMode) return null;

  const { proposal, value } = content;

  const updateDeliverableRate = (index: number, rate: number) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], rate };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const updateDeliverableHoursPerPeriod = (index: number, hoursPerPeriod: number) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], hoursPerPeriod };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const updateDeliverableDuration = (index: number, duration: number) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], duration };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const updateDeliverableDurationUnit = (index: number, durationUnit: DurationUnit) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], durationUnit };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const updateDeliverableTitle = (index: number, title: string) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], title };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const updateDeliverableDescription = (index: number, description: string) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], description };
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
        <p className="text-xs text-muted-foreground mt-1">Configure deliverables and pricing</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {/* Key Deliverables Section */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Key Deliverables
            </h4>
            <div className="space-y-2">
              {proposal.deliverables.map((deliverable, index) => {
                const totalHours = calculateDeliverableHours(deliverable);
                const total = calculateDeliverableCost(deliverable);
                
                return (
                  <Collapsible
                    key={`del-${index}`}
                    open={expandedDeliverable === index}
                    onOpenChange={(open) => setExpandedDeliverable(open ? index : null)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="p-2 rounded-md bg-background border border-border/50 flex items-center justify-between hover:bg-muted/50 transition-colors">
                        <span className="text-xs font-medium text-foreground truncate flex-1 text-left">
                          {deliverable.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-primary font-medium">
                            {formatPrice(total)}
                          </span>
                          {expandedDeliverable === index ? (
                            <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 p-3 rounded-md bg-background border border-border/50 space-y-3">
                        {/* Title */}
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Title</Label>
                          <Input
                            value={deliverable.title}
                            onChange={(e) => updateDeliverableTitle(index, e.target.value)}
                            className="h-7 text-xs mt-1"
                            placeholder="Deliverable title..."
                          />
                        </div>
                        
                        {/* Description */}
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Description</Label>
                          <Textarea
                            value={deliverable.description}
                            onChange={(e) => updateDeliverableDescription(index, e.target.value)}
                            className="text-xs min-h-[60px] mt-1"
                            placeholder="Deliverable description..."
                          />
                        </div>
                        
                        {/* Pricing */}
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Hourly Rate</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                            <Input
                              type="number"
                              value={deliverable.rate}
                              onChange={(e) => updateDeliverableRate(index, parseInt(e.target.value) || 0)}
                              className="h-7 text-xs pl-5"
                            />
                          </div>
                        </div>
                        
                        {/* Hours per week */}
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Hours per Week</Label>
                          <Input
                            type="number"
                            value={deliverable.hoursPerPeriod}
                            onChange={(e) => updateDeliverableHoursPerPeriod(index, parseInt(e.target.value) || 0)}
                            className="h-7 text-xs mt-1"
                          />
                        </div>
                        
                        {/* Duration */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[10px] text-muted-foreground">Duration</Label>
                            <Input
                              type="number"
                              value={deliverable.duration}
                              onChange={(e) => updateDeliverableDuration(index, parseInt(e.target.value) || 0)}
                              className="h-7 text-xs mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-muted-foreground">Unit</Label>
                            <Select
                              value={deliverable.durationUnit}
                              onValueChange={(val) => updateDeliverableDurationUnit(index, val as DurationUnit)}
                            >
                              <SelectTrigger className="h-7 text-xs mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border border-border z-50">
                                <SelectItem value="weeks">Weeks</SelectItem>
                                <SelectItem value="months">Months</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Summary */}
                        <div className="pt-2 border-t border-border/30 space-y-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{deliverable.hoursPerPeriod} hrs/wk × {deliverable.duration} {deliverable.durationUnit}</span>
                            <span>{totalHours} total hrs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[10px] text-muted-foreground">${deliverable.rate}/hr</span>
                            <span className="text-xs text-primary font-medium">
                              {formatPrice(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
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
