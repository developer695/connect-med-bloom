import { motion } from "framer-motion";
import { useRef } from "react";
import { Camera } from "lucide-react";
import EditableText from "../EditableText";
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
              <div className="relative w-16 h-16 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  onChange={(e) => handleImageUpload(index, e)}
                  className="hidden"
                />
                {member.image ? (
                  <div 
                    className={`w-16 h-16 rounded-full overflow-hidden ${isEditMode ? 'cursor-pointer group' : ''}`}
                    onClick={() => isEditMode && fileInputRefs.current[index]?.click()}
                  >
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ${isEditMode ? 'cursor-pointer group hover:bg-primary/20 transition-colors' : ''}`}
                    onClick={() => isEditMode && fileInputRefs.current[index]?.click()}
                  >
                    {isEditMode ? (
                      <Camera className="w-6 h-6 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <span className="text-2xl font-semibold text-primary">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>
                )}
              </div>
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
