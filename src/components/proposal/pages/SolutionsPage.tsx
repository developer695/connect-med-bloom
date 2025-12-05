import { motion } from "framer-motion";
import { TrendingUp, Heart, Users, Target, FileText, Award } from "lucide-react";

const solutions = [
  {
    icon: TrendingUp,
    title: "Capital & Investment",
    desc: "We provide direct investment opportunities and facilitate access to our extensive network of venture capital and private equity partners. Our capital solutions include seed funding, growth capital, and strategic investment structuring."
  },
  {
    icon: Heart,
    title: "Clinical Expertise",
    desc: "Our clinical team provides comprehensive support for clinical validation and evidence generation. Services include clinical trial design, advisory board development, key opinion leader engagement, and real-world evidence strategy."
  },
  {
    icon: Users,
    title: "Talent Acquisition",
    desc: "We help build world-class teams by connecting you with top-tier talent across all functional areas. Our services include executive search, advisory board formation, and organizational design consulting."
  },
  {
    icon: Target,
    title: "Commercial Development",
    desc: "We develop and execute comprehensive commercialization strategies tailored to your technology. Services include market analysis, go-to-market strategy, sales force design, and partnership development."
  },
  {
    icon: FileText,
    title: "Regulatory Submissions",
    desc: "Our regulatory experts navigate complex FDA pathways to accelerate approval timelines. We provide regulatory strategy, pathway assessment, submission preparation, and post-market compliance support."
  },
  {
    icon: Award,
    title: "Market Access & Reimbursement",
    desc: "We develop comprehensive strategies to ensure appropriate reimbursement. Services include reimbursement pathway analysis, health economics research, payer engagement, and value proposition development."
  }
];

const SolutionsPage = () => {
  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">CORE CAPABILITIES</div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">Our Solutions</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="border border-border rounded-lg p-5 md:p-6 hover:shadow-elevated hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                <solution.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 text-foreground">{solution.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{solution.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 p-6 md:p-8 rounded-lg border-2 border-primary"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">Integrated Service Model</h3>
          <p className="text-muted-foreground leading-relaxed">
            While each service can be engaged independently, our true value lies in our integrated approach. By coordinating across regulatory, clinical, commercial, and financial dimensions, we create synergies that accelerate timelines, reduce costs, and increase the probability of commercial success.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SolutionsPage;
