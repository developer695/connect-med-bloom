import { motion } from "framer-motion";
import { Check } from "lucide-react";
import EditableText from "../EditableText";
import DraggableList from "../DraggableList";
import { 
  useProposalContent, 
  Deliverable, 
  Package, 
  calculatePackagePrice, 
  calculatePackageDurationMonths,
  calculateDeliverableHours,
  calculateDeliverableCost,
  formatPrice
} from "@/contexts/ProposalContentContext";

const ProposalPage = () => {
  const { content, updateContent, isEditMode } = useProposalContent();
  const { proposal } = content;

  const updatePackage = (index: number, field: "name" | "description" | "price" | "duration", value: string) => {
    const newPackages = [...proposal.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    updateContent("proposal", { packages: newPackages });
  };

  const updateDeliverable = (index: number, field: "title" | "description", value: string) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  // Toggle deliverable inclusion in a package
  const toggleDeliverableInPackage = (pkgIndex: number, deliverableTitle: string) => {
    const newPackages = [...proposal.packages];
    const pkg = newPackages[pkgIndex];
    const currentInclusions = pkg.includedDeliverables || [];
    
    if (currentInclusions.includes(deliverableTitle)) {
      newPackages[pkgIndex] = {
        ...pkg,
        includedDeliverables: currentInclusions.filter(t => t !== deliverableTitle),
      };
    } else {
      newPackages[pkgIndex] = {
        ...pkg,
        includedDeliverables: [...currentInclusions, deliverableTitle],
      };
    }
    updateContent("proposal", { packages: newPackages });
  };

  // Get calculated or manual price for a package
  const getPackagePrice = (pkg: Package): string => {
    if (pkg.autoCalculate && pkg.includedDeliverables?.length > 0) {
      const calculatedPrice = calculatePackagePrice(pkg.includedDeliverables, proposal.deliverables);
      return formatPrice(calculatedPrice);
    }
    return pkg.price;
  };

  // Get calculated or manual duration for a package
  const getPackageDuration = (pkg: Package): string => {
    if (pkg.autoCalculate && pkg.includedDeliverables?.length > 0) {
      const months = calculatePackageDurationMonths(pkg.includedDeliverables, proposal.deliverables);
      return `${months}-month engagement`;
    }
    return pkg.duration;
  };

  // Deliverables handlers
  const handleReorderDeliverables = (newDeliverables: Deliverable[]) => {
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const handleRemoveDeliverable = (index: number, item: Deliverable) => {
    const newDeliverables = proposal.deliverables.filter((_, i) => i !== index);
    const newHidden = [...(proposal.hiddenDeliverables || []), item];
    updateContent("proposal", { deliverables: newDeliverables, hiddenDeliverables: newHidden });
  };

  const handleAddDeliverable = (item: Deliverable) => {
    const newDeliverables = [...proposal.deliverables, item];
    const newHidden = (proposal.hiddenDeliverables || []).filter(d => d.title !== item.title);
    updateContent("proposal", { deliverables: newDeliverables, hiddenDeliverables: newHidden });
  };

  // Packages handlers
  const handleReorderPackages = (newPackages: Package[]) => {
    updateContent("proposal", { packages: newPackages });
  };

  const handleRemovePackage = (index: number, item: Package) => {
    const newPackages = proposal.packages.filter((_, i) => i !== index);
    const newHidden = [...(proposal.hiddenPackages || []), item];
    updateContent("proposal", { packages: newPackages, hiddenPackages: newHidden });
  };

  const handleAddPackage = (item: Package) => {
    const newPackages = [...proposal.packages, item];
    const newHidden = (proposal.hiddenPackages || []).filter(p => p.name !== item.name);
    updateContent("proposal", { packages: newPackages, hiddenPackages: newHidden });
  };

  // Get time display string for a deliverable
  const getTimeDisplay = (deliverable: Deliverable): string => {
    const unitLabel = deliverable.durationUnit === 'weeks' ? 'wk' : 'mo';
    return `${deliverable.hoursPerPeriod} hrs/${unitLabel} × ${deliverable.duration} ${deliverable.durationUnit}`;
  };

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">
            <EditableText
              value={proposal.sectionLabel}
              onSave={(val) => updateContent("proposal", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={proposal.title}
              onSave={(val) => updateContent("proposal", { title: val })}
            />
          </h2>
        </motion.div>

        {/* Scope Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
            <EditableText
              value={proposal.scopeTitle}
              onSave={(val) => updateContent("proposal", { scopeTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              value={proposal.scopeText}
              onSave={(val) => updateContent("proposal", { scopeText: val })}
              multiline
            />
          </p>
        </motion.div>

        {/* Deliverables Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
            <EditableText
              value={proposal.deliverablesTitle}
              onSave={(val) => updateContent("proposal", { deliverablesTitle: val })}
            />
          </h3>
          <DraggableList
            items={proposal.deliverables}
            hiddenItems={[]}
            onReorder={handleReorderDeliverables}
            onRemove={handleRemoveDeliverable}
            onAdd={handleAddDeliverable}
            getItemKey={(item, index) => `${item.title}-${index}`}
            itemsLabel="deliverables"
            renderItem={(deliverable, index) => {
              const totalHours = calculateDeliverableHours(deliverable);
              const total = calculateDeliverableCost(deliverable);
              
              return (
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50 h-full pl-8">
                  <h4 className="font-semibold text-foreground mb-2">
                    <EditableText
                      value={deliverable.title}
                      onSave={(val) => updateDeliverable(index, "title", val)}
                    />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <EditableText
                      value={deliverable.description}
                      onSave={(val) => updateDeliverable(index, "description", val)}
                      multiline
                    />
                  </p>
                  {isEditMode && (
                    <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Rate: ${deliverable.rate}/hr</span>
                      <span>{getTimeDisplay(deliverable)}</span>
                      <span>({totalHours} total hrs)</span>
                      <span className="text-primary font-medium">
                        Total: {formatPrice(total)}
                      </span>
                    </div>
                  )}
                </div>
              );
            }}
            renderHiddenItem={(item) => item.title}
          />
        </motion.div>

        {/* Packages/Pricing Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
            <EditableText
              value={proposal.packagesTitle}
              onSave={(val) => updateContent("proposal", { packagesTitle: val })}
            />
          </h3>
          
          {/* Packages */}
          <div className="space-y-4">
            <div className={`grid gap-6 ${proposal.packages.length === 1 ? 'grid-cols-1 max-w-md' : proposal.packages.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
              {proposal.packages.map((pkg, pkgIndex) => (
                <motion.div
                  key={`${pkg.name}-${pkgIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + pkgIndex * 0.1 }}
                  className={`relative rounded-lg p-6 border-2 ${
                    pkgIndex === 1 && proposal.packages.length > 1
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-muted/20"
                  }`}
                >
                  {isEditMode && (
                    <button
                      onClick={() => handleRemovePackage(pkgIndex, pkg)}
                      className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                    >
                      <span className="text-destructive text-xs">✕</span>
                    </button>
                  )}
                  <h4 className="text-lg font-heading font-semibold text-foreground mb-1">
                    <EditableText
                      value={pkg.name}
                      onSave={(val) => updatePackage(pkgIndex, "name", val)}
                    />
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    <EditableText
                      value={pkg.description}
                      onSave={(val) => updatePackage(pkgIndex, "description", val)}
                    />
                  </p>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {pkg.autoCalculate ? (
                      <span>{getPackagePrice(pkg)}</span>
                    ) : (
                      <EditableText
                        value={pkg.price}
                        onSave={(val) => updatePackage(pkgIndex, "price", val)}
                      />
                    )}
                  </div>
                  {isEditMode && pkg.autoCalculate && (
                    <p className="text-xs text-muted-foreground/70 mb-2">Auto-calculated from deliverables</p>
                  )}
                  <p className="text-xs text-muted-foreground mb-4">
                    {pkg.autoCalculate ? (
                      <span>{getPackageDuration(pkg)}</span>
                    ) : (
                      <EditableText
                        value={pkg.duration}
                        onSave={(val) => updatePackage(pkgIndex, "duration", val)}
                      />
                    )}
                  </p>
                  
                  {/* Included Deliverables as checkmarks */}
                  <ul className="space-y-2">
                    {proposal.deliverables.map((deliverable) => {
                      const isIncluded = pkg.includedDeliverables?.includes(deliverable.title);
                      
                      if (isEditMode) {
                        // In edit mode, show all deliverables as toggleable
                        return (
                          <li 
                            key={deliverable.title} 
                            className="flex items-start gap-2 cursor-pointer hover:bg-muted/50 rounded p-1 -ml-1 transition-colors"
                            onClick={() => toggleDeliverableInPackage(pkgIndex, deliverable.title)}
                          >
                            <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              isIncluded 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'border-muted-foreground/30'
                            }`}>
                              {isIncluded && <Check className="w-3 h-3" />}
                            </span>
                            <span className={`text-sm ${isIncluded ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                              {deliverable.title}
                            </span>
                          </li>
                        );
                      }
                      
                      // In view mode, only show included deliverables
                      if (!isIncluded) return null;
                      
                      return (
                        <li key={deliverable.title} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {deliverable.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Terms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-6 md:p-8 rounded-lg bg-primary-light"
        >
          <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">
            <EditableText
              value={proposal.termsTitle}
              onSave={(val) => updateContent("proposal", { termsTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            <EditableText
              value={proposal.termsText}
              onSave={(val) => updateContent("proposal", { termsText: val })}
              multiline
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProposalPage;
