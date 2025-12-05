import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import type { ProposalContent } from "@/contexts/ProposalContentContext";

// Generate static HTML for PDF export
const generateStaticHTML = (content: ProposalContent): string => {
  const primaryColor = "#0866a4";
  
  const styles = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; }
      .page { width: 8.5in; min-height: 11in; padding: 0.75in; background: white; page-break-after: always; }
      .page:last-child { page-break-after: auto; }
      h1 { font-size: 32px; font-weight: 300; margin-bottom: 24px; line-height: 1.2; }
      h2 { font-size: 20px; font-weight: 600; margin-bottom: 12px; color: ${primaryColor}; }
      h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
      p { font-size: 12px; line-height: 1.6; margin-bottom: 12px; color: #4a4a4a; }
      .section-label { font-size: 12px; font-weight: 600; color: ${primaryColor}; letter-spacing: 1px; margin-bottom: 8px; }
      .logo { font-size: 28px; font-weight: 700; color: ${primaryColor}; margin-bottom: 32px; }
      .cover-title { font-size: 40px; font-weight: 300; margin-bottom: 16px; color: #1a1a1a; }
      .cover-subtitle { font-size: 16px; color: #666; margin-bottom: 32px; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
      .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
      .card { background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
      .card-title { font-weight: 600; margin-bottom: 8px; color: ${primaryColor}; }
      .step-number { display: inline-block; width: 24px; height: 24px; background: ${primaryColor}; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 8px; }
      .tag { display: inline-block; background: ${primaryColor}15; color: ${primaryColor}; padding: 4px 8px; border-radius: 4px; font-size: 10px; margin-right: 4px; margin-bottom: 4px; }
      .pillar { text-align: center; padding: 16px; }
      .pillar-title { font-size: 24px; font-weight: 600; color: ${primaryColor}; margin-bottom: 8px; }
      .footer { border-top: 2px solid ${primaryColor}; padding-top: 16px; margin-top: 32px; font-size: 10px; color: #666; text-align: center; }
      .letter-para { margin-bottom: 16px; text-align: justify; }
      .meta { font-size: 11px; color: #666; }
    </style>
  `;

  const coverPage = `
    <div class="page">
      <div class="logo">UnifiMed</div>
      <div style="height: 120px;"></div>
      <div class="section-label">${content.cover.tagline}</div>
      <div class="cover-title">${content.cover.title}</div>
      <div class="cover-subtitle">${content.cover.subtitle}</div>
      <div style="height: 200px;"></div>
      <div style="display: flex; justify-content: space-between;">
        <div class="meta">
          <div style="font-weight: 600;">CONFIDENTIAL</div>
          <div>${content.cover.date}</div>
        </div>
        <div class="meta" style="text-align: right;">
          <div>${content.cover.company}</div>
          <div>${content.cover.email}</div>
        </div>
      </div>
    </div>
  `;

  const letterPage = `
    <div class="page">
      <div class="logo">UnifiMed</div>
      <p class="meta" style="margin-bottom: 24px;">${content.letter.date}</p>
      <p style="margin-bottom: 24px;">${content.letter.salutation}</p>
      ${content.letter.paragraphs.map(p => `<p class="letter-para">${p}</p>`).join('')}
      <p style="margin-top: 32px;">${content.letter.closing}</p>
      <p style="font-weight: 600;">${content.letter.signature}</p>
    </div>
  `;

  const aboutPage = `
    <div class="page">
      <div class="section-label">${content.about.sectionLabel}</div>
      <h1>${content.about.title}</h1>
      <p>${content.about.intro}</p>
      <div class="grid-2" style="margin-top: 24px;">
        <div>
          <h2>${content.about.expertiseTitle}</h2>
          <p>${content.about.expertiseText}</p>
        </div>
        <div>
          <h2>${content.about.missionTitle}</h2>
          <p>${content.about.missionText}</p>
        </div>
      </div>
      <div class="card" style="margin-top: 24px; background: ${primaryColor}10; border-left: 4px solid ${primaryColor};">
        <p style="font-style: italic; color: #333;">"${content.about.quote}"</p>
      </div>
    </div>
  `;

  const howWeWorkPage = `
    <div class="page">
      <div class="section-label">${content.howWeWork.sectionLabel}</div>
      <h1>${content.howWeWork.title}</h1>
      ${content.howWeWork.steps.map((step, i) => `
        <div class="card">
          <h3><span class="step-number">${i + 1}</span>${step.title}</h3>
          <p>${step.description}</p>
        </div>
      `).join('')}
      <div style="margin-top: 24px;">
        <h2>${content.howWeWork.collaborativeTitle}</h2>
        <p>${content.howWeWork.collaborativeText}</p>
      </div>
    </div>
  `;

  const solutionsPage = `
    <div class="page">
      <div class="section-label">${content.solutions.sectionLabel}</div>
      <h1>${content.solutions.title}</h1>
      <div class="grid-2">
        ${content.solutions.services.map(service => `
          <div class="card">
            <div class="card-title">${service.title}</div>
            <p style="font-size: 11px;">${service.description}</p>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top: 24px; border: 2px solid ${primaryColor};">
        <h2 style="color: #1a1a1a;">${content.solutions.integratedTitle}</h2>
        <p>${content.solutions.integratedText}</p>
      </div>
    </div>
  `;

  const marketsPage = `
    <div class="page">
      <div class="section-label">${content.markets.sectionLabel}</div>
      <h1>${content.markets.title}</h1>
      <div class="grid-2">
        ${content.markets.segments.map(segment => `
          <div class="card">
            <div class="card-title">${segment.title}</div>
            <p style="font-size: 11px;">${segment.description}</p>
            <div style="margin-top: 8px;">
              ${segment.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top: 24px; background: ${primaryColor}10;">
        <h2 style="color: #1a1a1a;">${content.markets.crossFunctionalTitle}</h2>
        <p>${content.markets.crossFunctionalText}</p>
      </div>
    </div>
  `;

  const clientsPage = `
    <div class="page">
      <div class="section-label">${content.clients.sectionLabel}</div>
      <h1>${content.clients.title}</h1>
      <p>${content.clients.intro}</p>
      <div style="margin-top: 24px;">
        ${content.clients.clientTypes.map(client => `
          <div class="card">
            <div class="card-title">${client.title}</div>
            <p style="font-size: 11px;">${client.description}</p>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top: 24px; background: ${primaryColor}15;">
        <h2 style="color: #1a1a1a;">${content.clients.tailoredTitle}</h2>
        <p>${content.clients.tailoredText}</p>
      </div>
    </div>
  `;

  const valuePage = `
    <div class="page">
      <div class="section-label">${content.value.sectionLabel}</div>
      <h1>${content.value.title}</h1>
      <div class="grid-2" style="margin-bottom: 24px;">
        ${content.value.pillars.map(pillar => `
          <div class="pillar">
            <div class="pillar-title">${pillar.title}</div>
            <p style="font-size: 11px;">${pillar.description}</p>
          </div>
        `).join('')}
      </div>
      <h2 style="margin-top: 24px;">What Sets Us Apart</h2>
      ${content.value.differentiators.map(diff => `
        <div class="card">
          <div class="card-title">${diff.title}</div>
          <p style="font-size: 11px;">${diff.description}</p>
        </div>
      `).join('')}
    </div>
  `;

  const contactPage = `
    <div class="page">
      <div class="section-label">${content.contact.sectionLabel}</div>
      <h1>${content.contact.title}</h1>
      <p style="max-width: 500px;">${content.contact.intro}</p>
      <div style="margin-top: 32px;">
        <p><strong>Email:</strong> ${content.contact.email}</p>
        <p><strong>Location:</strong> ${content.contact.location}</p>
        <p><strong>Website:</strong> ${content.contact.website}</p>
      </div>
      <div class="footer">
        UnifiMed Global Advisory | ${content.contact.email} | ${content.contact.location}
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>${styles}</head>
    <body>
      ${coverPage}
      ${letterPage}
      ${aboutPage}
      ${howWeWorkPage}
      ${solutionsPage}
      ${marketsPage}
      ${clientsPage}
      ${valuePage}
      ${contactPage}
    </body>
    </html>
  `;
};

// PDF Export - generates all pages from content data
export const exportToPDF = async (content: ProposalContent) => {
  const html2pdf = (await import("html2pdf.js")).default;
  
  const htmlContent = generateStaticHTML(content);
  
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

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
    pagebreak: { mode: ["css"] as ("css")[] },
  };

  await html2pdf().set(opt).from(container).save();
  
  document.body.removeChild(container);
};

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
