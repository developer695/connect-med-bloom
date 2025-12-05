import { motion } from "framer-motion";

const clients = [
  {
    title: "MedTech Startups",
    desc: "Visionary entrepreneurs and early-stage companies seeking to bring groundbreaking medical technologies to market. We provide the expertise needed to navigate regulatory pathways, develop commercialization strategies, and secure funding."
  },
  {
    title: "Established MedTech Companies",
    desc: "Organizations with proven technologies looking to expand their market presence or optimize their US operations. We help refine go-to-market strategies, improve operational efficiency, and achieve sustainable growth."
  },
  {
    title: "Private Equity and Venture Capital Firms",
    desc: "Investors focused on maximizing the value of their MedTech portfolios. We partner to de-risk investments, streamline commercialization efforts, and deliver measurable financial and operational outcomes."
  },
  {
    title: "Healthcare Innovators and Inventors",
    desc: "Clinicians, researchers, and inventors with novel technologies seeking support to transition from concept to market-ready solutions. We offer end-to-end guidance, from regulatory compliance to market positioning."
  },
  {
    title: "Global MedTech Companies Entering the US Market",
    desc: "International companies aiming to establish a foothold in the U.S. healthcare market. We provide localized expertise to navigate the complex regulatory environment and design effective market-entry strategies."
  },
  {
    title: "Strategic Partners and Collaborators",
    desc: "Organizations and institutions aligned with advancing healthcare innovation, including research institutions, healthcare providers, and industry associations."
  }
];

const ClientsPage = () => {
  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">WHO WE SERVE</div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">Our Clients</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-muted-foreground mb-8 md:mb-12 leading-relaxed"
        >
          UnifiMed partners with a diverse range of stakeholders across the MedTech ecosystem, focusing on early-stage founders, executives, and investors who are driving innovation in healthcare.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-5 md:p-6 rounded-lg border-2 border-border hover:border-primary/50 transition-colors"
            >
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 text-foreground">{client.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{client.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 md:mt-12 p-6 md:p-8 rounded-lg bg-primary/15"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">Tailored Partnerships</h3>
          <p className="text-muted-foreground leading-relaxed">
            By tailoring our services to the unique needs of each client, UnifiMed bridges the gap between innovation and commercialization. Whether it's navigating regulatory complexities, securing funding, or executing market entry strategies, we provide the strategic support to ensure long-term success.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientsPage;
