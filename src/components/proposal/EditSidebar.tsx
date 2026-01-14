import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, ChevronRight, Users, Trash2, Camera, Save, FilePlus, Archive, UserPlus } from "lucide-react";
import { useProposalContent } from "@/contexts/ProposalContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/integrations/supabase/imageUploadData";
import { inviteTeamMember } from "@/integrations/supabase/invite-team-member";

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

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormData, setSaveFormData] = useState({ author: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    role: 'team_member' as 'team_member' | 'admin',
    bio: '',
    image: ''
  });
  const [isInviting, setIsInviting] = useState(false);
  const partnerFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const newPartnerFileInputRef = useRef<HTMLInputElement | null>(null);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ Check admin role


  // Load proposal
  const loadSingleProposal = async () => {
    setIsLoading(true);
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
      }
    } catch (error) {
      console.error('❌ Error loading proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSingleProposal();
  }, []);

  const handleSaveProposal = async () => {
    if (!saveFormData.author.trim()) {
      toast.error('Please enter author name');
      return;
    }

    setIsSaving(true);
    try {
      const currentContent = getContent();

      const { data: existing, error: checkError } = await supabase
        .from("site_content")
        .select("*")
        .eq("content_type", "proposal")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking existing proposal:', checkError);
        toast.error(`Error: ${checkError.message}`);
        return;
      }

      if (existing) {
        const newVersion = existing.version + 1;

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

        if (updateError) {
          console.error('❌ Failed to update:', updateError);
          toast.error(`Failed to update: ${updateError.message}`);
          return;
        }

        if (!updateResult || updateResult.length === 0) {
          console.error('⚠️ Update returned no data - RLS may be blocking');
          toast.error('Warning: Update may have failed due to permissions.');
          return;
        }

        setCurrentProposalUuid(existing.id);
        setCurrentProposalVersion(newVersion);
        toast.success(`Proposal updated successfully! (Version ${newVersion})`);

      } else {
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
          toast.error(`Failed to save: ${insertError.message}`);
          return;
        }

        if (insertData) {
          setCurrentProposalUuid(insertData.id);
          setCurrentProposalVersion(insertData.version);
          toast.success('Proposal saved successfully!');
        }
      }

      setShowSaveDialog(false);
    } catch (error) {
      console.error('❌ Error saving proposal:', error);
      toast.error('Error saving proposal: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewProposal = () => {
    if (confirm('Reset proposal content? This will clear all data.')) {
      resetContent();
      setSaveFormData({ author: '' });
    }
  };

  const handlePartnerImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFileToSupabase(file, 'partners');
    if (!url) return;

    const newMembers = [...(content.team.members || [])];
    newMembers[index] = { ...newMembers[index], image: url };
    updateContent("team", { members: newMembers });
  };

  const handleNewPartnerImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFileToSupabase(file, 'partners');
    if (!url) return;

    setNewPartner(prev => ({ ...prev, image: url }));
  };
  console.log("newPartner dataa", newPartner);
  const getAdminRole = async () => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log("⚠️ No authenticated user");
        setIsAdmin(false);
        setCurrentUserId(null);
        return;
      }

      setCurrentUserId(user.id);
      console.log("✅ Current user ID:", user.id);

      // ✅ Query the correct table name (Users or profiles)
      const { data, error } = await supabase
        .from("Users")
        .select("role")
        .eq("user_id", user.id)

      if (error) {
        console.error("❌ Error fetching role:", error);
        setIsAdmin(false);
        return;
      }
      console.log("✅ Current user role:", data);
      setIsAdmin(data[0]?.role === "admin");

    } catch (error) {
      console.error("❌ Error loading admin role:", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAdminRole();
  }, []);
  console.log("is admin", isAdmin);

  // Updated handleInvitePartner function
  // Replace your existing function with this one

  const handleInvitePartner = async () => {
    // Validate form fields
    if (!newPartner.name.trim() || !newPartner.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!newPartner.role) {
      toast.error("Please select a role");
      return;
    }

    console.log('is admin ', isAdmin);

    // Check if current user is admin
    if (!isAdmin) {
      toast.error("Only admins can invite team members");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPartner.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsInviting(true);

    try {
      // ✅ Include bio and image in payload
      const payload = {
        email: newPartner.email.trim().toLowerCase(),
        role: newPartner.role,
        name: newPartner.name.trim(),
        bio: newPartner.bio?.trim() || undefined,    // Include bio
        image: newPartner.image || undefined,         // Include image URL
      };

      console.log("🔍 INVITE PAYLOAD:", payload);

      const result = await inviteTeamMember(payload);

      console.log("✅ Invitation result:", result);

      // Add to local team members list (for UI)
      const newMembers = [
        ...(content.team.members || []),
        {
          name: newPartner.name,
          email: newPartner.email,
          role: newPartner.role,
          bio: newPartner.bio,
          image: newPartner.image,
        },
      ];

      updateContent("team", { members: newMembers });

      toast.success(`🎉 Invitation sent to ${newPartner.email}!`);

      // Reset form
      setNewPartner({
        name: "",
        email: "",
        role: "team_member",
        bio: "",
        image: "",
      });

      setShowAddPartner(false);

    } catch (error: any) {
      console.error("❌ Invite error:", error);

      // Specific error messages
      if (error.message.includes("already exists") || error.message.includes("already registered")) {
        toast.error("This email is already registered");
      } else if (error.message.includes("already sent")) {
        toast.error("Invitation already sent to this email");
      } else if (error.message.includes("Invalid email")) {
        toast.error("Please provide a valid email address");
      } else {
        toast.error(error.message || "Failed to send invitation");
      }
    } finally {
      setIsInviting(false);
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
    toast.success(`${partner.name} added to project team`);
  };

  const handleRemovePartner = async (index: number) => {
    const member = content.team.members?.[index];
    if (!member) return;

    // If member is team lead, only admins can remove
    if (member.role === 'team_lead' && !isAdmin) {
      toast.error('Only admins can remove the team lead');
      return;
    }

    // Try SweetAlert2 for confirmation, fall back to window.confirm
    let confirmed = false;
    try {
      const Swal = (await import('sweetalert2')).default;
      const result = await Swal.fire({
        title: `Remove ${member.name}?`,
        text: 'This cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel'
      });
      confirmed = !!result.isConfirmed;
    } catch (e) {
      // sweetalert2 not available, fallback
      confirmed = confirm(`Remove ${member.name} from partners? This cannot be undone.`);
    }

    if (!confirmed) return;

    const newMembers = (content.team.members || []).filter((_, i) => i !== index);
    updateContent('team', { members: newMembers });
    toast.success(`${member.name} removed`);
    setExpandedPartner(null);
  };

  if (!isEditMode) return null;

  const { proposal, value, team } = content;

  return (
    <div className="w-72 bg-muted/50 border-l border-border flex flex-col h-full">
      <div className="p-3 border-b border-border bg-background">
        <h3 className="font-semibold text-sm text-foreground">Proposal Settings</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {currentProposalUuid
            ? `Editing • Version ${currentProposalVersion}${isAdmin ? ' • Admin' : ' Team Member'}`
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
                    <div className="p-2 border-t border-border/30 bg-background space-y-2">
                      <div className="text-[10px] text-muted-foreground">Role</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{partner.role === 'team_lead' ? 'Team Lead' : partner.role}</span>
                        {partner.role === 'team_lead' && (
                          <span className="text-[10px] text-muted-foreground ml-2">(Protected — admin can remove)</span>
                        )}
                      </div>

                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Bio</div>
                        <div className="text-xs text-foreground">{partner.bio || 'No bio provided'}</div>
                      </div>

                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => (partnerFileInputRefs.current[index] = el)}
                          onChange={(e) => handlePartnerImageUpload(index, e)}
                          className="hidden"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => partnerFileInputRefs.current[index]?.click()}
                            className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors flex items-center justify-center gap-1"
                          >
                            <Camera className="w-3 h-3" />
                            Upload Photo
                          </button>

                          <button
                            type="button"
                            onClick={() => addPartnerToProjectTeam(partner)}
                            className="flex-1 h-7 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" />
                            Add to Project
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/30 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedPartner(null)}
                          className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors"
                        >
                          Close
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemovePartner(index)}
                          className="flex-1 h-7 text-[10px] text-destructive border border-destructive/30 rounded hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}


              <div>
                {showAddPartner ? (
                  <div className="p-3 rounded-md bg-background border border-primary/30 space-y-2">
                    <Input
                      value={newPartner.name}
                      onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name..."
                      className="h-7 text-xs"
                      disabled={isInviting}
                    />

                    <Input
                      type="email"
                      value={newPartner.email}
                      onChange={(e) => setNewPartner(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address..."
                      className="h-7 text-xs"
                      disabled={isInviting}
                    />

                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">
                        Account Role
                      </Label>
                      <Select
                        value={newPartner.role}
                        onValueChange={(val: 'team_member' | 'admin') =>
                          setNewPartner(prev => ({ ...prev, role: val }))
                        }
                        disabled={isInviting}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Select role..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="team_member">Team Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Textarea
                      value={newPartner.bio}
                      onChange={(e) => setNewPartner(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Brief bio (optional)..."
                      className="text-xs min-h-[40px]"
                      disabled={isInviting}
                    />

                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">
                        Photo (Optional)
                      </Label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={newPartnerFileInputRef}
                        onChange={handleNewPartnerImageUpload}
                        className="hidden"
                        disabled={isInviting}
                      />
                      <button
                        type="button"
                        onClick={() => newPartnerFileInputRef.current?.click()}
                        disabled={isInviting}
                        className="w-full h-12 rounded-md border border-dashed border-border/50 flex items-center justify-center gap-2 hover:bg-muted/30 transition-colors overflow-hidden disabled:opacity-50"
                      >
                        {newPartner.image ? (
                          <img
                            src={newPartner.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <Camera className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">
                              Upload photo
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleInvitePartner}
                        disabled={isInviting}
                        className="flex-1 h-7 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {isInviting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            Invite User
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewPartner({ name: '', email: '', role: 'team_member', bio: '', image: '' });
                          setShowAddPartner(false);
                        }}
                        disabled={isInviting}
                        className="flex-1 h-7 text-[10px] border border-border rounded hover:bg-muted/50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAdmin) {
                        toast.error("Only admins can invite team members");
                        return;
                      }
                      setShowAddPartner(true);
                    }}
                    disabled={!isAdmin}
                    className="w-full p-2 rounded-md border border-dashed border-border/50 text-[10px] text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                    {isAdmin ? 'Add Partner' : 'Admin Only'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditSidebar;

{/* Key Deliverables Section */ }
{/* <div>
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
          </div> */}

{/* Engagement Packages Section */ }
{/* <div>
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
          </div> */}
