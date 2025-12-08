import { motion } from "framer-motion";
import UnifiMedLogo from "../UnifiMedLogo";
import EditableText from "../EditableText";
import EditableShape from "../EditableShape";
import EditableImage from "../EditableImage";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const CoverPage = () => {
  const { content, updateContent } = useProposalContent();
  const { cover } = content;

  return (
    <div className="h-full flex flex-col justify-between p-8 md:p-16 bg-card relative overflow-hidden">
      {/* Decorative circle - positioned as half circle on left edge */}
      <EditableShape
        id="cover-circle-1"
        defaultConfig={{ x: -280, y: 100, width: 400, height: 400 }}
        className="rounded-full bg-primary/10"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <UnifiMedLogo size="lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex-1 flex flex-col justify-center"
      >
        <div className="max-w-3xl">
          <div className="text-sm font-semibold mb-3 text-primary tracking-wide">
            <EditableText
              value={cover.tagline}
              onSave={(val) => updateContent("cover", { tagline: val })}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-light mb-6 text-foreground leading-tight">
            <EditableText
              value={cover.title}
              onSave={(val) => updateContent("cover", { title: val })}
              multiline
            />
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            <EditableText
              value={cover.subtitle}
              onSave={(val) => updateContent("cover", { subtitle: val })}
              multiline
            />
          </p>
          
          {/* Client Logo Upload */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <EditableImage
              id="client-logo"
              image={cover.clientLogo}
              onImageChange={(base64) => updateContent("cover", { clientLogo: base64 })}
              defaultConfig={{ x: 0, y: 0, width: 180, height: 80 }}
              placeholder="Upload Client Logo"
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div className="text-sm text-muted-foreground">
          <div className="font-semibold">CONFIDENTIAL</div>
          <div>
            <EditableText
              value={cover.date}
              onSave={(val) => updateContent("cover", { date: val })}
            />
          </div>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>
            <EditableText
              value={cover.company}
              onSave={(val) => updateContent("cover", { company: val })}
            />
          </div>
          <div>
            <EditableText
              value={cover.email}
              onSave={(val) => updateContent("cover", { email: val })}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoverPage;
