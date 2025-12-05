import { motion } from "framer-motion";
import UnifiMedLogo from "../UnifiMedLogo";

const CoverPage = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8 md:p-16 bg-card relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/5" />

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
            STRATEGIC ADVISORY PROPOSAL
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-light mb-6 text-foreground leading-tight">
            Streamlining US Market Entry for MedTech Innovation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A comprehensive partnership framework for accelerating commercialization and value creation
          </p>
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
          <div>December 2025</div>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>UnifiMed Global Advisory</div>
          <div>info@unifimed.com</div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoverPage;
