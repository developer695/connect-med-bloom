import { motion } from "framer-motion";
import UnifiMedLogo from "../UnifiMedLogo";

const LetterPage = () => {
  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UnifiMedLogo size="sm" className="mb-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-sm text-muted-foreground"
        >
          December 5, 2025
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <div className="text-foreground font-medium">Dear Partner,</div>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              The journey from MedTech innovation to successful US market commercialization represents one of the most complex and high-stakes challenges in healthcare today. While breakthrough technologies hold immense promise for improving patient outcomes, navigating the intricate regulatory pathways, establishing market access, and securing sustainable reimbursement requires specialized expertise and strategic execution.
            </p>

            <p>
              UnifiMed was founded to bridge this critical gap. As a global advisory firm, we partner with early-stage MedTech founders, executives, and investors to transform innovative solutions into market-ready commercial successes. Our approach integrates clinical validation, regulatory excellence, and strategic commercialization into a unified pathway that de-risks investment and accelerates time to market.
            </p>

            <p>
              This proposal outlines our comprehensive service framework, developed through years of hands-on experience leading clinical departments, regulatory submissions, and product launches for both startups and Fortune 500 companies. Our team uniquely combines deep clinical expertise, regulatory acumen, and commercial strategy execution to address the full spectrum of challenges inherent in US market entry.
            </p>

            <p>
              What distinguishes UnifiMed is our scalable ecosystem model. Rather than offering fragmented consulting services, we create integrated partnerships that provide access to capital networks, operational execution capabilities, and strategic guidance throughout the entire commercialization lifecycle.
            </p>

            <p>
              Our mission extends beyond business success. We are committed to advancing healthcare by ensuring that groundbreaking technologies reach the patients who need them most. Every partnership we undertake is evaluated through the lens of clinical impact, commercial viability, and long-term sustainability.
            </p>

            <p>
              We welcome the opportunity to discuss how our expertise and resources can support your specific objectives and look forward to the possibility of working together to bring transformative healthcare solutions to market.
            </p>
          </div>

          <div className="mt-12">
            <div className="text-foreground font-semibold">Sincerely,</div>
            <div className="mt-8 text-foreground font-semibold">The UnifiMed Leadership Team</div>
          </div>

          <div className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground">
            UnifiMed Global Advisory | info@unifimed.com | United States
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LetterPage;
