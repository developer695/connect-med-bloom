import { motion } from "framer-motion";
import { Check } from "lucide-react";

const values = [
  {
    word: "De-Risk",
    desc: "Our integrated approach systematically addresses the key risk factors in MedTech commercialization, providing investors and founders with greater confidence and predictability."
  },
  {
    word: "Accelerate",
    desc: "By leveraging our extensive network, proven methodologies, and hands-on execution capabilities, we compress timelines and accelerate your path to market."
  },
  {
    word: "Scale",
    desc: "Our scalable ecosystem model grows with your organization, providing the resources, expertise, and strategic guidance needed at each stage of development."
  },
  {
    word: "Optimize",
    desc: "We continuously refine strategies based on real-world feedback and market dynamics, ensuring your approach remains optimized for maximum commercial impact."
  }
];

const differentiators = [
  { title: "Integrated Ecosystem Approach", desc: "Unlike fragmented consultancies, we provide end-to-end support across all critical functions" },
  { title: "Deep Clinical & Commercial Expertise", desc: "Our team has led successful commercializations for both startups and Fortune 500 companies" },
  { title: "Capital Access & Investment Support", desc: "We provide both direct investment and connections to our extensive investor network" },
  { title: "Hands-On Execution", desc: "We don't just provide advice—we roll up our sleeves and execute alongside your team" },
  { title: "Proven Track Record", desc: "Our portfolio demonstrates consistent success in navigating complex regulatory and commercial challenges" }
];

const ValuePage = () => {
  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">WHY UNIFIMED</div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">Our Value Proposition</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
          {values.map((value, index) => (
            <motion.div
              key={value.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-heading font-light mb-2 md:mb-4 text-primary">{value.word}</div>
              <p className="text-muted-foreground leading-relaxed text-xs md:text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t-2 border-primary pt-6 md:pt-8"
        >
          <h3 className="text-xl md:text-2xl font-heading font-semibold mb-6 text-foreground">Competitive Differentiators</h3>

          <div className="space-y-4">
            {differentiators.map((diff, index) => (
              <motion.div
                key={diff.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
                className="flex items-start gap-3 md:gap-4"
              >
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Check className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1 text-sm md:text-base">{diff.title}</h4>
                  <p className="text-muted-foreground text-xs md:text-sm">{diff.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ValuePage;
