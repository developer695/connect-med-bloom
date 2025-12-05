import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ProposalContent {
  cover: {
    tagline: string;
    title: string;
    subtitle: string;
    date: string;
    company: string;
    email: string;
  };
  letter: {
    date: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  about: {
    sectionLabel: string;
    title: string;
    intro: string;
    expertiseTitle: string;
    expertiseText: string;
    missionTitle: string;
    missionText: string;
    quote: string;
  };
  howWeWork: {
    sectionLabel: string;
    title: string;
    steps: { title: string; description: string }[];
    collaborativeTitle: string;
    collaborativeText: string;
  };
  solutions: {
    sectionLabel: string;
    title: string;
    services: { title: string; description: string }[];
    integratedTitle: string;
    integratedText: string;
  };
  markets: {
    sectionLabel: string;
    title: string;
    segments: { title: string; description: string; tags: string[] }[];
    crossFunctionalTitle: string;
    crossFunctionalText: string;
  };
  clients: {
    sectionLabel: string;
    title: string;
    intro: string;
    clientTypes: { title: string; description: string }[];
    tailoredTitle: string;
    tailoredText: string;
  };
  value: {
    sectionLabel: string;
    title: string;
    pillars: { title: string; description: string }[];
    differentiators: { title: string; description: string }[];
  };
  contact: {
    sectionLabel: string;
    title: string;
    intro: string;
    email: string;
    location: string;
    website: string;
  };
}

const defaultContent: ProposalContent = {
  cover: {
    tagline: "STRATEGIC ADVISORY PROPOSAL",
    title: "Streamlining US Market Entry for MedTech Innovation",
    subtitle: "A comprehensive partnership framework for accelerating commercialization and value creation",
    date: "December 2025",
    company: "UnifiMed Global Advisory",
    email: "info@unifimed.com",
  },
  letter: {
    date: "December 5, 2025",
    salutation: "Dear Partner,",
    paragraphs: [
      "The journey from MedTech innovation to successful US market commercialization represents one of the most complex and high-stakes challenges in healthcare today. While breakthrough technologies hold immense promise for improving patient outcomes, navigating the intricate regulatory pathways, establishing market access, and securing sustainable reimbursement requires specialized expertise and strategic execution.",
      "UnifiMed was founded to bridge this critical gap. As a global advisory firm, we partner with early-stage MedTech founders, executives, and investors to transform innovative solutions into market-ready commercial successes. Our approach integrates clinical validation, regulatory excellence, and strategic commercialization into a unified pathway that de-risks investment and accelerates time to market.",
      "This proposal outlines our comprehensive service framework, developed through years of hands-on experience leading clinical departments, regulatory submissions, and product launches for both startups and Fortune 500 companies. Our team uniquely combines deep clinical expertise, regulatory acumen, and commercial strategy execution to address the full spectrum of challenges inherent in US market entry.",
      "What distinguishes UnifiMed is our scalable ecosystem model. Rather than offering fragmented consulting services, we create integrated partnerships that provide access to capital networks, operational execution capabilities, and strategic guidance throughout the entire commercialization lifecycle.",
      "Our mission extends beyond business success. We are committed to advancing healthcare by ensuring that groundbreaking technologies reach the patients who need them most. Every partnership we undertake is evaluated through the lens of clinical impact, commercial viability, and long-term sustainability.",
      "We welcome the opportunity to discuss how our expertise and resources can support your specific objectives and look forward to the possibility of working together to bring transformative healthcare solutions to market.",
    ],
    closing: "Sincerely,",
    signature: "The UnifiMed Leadership Team",
  },
  about: {
    sectionLabel: "COMPANY OVERVIEW",
    title: "About UnifiMed",
    intro: "UnifiMed is a global advisory firm supporting early-stage MedTech founders and executives on their journey to commercialization in the United States. We provide a comprehensive suite of services, including regulatory guidance, market strategy development, financial support through direct investment and access to capital networks, and operational execution.",
    expertiseTitle: "Our Expertise",
    expertiseText: "Our team brings a unique combination of clinical, regulatory, and commercial expertise, having successfully led clinical departments, regulatory and reimbursement activities, and commercial strategies and product launches for several startup and Fortune 500 companies. Leveraging our extensive knowledge and network, we help MedTech innovators achieve sustainable growth and establish a strong foothold in the U.S. healthcare market.",
    missionTitle: "Our Mission",
    missionText: "Our mission is to bridge the gap between innovation and patient care by empowering MedTech founders with the access, expertise, resources, and strategic partnerships needed to succeed. By pairing groundbreaking technologies with clinical and commercial expertise, we streamline market entry for our clients and companies. We are dedicated to advancing healthcare by ensuring groundbreaking technologies reach the market, improving outcomes, and enhancing the quality of life for patients across the United States.",
    quote: "UnifiMed is a scalable and efficient MedTech ecosystem designed to de-risk innovative companies, accelerate time to market, and deliver measurable outcomes for both companies and investors.",
  },
  howWeWork: {
    sectionLabel: "METHODOLOGY",
    title: "How We Work",
    steps: [
      { title: "Discovery & Assessment", description: "We begin with a comprehensive evaluation of your technology, market opportunity, and organizational readiness. This includes clinical validation assessment, regulatory pathway analysis, competitive landscape evaluation, and identification of key commercialization challenges and opportunities." },
      { title: "Strategic Planning", description: "Based on our assessment, we develop a comprehensive commercialization roadmap tailored to your specific needs. This includes regulatory strategy development, clinical evidence generation plans, market access and reimbursement strategies, capital requirements and funding strategies, and timeline optimization for accelerated market entry." },
      { title: "Execution & Implementation", description: "We provide hands-on support throughout the implementation phase, working alongside your team to execute the commercialization strategy. This includes regulatory submission preparation and management, clinical trial design and oversight, commercial infrastructure development, stakeholder engagement and partnership development, and continuous monitoring and optimization." },
      { title: "Market Launch & Scaling", description: "As you approach market entry, we support the commercial launch and early market traction phases. This includes go-to-market execution support, sales and marketing strategy implementation, key opinion leader engagement, market feedback integration, and performance tracking and optimization." },
      { title: "Ongoing Partnership", description: "Our relationship extends beyond initial market entry. We provide continued strategic guidance as your organization scales, including expansion planning, portfolio optimization, strategic transaction support, and access to our growing network of industry partners and investors." },
    ],
    collaborativeTitle: "Our Collaborative Approach",
    collaborativeText: "Throughout each phase, we maintain transparent communication, provide regular progress updates, and adapt our approach based on evolving market conditions and organizational needs. We view ourselves as an extension of your team, committed to your long-term success.",
  },
  solutions: {
    sectionLabel: "CORE CAPABILITIES",
    title: "Our Solutions",
    services: [
      { title: "Capital & Investment", description: "We provide direct investment opportunities and facilitate access to our extensive network of venture capital and private equity partners. Our capital solutions include seed and early-stage funding, growth capital connections, strategic investment structuring, and investor relations support." },
      { title: "Clinical Expertise", description: "Our clinical team provides comprehensive support for clinical validation and evidence generation. Services include clinical trial design and management, clinical advisory board development, key opinion leader engagement, real-world evidence strategy, and clinical data analysis and publication support." },
      { title: "Talent Acquisition", description: "We help build world-class teams by connecting you with top-tier talent across all functional areas. Our talent services include executive search and placement, advisory board formation, functional team building, organizational design consulting, and ongoing talent development support." },
      { title: "Commercial Development", description: "We develop and execute comprehensive commercialization strategies tailored to your technology and market opportunity. Services include market analysis and segmentation, go-to-market strategy development, sales force design and training, marketing and brand positioning, and partnership and channel development." },
      { title: "Regulatory Submissions", description: "Our regulatory experts navigate complex FDA pathways to accelerate approval timelines. We provide regulatory strategy development, pathway assessment and optimization, submission preparation and management, FDA communication and meeting preparation, and post-market compliance support." },
      { title: "Market Access & Reimbursement", description: "We develop comprehensive strategies to ensure appropriate reimbursement and market access. Services include reimbursement pathway analysis, health economics and outcomes research, payer engagement and contracting, coding and coverage strategy, and value proposition development." },
    ],
    integratedTitle: "Integrated Service Model",
    integratedText: "While each service can be engaged independently, our true value lies in our integrated approach. By coordinating across regulatory, clinical, commercial, and financial dimensions, we create synergies that accelerate timelines, reduce costs, and increase the probability of commercial success.",
  },
  markets: {
    sectionLabel: "FOCUS AREAS",
    title: "Core Market Segments",
    segments: [
      { title: "Medical Specialties", description: "Medical specialties like oncology, cardiology, neurology, and orthopedics drive some of the most innovative advancements in healthcare. From precision oncology therapies and remote cardiac monitoring devices to neuromodulation systems for neurological disorders, these solutions address critical patient needs.", tags: ["Oncology", "Cardiology", "Neurology", "Orthopedics"] },
      { title: "Surgical & Medical Devices", description: "The surgical and medical devices market is advancing rapidly with innovations like robotic-assisted surgery systems, AI-powered surgical planning tools, and next-generation orthopedic implants. These devices improve precision, reduce recovery times, and enhance patient safety.", tags: ["Robotic Surgery", "AI Surgical Planning", "Orthopedic Implants", "Vascular Tech"] },
      { title: "Therapeutics & Drug Delivery", description: "Therapeutics and drug delivery systems are revolutionizing treatment by enhancing precision and improving patient outcomes. Examples include nanoparticle-based drug delivery platforms, sustained-release therapies, and biologic drug delivery devices.", tags: ["Nanoparticle Delivery", "Sustained Release", "Biologics"] },
      { title: "Diagnostics & Imaging", description: "Diagnostics and imaging are critical in early disease detection and effective treatment planning. Breakthroughs include AI-driven diagnostic platforms, point-of-care blood analyzers, and portable imaging technologies like handheld ultrasounds and advanced CT scanners.", tags: ["AI Diagnostics", "Point-of-Care", "Portable Imaging", "Advanced Scanners"] },
    ],
    crossFunctionalTitle: "Cross-Functional Expertise",
    crossFunctionalText: "Our team's diverse experience across these market segments enables us to provide nuanced, sector-specific guidance while leveraging cross-functional insights to optimize your commercialization strategy.",
  },
  clients: {
    sectionLabel: "WHO WE SERVE",
    title: "Our Clients",
    intro: "UnifiMed partners with a diverse range of stakeholders across the MedTech ecosystem, focusing on early-stage founders, executives, and investors who are driving innovation in healthcare.",
    clientTypes: [
      { title: "Healthcare Innovators and Inventors", description: "Clinicians, researchers, and inventors with novel technologies seeking support to transition from concept to market-ready solutions. We offer end-to-end guidance, from regulatory compliance to market positioning." },
      { title: "Global MedTech Companies Entering the US Market", description: "International companies aiming to establish a foothold in the U.S. healthcare market. We provide localized expertise to navigate the complex regulatory environment, build connections with key stakeholders, and design effective market-entry strategies." },
      { title: "Strategic Partners and Collaborators", description: "Organizations and institutions aligned with advancing healthcare innovation, including research institutions, healthcare providers, and industry associations. We work collaboratively to enhance the impact of innovative solutions and improve patient outcomes." },
    ],
    tailoredTitle: "Tailored Partnerships",
    tailoredText: "By tailoring our services to the unique needs of each client, UnifiMed bridges the gap between innovation and commercialization. Whether it's navigating regulatory complexities, securing funding, or executing market entry strategies, we provide the strategic support to ensure long-term success.",
  },
  value: {
    sectionLabel: "WHY UNIFIMED",
    title: "Our Value Proposition",
    pillars: [
      { title: "De-Risk", description: "Our integrated approach systematically addresses the key risk factors in MedTech commercialization, from regulatory uncertainty to market adoption challenges, providing investors and founders with greater confidence and predictability." },
      { title: "Accelerate", description: "By leveraging our extensive network, proven methodologies, and hands-on execution capabilities, we compress timelines and accelerate your path to market, helping you capitalize on market opportunities faster than traditional approaches." },
      { title: "Scale", description: "Our scalable ecosystem model grows with your organization, providing the resources, expertise, and strategic guidance needed at each stage of development, from initial concept through commercial expansion." },
      { title: "Optimize", description: "We continuously refine strategies based on real-world feedback and market dynamics, ensuring your approach remains optimized for maximum commercial impact and return on investment." },
    ],
    differentiators: [
      { title: "Integrated Ecosystem Approach", description: "Unlike fragmented consultancies, we provide end-to-end support across all critical functions" },
      { title: "Deep Clinical & Commercial Expertise", description: "Our team has led successful commercializations for both startups and Fortune 500 companies" },
      { title: "Capital Access & Investment Support", description: "We provide both direct investment and connections to our extensive investor network" },
      { title: "Hands-On Execution", description: "We don't just provide advice—we roll up our sleeves and execute alongside your team" },
      { title: "Proven Track Record", description: "Our portfolio demonstrates consistent success in navigating complex regulatory and commercial challenges" },
    ],
  },
  contact: {
    sectionLabel: "GET IN TOUCH",
    title: "Contact Us",
    intro: "We welcome the opportunity to discuss how UnifiMed can support your commercialization objectives. Whether you're an early-stage founder, an established MedTech company, or an investor seeking to maximize portfolio value, we're here to help.",
    email: "info@unifimed.com",
    location: "United States",
    website: "unifimed.com",
  },
};

interface ProposalContextType {
  content: ProposalContent;
  updateContent: <K extends keyof ProposalContent>(section: K, data: Partial<ProposalContent[K]>) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  resetContent: () => void;
}

const ProposalContentContext = createContext<ProposalContextType | undefined>(undefined);

export const ProposalContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ProposalContent>(() => {
    const saved = localStorage.getItem("proposal-content");
    return saved ? JSON.parse(saved) : defaultContent;
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const updateContent = <K extends keyof ProposalContent>(section: K, data: Partial<ProposalContent[K]>) => {
    setContent((prev) => {
      const newContent = {
        ...prev,
        [section]: { ...prev[section], ...data },
      };
      localStorage.setItem("proposal-content", JSON.stringify(newContent));
      return newContent;
    });
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem("proposal-content");
  };

  return (
    <ProposalContentContext.Provider value={{ content, updateContent, isEditMode, setIsEditMode, resetContent }}>
      {children}
    </ProposalContentContext.Provider>
  );
};

export const useProposalContent = () => {
  const context = useContext(ProposalContentContext);
  if (!context) {
    throw new Error("useProposalContent must be used within ProposalContentProvider");
  }
  return context;
};

export { defaultContent };
