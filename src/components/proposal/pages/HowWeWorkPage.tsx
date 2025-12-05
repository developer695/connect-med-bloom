import { motion } from "framer-motion";

const steps = [
  {
    num: 1,
    title: "Discovery & Assessment",
    desc: "We begin with a comprehensive evaluation of your technology, market opportunity, and organizational readiness. This includes clinical validation assessment, regulatory pathway analysis, competitive landscape evaluation, and identification of key commercialization challenges."
  },
  {
    num: 2,
    title: "Strategic Planning",
    desc: "Based on our assessment, we develop a comprehensive commercialization roadmap tailored to your specific needs. This includes regulatory strategy development, clinical evidence generation plans, market access strategies, and timeline optimization."
  },
  {
    num: 3,
    title: "Execution & Implementation",
    desc: "We provide hands-on support throughout the implementation phase, working alongside your team to execute the commercialization strategy. This includes regulatory submissions, clinical trial oversight, and commercial infrastructure development."
  },
  {
    num: 4,
    title: "Market Launch & Scaling",
    desc: "As you approach market entry, we support the commercial launch and early market traction phases. This includes go-to-market execution support, sales strategy implementation, and key opinion leader engagement."
  },
  {
    num: 5,
    title: "Ongoing Partnership",
    desc: "Our relationship extends beyond initial market entry. We provide continued strategic guidance as your organization scales, including expansion planning, portfolio optimization, and access to our growing network."
  }
];

const HowWeWorkPage = () => {
  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">METHODOLOGY</div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">How We Work</h2>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4 md:gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg md:text-xl font-bold">
                  {step.num}
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-heading font-semibold mb-2 md:mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-6 md:p-8 rounded-lg bg-primary-light"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">Our Collaborative Approach</h3>
          <p className="text-muted-foreground leading-relaxed">
            Throughout each phase, we maintain transparent communication, provide regular progress updates, and adapt our approach based on evolving market conditions. We view ourselves as an extension of your team, committed to your long-term success.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HowWeWorkPage;
