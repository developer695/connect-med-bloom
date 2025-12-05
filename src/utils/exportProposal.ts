import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

// Word Document Export
export const exportToWord = async () => {
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: "Calibri",
            size: 24,
          },
          paragraph: {
            spacing: { after: 200 },
          },
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: [
          // Cover Page
          new Paragraph({ text: "", spacing: { after: 2000 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "UnifiMed", bold: true, size: 72, font: "Calibri" }),
            ],
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "", spacing: { after: 1000 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "STRATEGIC ADVISORY PROPOSAL", bold: true, size: 24, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Streamlining US Market Entry for MedTech Innovation", size: 56, font: "Calibri Light" }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "A comprehensive partnership framework for accelerating commercialization and value creation", size: 28, color: "666666" }),
            ],
            spacing: { after: 2000 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "CONFIDENTIAL", bold: true, size: 20 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "December 2025", size: 20, color: "666666" }),
            ],
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Letter Page
          new Paragraph({
            text: "December 5, 2025",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Dear Partner,",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "The journey from MedTech innovation to successful US market commercialization represents one of the most complex and high-stakes challenges in healthcare today. While breakthrough technologies hold immense promise for improving patient outcomes, navigating the intricate regulatory pathways, establishing market access, and securing sustainable reimbursement requires specialized expertise and strategic execution.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "UnifiMed was founded to bridge this critical gap. As a global advisory firm, we partner with early-stage MedTech founders, executives, and investors to transform innovative solutions into market-ready commercial successes.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "We welcome the opportunity to discuss how our expertise and resources can support your specific objectives and look forward to the possibility of working together to bring transformative healthcare solutions to market.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Sincerely,",
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "The UnifiMed Leadership Team", bold: true }),
            ],
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // About Page
          new Paragraph({
            children: [
              new TextRun({ text: "COMPANY OVERVIEW", bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: "About UnifiMed",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "UnifiMed is a global advisory firm supporting early-stage MedTech founders and executives on their journey to commercialization in the United States. We provide a comprehensive suite of services, including regulatory guidance, market strategy development, financial support through direct investment and access to capital networks, and operational execution.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Our Expertise",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Our team brings a unique combination of clinical, regulatory, and commercial expertise, having successfully led clinical departments, regulatory and reimbursement activities, and commercial strategies and product launches for several startup and Fortune 500 companies.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Our Mission",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Our mission is to bridge the gap between innovation and patient care by empowering MedTech founders with the access, expertise, resources, and strategic partnerships needed to succeed.",
            spacing: { after: 400 },
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // How We Work
          new Paragraph({
            children: [
              new TextRun({ text: "METHODOLOGY", bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: "How We Work",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "1. Discovery & Assessment", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "We begin with a comprehensive evaluation of your technology, market opportunity, and organizational readiness.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "2. Strategic Planning", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Based on our assessment, we develop a comprehensive commercialization roadmap tailored to your specific needs.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "3. Execution & Implementation", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "We provide hands-on support throughout the implementation phase, working alongside your team.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "4. Market Launch & Scaling", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "As you approach market entry, we support the commercial launch and early market traction phases.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "5. Ongoing Partnership", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Our relationship extends beyond initial market entry with continued strategic guidance.",
            spacing: { after: 400 },
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Solutions
          new Paragraph({
            children: [
              new TextRun({ text: "CORE CAPABILITIES", bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: "Our Solutions",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Capital & Investment", bold: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "We provide direct investment opportunities and facilitate access to our extensive network of venture capital and private equity partners.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Clinical Expertise", bold: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Our clinical team provides comprehensive support for clinical validation and evidence generation.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Regulatory Submissions", bold: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Our regulatory experts navigate complex FDA pathways to accelerate approval timelines.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Commercial Development", bold: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "We develop and execute comprehensive commercialization strategies tailored to your technology.",
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Market Access & Reimbursement", bold: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "We develop comprehensive strategies to ensure appropriate reimbursement and market access.",
            spacing: { after: 400 },
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Contact
          new Paragraph({
            children: [
              new TextRun({ text: "GET IN TOUCH", bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: "Contact Us",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "We welcome the opportunity to discuss how UnifiMed can support your commercialization objectives.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Email: ", bold: true }), new TextRun("info@unifimed.com")],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Location: ", bold: true }), new TextRun("United States")],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Website: ", bold: true }), new TextRun("unifimed.com")],
            spacing: { after: 400 },
          }),
          new Paragraph({
            border: {
              top: { style: BorderStyle.SINGLE, size: 6, color: "0866a4" },
            },
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: "UnifiMed Global Advisory | info@unifimed.com | United States",
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "UnifiMed-Proposal.docx");
};

// PDF Export using html2pdf
export const exportToPDF = async (elementId: string) => {
  const html2pdf = (await import("html2pdf.js")).default;
  
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: 0,
    filename: "UnifiMed-Proposal.pdf",
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: { 
      unit: "in" as const, 
      format: "letter" as const, 
      orientation: "portrait" as const,
    },
    pagebreak: { mode: "avoid-all" as const },
  };

  await html2pdf().set(opt).from(element).save();
};
