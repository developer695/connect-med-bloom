import { useState, useRef, useEffect } from "react";
import { Plus, Briefcase, ChevronDown, ChevronRight, Package, Users, Trash2, Camera, Save, FilePlus, Archive, UserPlus } from "lucide-react";
import { useProposalContent, Deliverable, Package as PackageType, DurationUnit, formatPrice, calculateDeliverableHours, calculateDeliverableCost, SubDeliverable } from "@/contexts/ProposalContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EditSidebar = () => {
  const {
    content,
    updateContent,
    isEditMode,
    resetContent,
    currentProposalUuid,

    setCurrentProposalUuid,
    currentProposalVersion,
    setCurrentProposalVersion,
    getContent
  } = useProposalContent();

  const [expandedDeliverable, setExpandedDeliverable] = useState<number | null>(null);
  const [expandedPackage, setExpandedPackage] = useState<number | null>(null);
  const [expandedTeamMember, setExpandedTeamMember] = useState<number | null>(null);
  const [newSubDeliverableInputs, setNewSubDeliverableInputs] = useState<Record<number, string>>({});
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', title: '', bio: '', image: '' });
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({
    title: '',
    description: '',
    rate: 200,
    hoursPerPeriod: 10,
    duration: 4,
    durationUnit: 'weeks' as DurationUnit,
    subDeliverables: [] as SubDeliverable[]
  });
  const [newDeliverableSubInput, setNewDeliverableSubInput] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormData, setSaveFormData] = useState({ author: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const teamFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const newTeamFileInputRef = useRef<HTMLInputElement | null>(null);

  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', role: '', bio: '', image: '' });
  const partnerFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const newPartnerFileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Load proposal
  const loadSingleProposal = async () => {
    setIsLoading(true);
    // setAutoSaveEnabled(false);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("content_type", "proposal")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading proposal:', error);
        return;
      }

      if (data) {
        if (data.cover) updateContent("cover", data.cover);
        if (data.letter) updateContent("letter", data.letter);
        if (data.about) updateContent("about", data.about);
        if (data.how_we_work) updateContent("howWeWork", data.how_we_work);
        if (data.solutions) updateContent("solutions", data.solutions);
        if (data.markets) updateContent("markets", data.markets);
        if (data.clients) updateContent("clients", data.clients);
        if (data.team) updateContent("team", data.team);
        if (data.proposal) updateContent("proposal", data.proposal);
        if (data.value) updateContent("value", data.value);
        if (data.contact) updateContent("contact", data.contact);
        if (data.shapes) updateContent("shapes", data.shapes);

        setCurrentProposalUuid(data.id);
        setCurrentProposalVersion(data.version);
        setSaveFormData({ author: data.author || '' });

        console.log('✅ Proposal loaded!', data);
      } else {
        console.log('📝 No existing proposal found. Will create on first save.');
      }
    } catch (error) {
      console.error('❌ Error loading proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ MANUAL SAVE ONLY - No Auto-Save
  const handleSaveProposal = async () => {
    if (!saveFormData.author.trim()) {
      alert('Please enter author name');
      return;
    }

    const currentContent = getContent();

    console.log('🔍 === SAVE DEBUG START ===');
    console.log('📊 From getContent():', currentContent);
    console.log('📊 From context.content:', content);
    console.log('📊 Are they equal?', currentContent === content);
    console.log('📊 Cover from getContent():', currentContent.cover);
    console.log('📊 Cover from content:', content.cover);
    console.log('📊 Proposal from getContent():', currentContent.proposal);
    console.log('📊 Proposal from content:', content.proposal);
    console.log('🔍 === SAVE DEBUG END ===');

    setIsSaving(true);
    try {
      const currentContent = getContent();
      console.log('💾 Saving content to database...', currentContent);

      // ✅ Check for existing proposal
      const { data: existing, error: checkError } = await supabase
        .from("site_content")
        .select("*")
        .eq("content_type", "proposal")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('📊 Existing proposal:', existing);

      if (checkError) {
        console.error('❌ Error checking existing proposal:', checkError);
        alert(`Error: ${checkError.message}`);
        return;
      }

      if (existing) {
        console.log('📝 Updating proposal ID:', existing.id, 'Current version:', existing.version);
        const newVersion = existing.version + 1;


        // ✅ UPDATE - Return data to verify it worked
        const { data: updateResult, error: updateError } = await supabase
          .from("site_content")
          .update({
            cover: currentContent.cover,
            letter: currentContent.letter,
            about: currentContent.about,
            how_we_work: currentContent.howWeWork,
            solutions: currentContent.solutions,
            markets: currentContent.markets,
            clients: currentContent.clients,
            team: currentContent.team,
            proposal: currentContent.proposal,
            value: currentContent.value,
            contact: currentContent.contact,
            shapes: currentContent.shapes,
            author: saveFormData.author.trim(),
            version: newVersion,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id)
          .select('id, version, updated_at');

        console.log('📤 Update result:', { data: updateResult, error: updateError });

        if (updateError) {
          console.error('❌ Failed to update:', updateError);
          alert(`Failed to update: ${updateError.message}`);
          return;
        }

        // ✅ Verify data was returned
        if (!updateResult || updateResult.length === 0) {
          console.error('⚠️ Update returned no data - RLS may be blocking');
          alert('Warning: Update may have failed due to permissions. Please refresh and check if changes saved.');
          return;
        }

        console.log('✅ Update successful! New data:', updateResult[0]);

        setCurrentProposalUuid(existing.id);
        setCurrentProposalVersion(newVersion);

        // ✅ Force reload to verify changes
        // await loadSingleProposal();

        toast.success(`Proposal updated successfully! (Version ${newVersion})`);

      } else {
        console.log('📝 Creating new proposal...');
        const viewToken = crypto.randomUUID();

        const { data: insertData, error: insertError } = await supabase
          .from("site_content")
          .insert({
            content_type: "proposal",
            cover: currentContent.cover,
            letter: currentContent.letter,
            about: currentContent.about,
            how_we_work: currentContent.howWeWork,
            solutions: currentContent.solutions,
            markets: currentContent.markets,
            clients: currentContent.clients,
            team: currentContent.team,
            proposal: currentContent.proposal,
            value: currentContent.value,
            contact: currentContent.contact,
            shapes: currentContent.shapes,
            author: saveFormData.author.trim(),
            is_active: true,
            view_token: viewToken,
            version: 1
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to insert:', insertError);
          alert(`Failed to save: ${insertError.message}`);
          return;
        }

        console.log('✅ Insert successful:', insertData);

        if (insertData) {
          setCurrentProposalUuid(insertData.id);
          setCurrentProposalVersion(insertData.version);
          alert('Proposal saved successfully!');
        }
      }

      setShowSaveDialog(false);
    } catch (error) {
      console.error('❌ Error saving proposal:', error);
      alert('Error saving proposal: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadSingleProposal();
  }, []);

  const handleNewProposal = () => {
    if (confirm('Reset proposal content? This will clear all data.')) {
      resetContent();
      setSaveFormData({ author: '' });
    }
  };

  const handleTeamImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newTeam = [...(proposal.projectTeam || [])];
        newTeam[index] = { ...newTeam[index], image: reader.result as string };
        updateContent("proposal", { projectTeam: newTeam });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewTeamImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTeamMember(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePartnerImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMembers = [...(content.team.members || [])];
        newMembers[index] = { ...newMembers[index], image: reader.result as string };
        updateContent("team", { members: newMembers });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewPartnerImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPartner(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addPartnerToProjectTeam = (partner: { name: string; role: string; bio: string; image?: string }) => {
    const projectTeamMember = {
      name: partner.name,
      title: partner.role,
      bio: partner.bio,
      image: partner.image || ''
    };
    const newProjectTeam = [...(content.proposal.projectTeam || []), projectTeamMember];
    updateContent("proposal", { projectTeam: newProjectTeam });
  };

  if (!isEditMode) return null;

  const { proposal, value, team } = content;

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

  const toggleSubDeliverable = (deliverableIndex: number, subIndex: number) => {
    const newDeliverables = [...proposal.deliverables];
    const newSubDeliverables = [...newDeliverables[deliverableIndex].subDeliverables];
    newSubDeliverables[subIndex] = {
      ...newSubDeliverables[subIndex],
      included: !newSubDeliverables[subIndex].included
    };
    newDeliverables[deliverableIndex] = {
      ...newDeliverables[deliverableIndex],
      subDeliverables: newSubDeliverables
    };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const addSubDeliverable = (deliverableIndex: number, name: string) => {
    const newDeliverables = [...proposal.deliverables];
    const newSubDeliverables = [...newDeliverables[deliverableIndex].subDeliverables, { name, included: true }];
    newDeliverables[deliverableIndex] = {
      ...newDeliverables[deliverableIndex],
      subDeliverables: newSubDeliverables
    };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  const updatePackageHoursPerWeek = (index: number, hoursPerWeek: number) => {
    const newPackages = [...proposal.packages];
    newPackages[index] = { ...newPackages[index], hoursPerWeek };
    updateContent("proposal", { packages: newPackages });
  };

  const updatePackageDurationWeeks = (index: number, durationWeeks: number) => {
    const newPackages = [...proposal.packages];
    newPackages[index] = { ...newPackages[index], durationWeeks };
    updateContent("proposal", { packages: newPackages });
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

  const handleAddPackage = (item: PackageType) => {
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
        <p className="text-xs text-muted-foreground mt-1">
          {currentProposalUuid
            ? `Editing • Version ${currentProposalVersion}`
            : 'Configure deliverables and pricing'}
        </p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              if (!saveFormData.author && !currentProposalUuid) {
                setShowSaveDialog(true);
              } else {
                handleSaveProposal();
              }
            }}
            disabled={isSaving}
            className="flex-1 h-7 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3 h-3" />
            {isSaving ? 'Saving...' : currentProposalUuid ? 'Update' : 'Save'}
          </button>
          <button
            onClick={handleNewProposal}
            className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors flex items-center justify-center gap-1"
          >
            <FilePlus className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {showSaveDialog && (
        <div className="p-3 border-b border-border bg-primary/5">
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
            <Archive className="w-3 h-3" />
            {currentProposalUuid ? 'Update Proposal' : 'Save Proposal'}
          </h4>
          <div className="space-y-2">
            <Input
              value={saveFormData.author}
              onChange={(e) => setSaveFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author name..."
              className="h-7 text-xs"
              disabled={isSaving}
            />
            {currentProposalUuid && (
              <p className="text-[10px] text-muted-foreground">
                Version {currentProposalVersion} → {currentProposalVersion + 1}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleSaveProposal}
                disabled={isSaving}
                className="flex-1 h-7 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : currentProposalUuid ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                disabled={isSaving}
                className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {/* Project Team Section */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1">
              <Users className="w-3 h-3" />
              Project Team
            </h4>
            <div className="space-y-2">
              {proposal.projectTeam?.map((member, index) => (
                <Collapsible
                  key={`team-${index}`}
                  open={expandedTeamMember === index}
                  onOpenChange={(open) => setExpandedTeamMember(open ? index : null)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="p-2 rounded-md bg-background border border-border/50 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-medium text-foreground truncate">
                          {member.name}
                        </span>
                      </div>
                      {expandedTeamMember === index ? (
                        <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-3 rounded-md bg-background border border-border/50 space-y-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => {
                            const newTeam = [...(proposal.projectTeam || [])];
                            newTeam[index] = { ...newTeam[index], name: e.target.value };
                            updateContent("proposal", { projectTeam: newTeam });
                          }}
                          className="h-7 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={member.title}
                          onChange={(e) => {
                            const newTeam = [...(proposal.projectTeam || [])];
                            newTeam[index] = { ...newTeam[index], title: e.target.value };
                            updateContent("proposal", { projectTeam: newTeam });
                          }}
                          className="h-7 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Bio</Label>
                        <Textarea 
                          value={member.bio}
                          onChange={(e) => {
                            const newTeam = [...(proposal.projectTeam || [])];
                            newTeam[index] = { ...newTeam[index], bio: e.target.value };
                            updateContent("proposal", { projectTeam: newTeam });
                          }}
                          className="text-xs min-h-[50px] mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Photo</Label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (teamFileInputRefs.current[index] = el)}
                          onChange={(e) => handleTeamImageUpload(index, e)}
                          className="hidden"
                        />
                        <button
                          onClick={() => teamFileInputRefs.current[index]?.click()}
                          className="w-full mt-1 h-16 rounded-md border border-dashed border-border/50 flex flex-col items-center justify-center gap-1 hover:bg-muted/30 transition-colors overflow-hidden"
                        >
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Camera className="w-4 h-4 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">Upload photo</span>
                            </>
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const newTeam = proposal.projectTeam?.filter((_, i) => i !== index) || [];
                          updateContent("proposal", { projectTeam: newTeam });
                          setExpandedTeamMember(null);
                        }}
                        className="w-full h-7 text-[10px] text-destructive border border-destructive/30 rounded hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove Team Member
                      </button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}

              {showAddTeamMember ? (
                <div className="p-3 rounded-md bg-background border border-primary/30 space-y-2">
                  <Input
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name..."
                    className="h-7 text-xs"
                  />
                  <Input
                    value={newTeamMember.title}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Title..."
                    className="h-7 text-xs"
                  />
                  <Textarea
                    value={newTeamMember.bio}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Brief bio..."
                    className="text-xs min-h-[40px]"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={newTeamFileInputRef}
                      onChange={handleNewTeamImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => newTeamFileInputRef.current?.click()}
                      className="w-full h-12 rounded-md border border-dashed border-border/50 flex items-center justify-center gap-2 hover:bg-muted/30 transition-colors overflow-hidden"
                    >
                      {newTeamMember.image ? (
                        <img src={newTeamMember.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Upload photo</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (newTeamMember.name.trim()) {
                          const newTeam = [...(proposal.projectTeam || []), newTeamMember];
                          updateContent("proposal", { projectTeam: newTeam });
                          setNewTeamMember({ name: '', title: '', bio: '', image: '' });
                          setShowAddTeamMember(false);
                        }
                      }}
                      className="flex-1 h-7 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setNewTeamMember({ name: '', title: '', bio: '', image: '' });
                        setShowAddTeamMember(false);
                      }}
                      className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddTeamMember(true)}
                  className="w-full p-2 rounded-md border border-dashed border-border/50 text-[10px] text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Team Member
                </button>
              )}
            </div>
          </div>

          {/* Partners Section */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1">
              <Users className="w-3 h-3" />
              Partners (Our Team)
            </h4>
            <div className="space-y-2">
              {team.members?.map((partner, index) => (
                <Collapsible
                  key={`partner-${index}`}
                  open={expandedPartner === index}
                  onOpenChange={(open) => setExpandedPartner(open ? index : null)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="p-2 rounded-md bg-background border border-border/50 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-primary overflow-hidden">
                          {partner.image ? (
                            <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                          ) : (
                            partner.name.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <span className="text-xs font-medium text-foreground truncate">
                          {partner.name}
                        </span>
                      </div>
                      {expandedPartner === index ? (
                        <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-3 rounded-md bg-background border border-border/50 space-y-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Name</Label>
                        <Input
                          value={partner.name}
                          onChange={(e) => {
                            const newMembers = [...(team.members || [])];
                            newMembers[index] = { ...newMembers[index], name: e.target.value };
                            updateContent("team", { members: newMembers });
                          }}
                          className="h-7 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Role</Label>
                        <Input
                          value={partner.role}
                          onChange={(e) => {
                            const newMembers = [...(team.members || [])];
                            newMembers[index] = { ...newMembers[index], role: e.target.value };
                            updateContent("team", { members: newMembers });
                          }}
                          className="h-7 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Bio</Label>
                        <Textarea
                          value={partner.bio}
                          onChange={(e) => {
                            const newMembers = [...(team.members || [])];
                            newMembers[index] = { ...newMembers[index], bio: e.target.value };
                            updateContent("team", { members: newMembers });
                          }}
                          className="text-xs min-h-[50px] mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Photo</Label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (partnerFileInputRefs.current[index] = el)}
                          onChange={(e) => handlePartnerImageUpload(index, e)}
                          className="hidden"
                        />
                        <button
                          onClick={() => partnerFileInputRefs.current[index]?.click()}
                          className="w-full mt-1 h-16 rounded-md border border-dashed border-border/50 flex flex-col items-center justify-center gap-1 hover:bg-muted/30 transition-colors overflow-hidden"
                        >
                          {partner.image ? (
                            <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Camera className="w-4 h-4 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">Upload photo</span>
                            </>
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => addPartnerToProjectTeam(partner)}
                        className="w-full h-7 text-[10px] bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        Add to Project Team
                      </button>
                      <button
                        onClick={() => {
                          const newMembers = team.members?.filter((_, i) => i !== index) || [];
                          updateContent("team", { members: newMembers });
                          setExpandedPartner(null);
                        }}
                        className="w-full h-7 text-[10px] text-destructive border border-destructive/30 rounded hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove Partner
                      </button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}

              {showAddPartner ? (
                <div className="p-3 rounded-md bg-background border border-primary/30 space-y-2">
                  <Input
                    value={newPartner.name}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name..."
                    className="h-7 text-xs"
                  />
                  <Input
                    value={newPartner.role}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Role/Title..."
                    className="h-7 text-xs"
                  />
                  <Textarea
                    value={newPartner.bio}
                    onChange={(e) => setNewPartner(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Brief bio..."
                    className="text-xs min-h-[40px]"
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={newPartnerFileInputRef}
                      onChange={handleNewPartnerImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => newPartnerFileInputRef.current?.click()}
                      className="w-full h-12 rounded-md border border-dashed border-border/50 flex items-center justify-center gap-2 hover:bg-muted/30 transition-colors overflow-hidden"
                    >
                      {newPartner.image ? (
                        <img src={newPartner.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Upload photo</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (newPartner.name.trim()) {
                          const newMembers = [...(team.members || []), newPartner];
                          updateContent("team", { members: newMembers });
                          setNewPartner({ name: '', role: '', bio: '', image: '' });
                          setShowAddPartner(false);
                        }
                      }}
                      className="flex-1 h-7 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setNewPartner({ name: '', role: '', bio: '', image: '' });
                        setShowAddPartner(false);
                      }}
                      className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddPartner(true)}
                  className="w-full p-2 rounded-md border border-dashed border-border/50 text-[10px] text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Partner
                </button>
              )}
            </div>
          </div>

          {/* Key Deliverables Section */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Key Deliverables
            </h4>
            <div className="space-y-2">
              {showAddDeliverable ? (
                <div className="p-3 rounded-md bg-primary/5 border border-primary/20 space-y-3 mb-2">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Title</Label>
                    <Input
                      value={newDeliverable.title}
                      onChange={(e) => setNewDeliverable(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Deliverable title..."
                      className="h-7 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Description</Label>
                    <Textarea
                      value={newDeliverable.description}
                      onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Deliverable description..."
                      className="text-xs min-h-[50px] mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Hourly Rate</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={newDeliverable.rate}
                          onChange={(e) => setNewDeliverable(prev => ({ ...prev, rate: parseInt(e.target.value) || 0 }))}
                          className="h-7 text-xs pl-5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Hours/Week</Label>
                      <Input
                        type="number"
                        value={newDeliverable.hoursPerPeriod}
                        onChange={(e) => setNewDeliverable(prev => ({ ...prev, hoursPerPeriod: parseInt(e.target.value) || 0 }))}
                        className="h-7 text-xs mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Duration</Label>
                      <Input
                        type="number"
                        value={newDeliverable.duration}
                        onChange={(e) => setNewDeliverable(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                        className="h-7 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Unit</Label>
                      <Select
                        value={newDeliverable.durationUnit}
                        onValueChange={(val) => setNewDeliverable(prev => ({ ...prev, durationUnit: val as DurationUnit }))}
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

                  <div className="pt-2 border-t border-border/30">
                    <Label className="text-[10px] text-muted-foreground mb-2 block">Engagement Items</Label>
                    <div className="space-y-1.5">
                      {newDeliverable.subDeliverables.map((sub, subIndex) => (
                        <div key={`new-sub-${subIndex}`} className="flex items-center gap-2">
                          <Checkbox
                            checked={sub.included}
                            onCheckedChange={() => {
                              const newSubs = [...newDeliverable.subDeliverables];
                              newSubs[subIndex] = { ...newSubs[subIndex], included: !newSubs[subIndex].included };
                              setNewDeliverable(prev => ({ ...prev, subDeliverables: newSubs }));
                            }}
                            className="h-3.5 w-3.5"
                          />
                          <span className="text-[10px] text-foreground flex-1">{sub.name}</span>
                          <button
                            onClick={() => {
                              const newSubs = newDeliverable.subDeliverables.filter((_, i) => i !== subIndex);
                              setNewDeliverable(prev => ({ ...prev, subDeliverables: newSubs }));
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-1 mt-2">
                        <Input
                          value={newDeliverableSubInput}
                          onChange={(e) => setNewDeliverableSubInput(e.target.value)}
                          placeholder="New item name..."
                          className="h-6 text-[10px] flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newDeliverableSubInput.trim()) {
                              setNewDeliverable(prev => ({
                                ...prev,
                                subDeliverables: [...prev.subDeliverables, { name: newDeliverableSubInput.trim(), included: true }]
                              }));
                              setNewDeliverableSubInput('');
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (newDeliverableSubInput.trim()) {
                              setNewDeliverable(prev => ({
                                ...prev,
                                subDeliverables: [...prev.subDeliverables, { name: newDeliverableSubInput.trim(), included: true }]
                              }));
                              setNewDeliverableSubInput('');
                            }
                          }}
                          className="h-6 px-2 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (newDeliverable.title.trim()) {
                          const newDeliverables = [...proposal.deliverables, newDeliverable];
                          updateContent("proposal", { deliverables: newDeliverables });
                          setNewDeliverable({
                            title: '',
                            description: '',
                            rate: 200,
                            hoursPerPeriod: 10,
                            duration: 4,
                            durationUnit: 'weeks' as DurationUnit,
                            subDeliverables: []
                          });
                          setNewDeliverableSubInput('');
                          setShowAddDeliverable(false);
                        }
                      }}
                      className="flex-1 h-7 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                    >
                      Add Deliverable
                    </button>
                    <button
                      onClick={() => {
                        setNewDeliverable({
                          title: '',
                          description: '',
                          rate: 200,
                          hoursPerPeriod: 10,
                          duration: 4,
                          durationUnit: 'weeks' as DurationUnit,
                          subDeliverables: []
                        });
                        setNewDeliverableSubInput('');
                        setShowAddDeliverable(false);
                      }}
                      className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddDeliverable(true)}
                  className="w-full p-2 rounded-md border border-dashed border-border/50 text-[10px] text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-colors flex items-center justify-center gap-1 mb-2"
                >
                  <Plus className="w-3 h-3" />
                  Add New Deliverable
                </button>
              )}

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
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Title</Label>
                          <Input
                            value={deliverable.title}
                            onChange={(e) => updateDeliverableTitle(index, e.target.value)}
                            className="h-7 text-xs mt-1"
                            placeholder="Deliverable title..."
                          />
                        </div>

                        <div>
                          <Label className="text-[10px] text-muted-foreground">Description</Label>
                          <Textarea
                            value={deliverable.description}
                            onChange={(e) => updateDeliverableDescription(index, e.target.value)}
                            className="text-xs min-h-[60px] mt-1"
                            placeholder="Deliverable description..."
                          />
                        </div>

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

                        <div>
                          <Label className="text-[10px] text-muted-foreground">Hours per Week</Label>
                          <Input
                            type="number"
                            value={deliverable.hoursPerPeriod}
                            onChange={(e) => updateDeliverableHoursPerPeriod(index, parseInt(e.target.value) || 0)}
                            className="h-7 text-xs mt-1"
                          />
                        </div>

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

                        <div className="pt-2 border-t border-border/30">
                          <Label className="text-[10px] text-muted-foreground mb-2 block">Engagement Items</Label>
                          <div className="space-y-1.5">
                            {deliverable.subDeliverables?.map((sub, subIndex) => (
                              <div
                                key={`sub-${index}-${subIndex}`}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`sub-${index}-${subIndex}`}
                                  checked={sub.included}
                                  onCheckedChange={() => toggleSubDeliverable(index, subIndex)}
                                  className="h-3.5 w-3.5"
                                />
                                <label
                                  htmlFor={`sub-${index}-${subIndex}`}
                                  className="text-[10px] text-foreground cursor-pointer flex-1"
                                >
                                  {sub.name}
                                </label>
                              </div>
                            ))}

                            <div className="flex items-center gap-1 mt-2">
                              <Input
                                value={newSubDeliverableInputs[index] || ''}
                                onChange={(e) => setNewSubDeliverableInputs(prev => ({ ...prev, [index]: e.target.value }))}
                                placeholder="New item name..."
                                className="h-6 text-[10px] flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newSubDeliverableInputs[index]?.trim()) {
                                    addSubDeliverable(index, newSubDeliverableInputs[index].trim());
                                    setNewSubDeliverableInputs(prev => ({ ...prev, [index]: '' }));
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  if (newSubDeliverableInputs[index]?.trim()) {
                                    addSubDeliverable(index, newSubDeliverableInputs[index].trim());
                                    setNewSubDeliverableInputs(prev => ({ ...prev, [index]: '' }));
                                  }
                                }}
                                className="h-6 px-2 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

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

          {/* Engagement Packages Section */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1">
              <Package className="w-3 h-3" />
              Engagement Packages
            </h4>
            <div className="space-y-2">
              {proposal.packages.map((pkg, index) => (
                <Collapsible
                  key={`pkg-${index}`}
                  open={expandedPackage === index}
                  onOpenChange={(open) => setExpandedPackage(open ? index : null)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="p-2 rounded-md bg-background border border-border/50 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <span className="text-xs font-medium text-foreground truncate flex-1 text-left">
                        {pkg.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-primary font-medium">
                          {pkg.hoursPerWeek}h/wk • {pkg.durationWeeks}wks
                        </span>
                        {expandedPackage === index ? (
                          <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-3 rounded-md bg-background border border-border/50 space-y-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Hours per Week</Label>
                        <Input
                          type="number"
                          value={pkg.hoursPerWeek}
                          onChange={(e) => updatePackageHoursPerWeek(index, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-[10px] text-muted-foreground">Duration (weeks)</Label>
                        <Input
                          type="number"
                          value={pkg.durationWeeks}
                          onChange={(e) => updatePackageDurationWeeks(index, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs mt-1"
                        />
                      </div>

                      <div className="pt-2 border-t border-border/30">
                        <Label className="text-[10px] text-muted-foreground mb-2 block">Included Deliverables</Label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {pkg.includedDeliverables.map((delTitle) => {
                            const deliverable = proposal.deliverables.find(d => d.title === delTitle);
                            if (!deliverable) return null;
                            const selectedSubs = deliverable.subDeliverables?.filter(s => s.included) || [];
                            if (selectedSubs.length === 0) return null;

                            return (
                              <div key={delTitle} className="space-y-1">
                                <span className="text-[10px] font-medium text-foreground">{delTitle}</span>
                                <div className="pl-2 space-y-0.5">
                                  {selectedSubs.map((sub, subIdx) => (
                                    <div key={subIdx} className="text-[10px] text-muted-foreground flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                                      {sub.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <span className="text-[10px] text-muted-foreground">Auto-calculate price</span>
                        <Switch
                          checked={pkg.autoCalculate}
                          onCheckedChange={() => togglePackageAutoCalculate(index)}
                          className="scale-75"
                        />
                      </div>

                      <div className="pt-2 border-t border-border/30">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Total hours:</span>
                          <span>{pkg.hoursPerWeek * pkg.durationWeeks} hrs</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                          <span>Duration:</span>
                          <span>{Math.round(pkg.durationWeeks / 4.345 * 10) / 10} months</span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>

          {hasHiddenItems && (
            <>
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Available Items
                </h4>
                <p className="text-[10px] text-muted-foreground mb-3">Click to add back</p>
              </div>

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