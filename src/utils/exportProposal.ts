import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import type { ProposalContent } from "@/contexts/ProposalContentContext";

// Word Document Export
export const exportToWord = async (content: ProposalContent) => {
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
              new TextRun({ text: content.cover.tagline, bold: true, size: 24, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: content.cover.title, size: 56, font: "Calibri Light" }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: content.cover.subtitle, size: 28, color: "666666" }),
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
              new TextRun({ text: content.cover.date, size: 20, color: "666666" }),
            ],
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Letter Page
          new Paragraph({
            text: content.letter.date,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.letter.salutation,
            spacing: { after: 400 },
          }),
          ...content.letter.paragraphs.map((p) => new Paragraph({
            text: p,
            spacing: { after: 200 },
          })),
          new Paragraph({
            text: content.letter.closing,
            spacing: { after: 200, before: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: content.letter.signature, bold: true }),
            ],
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // About Page
          new Paragraph({
            children: [
              new TextRun({ text: content.about.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.about.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.about.intro,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.about.expertiseTitle,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: content.about.expertiseText,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.about.missionTitle,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: content.about.missionText,
            spacing: { after: 400 },
          }),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // How We Work
          new Paragraph({
            children: [
              new TextRun({ text: content.howWeWork.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.howWeWork.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          ...content.howWeWork.steps.flatMap((step, i) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${i + 1}. ${step.title}`, bold: true }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: step.description,
              spacing: { after: 300 },
            }),
          ]),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Solutions
          new Paragraph({
            children: [
              new TextRun({ text: content.solutions.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.solutions.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          ...content.solutions.services.flatMap((service) => [
            new Paragraph({
              children: [new TextRun({ text: service.title, bold: true })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: service.description,
              spacing: { after: 300 },
            }),
          ]),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Markets
          new Paragraph({
            children: [
              new TextRun({ text: content.markets.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.markets.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          ...content.markets.segments.flatMap((segment) => [
            new Paragraph({
              children: [new TextRun({ text: segment.title, bold: true })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: segment.description,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `Focus areas: ${segment.tags.join(", ")}`,
              spacing: { after: 300 },
            }),
          ]),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Clients
          new Paragraph({
            children: [
              new TextRun({ text: content.clients.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.clients.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.clients.intro,
            spacing: { after: 400 },
          }),
          ...content.clients.clientTypes.flatMap((client) => [
            new Paragraph({
              children: [new TextRun({ text: client.title, bold: true })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: client.description,
              spacing: { after: 300 },
            }),
          ]),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Value
          new Paragraph({
            children: [
              new TextRun({ text: content.value.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.value.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          ...content.value.pillars.flatMap((pillar) => [
            new Paragraph({
              children: [new TextRun({ text: pillar.title, bold: true, size: 32 })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: pillar.description,
              spacing: { after: 300 },
            }),
          ]),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Contact
          new Paragraph({
            children: [
              new TextRun({ text: content.contact.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.contact.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.contact.intro,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Email: ", bold: true }), new TextRun(content.contact.email)],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Location: ", bold: true }), new TextRun(content.contact.location)],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Website: ", bold: true }), new TextRun(content.contact.website)],
            spacing: { after: 400 },
          }),
          new Paragraph({
            border: {
              top: { style: BorderStyle.SINGLE, size: 6, color: "0866a4" },
            },
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: `UnifiMed Global Advisory | ${content.contact.email} | ${content.contact.location}`,
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

// PDF Export - exports all pages
export const exportToPDF = async (totalPages: number, goToPage: (index: number) => void) => {
  const html2pdf = (await import("html2pdf.js")).default;
  
  // Create a container to hold all pages
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  // Clone each page
  for (let i = 0; i < totalPages; i++) {
    goToPage(i);
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const pageContent = document.getElementById("proposal-content");
    if (pageContent) {
      const clone = pageContent.cloneNode(true) as HTMLElement;
      clone.style.pageBreakAfter = i < totalPages - 1 ? "always" : "auto";
      clone.style.width = "8.5in";
      clone.style.minHeight = "11in";
      clone.style.padding = "0.5in";
      clone.style.boxSizing = "border-box";
      clone.style.background = "white";
      container.appendChild(clone);
    }
  }

  const opt = {
    margin: 0,
    filename: "UnifiMed-Proposal.pdf",
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: { 
      unit: "in" as const, 
      format: "letter" as const, 
      orientation: "portrait" as const,
    },
    pagebreak: { mode: ["css", "legacy"] as const },
  };

  await html2pdf().set(opt).from(container).save();
  
  // Cleanup
  document.body.removeChild(container);
  goToPage(0);
};
