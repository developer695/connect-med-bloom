import { motion } from "framer-motion";

const markets = [
  {
    title: "Medical Specialties",
    desc: "Medical specialties like oncology, cardiology, neurology, and orthopedics drive some of the most innovative advancements in healthcare. From precision oncology therapies and remote cardiac monitoring devices to neuromodulation systems.",
    tags: ["Oncology", "Cardiology", "Neurology", "Orthopedics"]
  },
  {
    title: "Surgical & Medical Devices",
    desc: "The surgical and medical devices market is advancing rapidly with innovations like robotic-assisted surgery systems, AI-powered surgical planning tools, and next-generation orthopedic implants.",
    tags: ["Robotic Surgery", "AI Surgical Planning", "Orthopedic Implants", "Vascular Tech"]
  },
  {
    title: "Therapeutics & Drug Delivery",
    desc: "Therapeutics and drug delivery systems are revolutionizing treatment by enhancing precision and improving patient outcomes. Examples include nanoparticle-based drug delivery platforms and sustained-release therapies.",
    tags: ["Nanoparticle Delivery", "Sustained Release", "Biologics"]
  },
  {
    title: "Diagnostics & Imaging",
    desc: "Diagnostics and imaging are critical in early disease detection and effective treatment planning. Breakthroughs include AI-driven diagnostic platforms and portable imaging technologies.",
    tags: ["AI Diagnostics", "Point-of-Care", "Portable Imaging", "Advanced Scanners"]
  }
];

const MarketsPage = () => {
  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">FOCUS AREAS</div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">Core Market Segments</h2>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {markets.map((market, index) => (
            <motion.div
              key={market.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-l-4 border-primary pl-4 md:pl-6"
            >
              <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3 text-foreground">{market.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">{market.desc}</p>
              <div className="flex flex-wrap gap-2">
                {market.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs md:text-sm bg-primary text-primary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 p-6 md:p-8 rounded-lg bg-primary-light"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">Cross-Functional Expertise</h3>
          <p className="text-muted-foreground leading-relaxed">
            Our team's diverse experience across these market segments enables us to provide nuanced, sector-specific guidance while leveraging cross-functional insights to optimize your commercialization strategy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketsPage;
