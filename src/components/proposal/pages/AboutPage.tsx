import { motion } from "framer-motion";
import { Globe, Target, TrendingUp } from "lucide-react";

const AboutPage = () => {
  const stats = [
    { icon: Globe, title: "Global Reach", desc: "Supporting international MedTech innovators entering the US market" },
    { icon: Target, title: "Focused Expertise", desc: "Specialized in early-stage MedTech commercialization strategies" },
    { icon: TrendingUp, title: "Proven Results", desc: "Track record with startups and Fortune 500 companies" },
  ];

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">COMPANY OVERVIEW</div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">About UnifiMed</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-6 rounded-lg bg-primary-light"
            >
              <stat.icon className="w-10 h-10 mb-4 text-primary" />
              <div className="text-xl font-heading font-bold mb-2 text-foreground">{stat.title}</div>
              <div className="text-sm text-muted-foreground">{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6 text-muted-foreground"
        >
          <p className="text-lg leading-relaxed">
            UnifiMed is a global advisory firm supporting early-stage MedTech founders and executives on their journey to commercialization in the United States. We provide a comprehensive suite of services, including regulatory guidance, market strategy development, financial support through direct investment and access to capital networks, and operational execution.
          </p>

          <div className="bg-secondary p-8 rounded-lg my-8">
            <h3 className="text-xl md:text-2xl font-heading font-semibold mb-4 text-foreground">Our Expertise</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our team brings a unique combination of clinical, regulatory, and commercial expertise, having successfully led clinical departments, regulatory and reimbursement activities, and commercial strategies and product launches for several startup and Fortune 500 companies.
            </p>
          </div>

          <h3 className="text-xl md:text-2xl font-heading font-semibold mt-8 mb-4 text-foreground">Our Mission</h3>
          <p className="leading-relaxed">
            Our mission is to bridge the gap between innovation and patient care by empowering MedTech founders with the access, expertise, resources, and strategic partnerships needed to succeed.
          </p>

          <div className="border-l-4 border-primary pl-6 my-8">
            <p className="text-lg md:text-xl italic text-foreground leading-relaxed">
              "UnifiMed is a scalable and efficient MedTech ecosystem designed to de-risk innovative companies, accelerate time to market, and deliver measurable outcomes for both companies and investors."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
