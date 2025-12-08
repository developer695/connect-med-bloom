import { motion } from "framer-motion";
import EditableText from "../EditableText";
import DraggableList from "../DraggableList";
import { useProposalContent } from "@/contexts/ProposalContentContext";

type Deliverable = { title: string; description: string };
type Package = { name: string; description: string; price: string; duration: string; features: string[] };

const ProposalPage = () => {
  const { content, updateContent, isEditMode } = useProposalContent();
  const { proposal } = content;

  const updatePackage = (index: number, field: "name" | "description" | "price" | "duration", value: string) => {
    const newPackages = [...proposal.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    updateContent("proposal", { packages: newPackages });
  };

  const updatePackageFeature = (pkgIndex: number, featureIndex: number, value: string) => {
    const newPackages = [...proposal.packages];
    const newFeatures = [...newPackages[pkgIndex].features];
    newFeatures[featureIndex] = value;
    newPackages[pkgIndex] = { ...newPackages[pkgIndex], features: newFeatures };
    updateContent("proposal", { packages: newPackages });
  };

  const updateDeliverable = (index: number, field: "title" | "description", value: string) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    updateContent("proposal", { deliverables: newDeliverables });
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
            hiddenItems={proposal.hiddenDeliverables || []}
            onReorder={handleReorderDeliverables}
            onRemove={handleRemoveDeliverable}
            onAdd={handleAddDeliverable}
            getItemKey={(item, index) => `${item.title}-${index}`}
            itemsLabel="deliverables"
            renderItem={(deliverable, index) => (
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
              </div>
            )}
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
          
          {/* Packages with drag and drop */}
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
                    <EditableText
                      value={pkg.price}
                      onSave={(val) => updatePackage(pkgIndex, "price", val)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    <EditableText
                      value={pkg.duration}
                      onSave={(val) => updatePackage(pkgIndex, "duration", val)}
                    />
                  </p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-sm text-muted-foreground">
                          <EditableText
                            value={feature}
                            onSave={(val) => updatePackageFeature(pkgIndex, featureIndex, val)}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Hidden packages - available to add back */}
            {isEditMode && (proposal.hiddenPackages || []).length > 0 && (
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-border/50 bg-muted/20">
                <p className="text-sm text-muted-foreground mb-3">
                  Available packages (click to add):
                </p>
                <div className="flex flex-wrap gap-2">
                  {(proposal.hiddenPackages || []).map((pkg, index) => (
                    <button
                      key={`hidden-pkg-${index}`}
                      onClick={() => handleAddPackage(pkg)}
                      className="px-3 py-1.5 text-sm rounded-md border border-border bg-background hover:bg-muted transition-colors flex items-center gap-1"
                    >
                      <span className="text-primary">+</span>
                      {pkg.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
