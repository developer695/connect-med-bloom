import { motion } from "framer-motion";
import { useRef } from "react";
import EditableText from "../EditableText";
import TeamMemberAvatar from "../TeamMemberAvatar";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const TeamPage = () => {
  const { content, updateContent, isEditMode } = useProposalContent();
  const { team } = content;
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateMember = (index: number, field: "name" | "role" | "bio" | "image", value: string) => {
    const newMembers = [...team.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    updateContent("team", { members: newMembers });
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMember(index, "image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">
            <EditableText
              value={team.sectionLabel}
              onSave={(val) => updateContent("team", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={team.title}
              onSave={(val) => updateContent("team", { title: val })}
            />
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground leading-relaxed mb-10 max-w-3xl"
        >
          <EditableText
            value={team.intro}
            onSave={(val) => updateContent("team", { intro: val })}
            multiline
          />
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-muted/30 rounded-lg p-6 border border-border/50"
            >
              <TeamMemberAvatar
                member={member}
                index={index}
                isEditMode={isEditMode}
                fileInputRef={(el) => (fileInputRefs.current[index] = el)}
                onImageUpload={(e) => handleImageUpload(index, e)}
                onAvatarClick={() => isEditMode && fileInputRefs.current[index]?.click()}
              />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                <EditableText
                  value={member.name}
                  onSave={(val) => updateMember(index, "name", val)}
                />
              </h3>
              <p className="text-sm text-primary font-medium mb-3">
                <EditableText
                  value={member.role}
                  onSave={(val) => updateMember(index, "role", val)}
                />
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <EditableText
                  value={member.bio}
                  onSave={(val) => updateMember(index, "bio", val)}
                  multiline
                />
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-6 md:p-8 rounded-lg bg-primary-light"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">
            <EditableText
              value={team.collectiveTitle}
              onSave={(val) => updateContent("team", { collectiveTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              value={team.collectiveText}
              onSave={(val) => updateContent("team", { collectiveText: val })}
              multiline
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;
