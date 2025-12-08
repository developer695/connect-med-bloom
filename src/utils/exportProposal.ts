import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import pptxgen from "pptxgenjs";
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

  const teamPage = `
    <div class="page">
      <div class="section-label">${content.team.sectionLabel}</div>
      <h1>${content.team.title}</h1>
      <p>${content.team.intro}</p>
      <div class="grid-2" style="margin-top: 24px;">
        ${content.team.members.map(member => `
          <div class="card">
            <div class="card-title">${member.name}</div>
            <p style="font-size: 11px; color: ${primaryColor}; margin-bottom: 8px;">${member.role}</p>
            <p style="font-size: 10px;">${member.bio}</p>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top: 24px; background: ${primaryColor}10;">
        <h2 style="color: #1a1a1a;">${content.team.collectiveTitle}</h2>
        <p>${content.team.collectiveText}</p>
      </div>
    </div>
  `;

  const proposalPage = `
    <div class="page">
      <div class="section-label">${content.proposal.sectionLabel}</div>
      <h1>${content.proposal.title}</h1>
      <h2>${content.proposal.scopeTitle}</h2>
      <p>${content.proposal.scopeText}</p>
      <h2 style="margin-top: 24px;">${content.proposal.deliverablesTitle}</h2>
      <div class="grid-2">
        ${content.proposal.deliverables.map(d => `
          <div class="card">
            <div class="card-title">${d.title}</div>
            <p style="font-size: 10px;">${d.description}</p>
          </div>
        `).join('')}
      </div>
      <h2 style="margin-top: 24px;">${content.proposal.packagesTitle}</h2>
      <div class="grid-3">
        ${content.proposal.packages.map((pkg, i) => `
          <div class="card" style="${i === 1 ? `border: 2px solid ${primaryColor};` : ''}">
            <div class="card-title">${pkg.name}</div>
            <p style="font-size: 10px; margin-bottom: 8px;">${pkg.description}</p>
            <p style="font-size: 18px; font-weight: bold; color: ${primaryColor};">${pkg.price}</p>
            <p style="font-size: 9px; color: #666; margin-bottom: 8px;">${pkg.duration}</p>
            <ul style="font-size: 9px; list-style: none; padding: 0;">
              ${pkg.features.map(f => `<li style="margin-bottom: 4px;">✓ ${f}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top: 24px; background: ${primaryColor}10;">
        <h2 style="color: #1a1a1a;">${content.proposal.termsTitle}</h2>
        <p style="font-size: 10px;">${content.proposal.termsText}</p>
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
      ${teamPage}
      ${proposalPage}
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

          // Team
          new Paragraph({
            children: [
              new TextRun({ text: content.team.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.team.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.team.intro,
            spacing: { after: 400 },
          }),
          ...content.team.members.flatMap((member) => [
            new Paragraph({
              children: [new TextRun({ text: member.name, bold: true })],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [new TextRun({ text: member.role, color: "0866a4", italics: true })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: member.bio,
              spacing: { after: 300 },
            }),
          ]),
          new Paragraph({ text: "", pageBreakBefore: true }),

          // Proposal
          new Paragraph({
            children: [
              new TextRun({ text: content.proposal.sectionLabel, bold: true, size: 20, color: "0866a4" }),
            ],
          }),
          new Paragraph({
            text: content.proposal.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.proposal.scopeTitle,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: content.proposal.scopeText,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: content.proposal.deliverablesTitle,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          ...content.proposal.deliverables.flatMap((d) => [
            new Paragraph({
              children: [new TextRun({ text: d.title, bold: true })],
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: d.description,
              spacing: { after: 200 },
            }),
          ]),
          new Paragraph({
            text: content.proposal.packagesTitle,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200, before: 200 },
          }),
          ...content.proposal.packages.flatMap((pkg) => [
            new Paragraph({
              children: [new TextRun({ text: `${pkg.name} - ${pkg.price}`, bold: true, size: 28 })],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `${pkg.description} (${pkg.duration})`, italics: true })],
              spacing: { after: 100 },
            }),
            ...pkg.features.map((f) => new Paragraph({
              text: `• ${f}`,
              spacing: { after: 50 },
            })),
            new Paragraph({ text: "", spacing: { after: 200 } }),
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

// PowerPoint Export for Canva
export const exportToPowerPoint = async (content: ProposalContent) => {
  const pptx = new pptxgen();
  const primaryColor = "0866a4";
  const lightBg = "F8F9FA";
  
  pptx.author = "UnifiMed";
  pptx.title = "UnifiMed Proposal";
  pptx.subject = content.cover.title;
  
  // Slide 1: Cover
  const slide1 = pptx.addSlide();
  slide1.addText("UnifiMed", { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 36, bold: true, color: primaryColor });
  slide1.addText(content.cover.tagline, { x: 0.5, y: 2, w: 9, h: 0.4, fontSize: 14, bold: true, color: primaryColor });
  slide1.addText(content.cover.title, { x: 0.5, y: 2.5, w: 9, h: 1, fontSize: 32, color: "1A1A1A" });
  slide1.addText(content.cover.subtitle, { x: 0.5, y: 3.6, w: 9, h: 0.5, fontSize: 16, color: "666666" });
  slide1.addText("CONFIDENTIAL", { x: 0.5, y: 4.8, w: 4, h: 0.3, fontSize: 12, bold: true, color: "1A1A1A" });
  slide1.addText(content.cover.date, { x: 0.5, y: 5.1, w: 4, h: 0.3, fontSize: 11, color: "666666" });
  slide1.addText(content.cover.company, { x: 5.5, y: 4.8, w: 4, h: 0.3, fontSize: 11, color: "666666", align: "right" });
  slide1.addText(content.cover.email, { x: 5.5, y: 5.1, w: 4, h: 0.3, fontSize: 11, color: "666666", align: "right" });

  // Slide 2: Letter
  const slide2 = pptx.addSlide();
  slide2.addText("UnifiMed", { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 24, bold: true, color: primaryColor });
  slide2.addText(content.letter.date, { x: 0.5, y: 0.9, w: 9, h: 0.3, fontSize: 11, color: "666666" });
  slide2.addText(content.letter.salutation, { x: 0.5, y: 1.3, w: 9, h: 0.3, fontSize: 12, color: "1A1A1A" });
  const letterText = content.letter.paragraphs.join("\n\n");
  slide2.addText(letterText, { x: 0.5, y: 1.7, w: 9, h: 2.8, fontSize: 10, color: "4A4A4A", valign: "top" });
  slide2.addText(content.letter.closing, { x: 0.5, y: 4.6, w: 9, h: 0.3, fontSize: 12, color: "1A1A1A" });
  slide2.addText(content.letter.signature, { x: 0.5, y: 4.9, w: 9, h: 0.3, fontSize: 12, bold: true, color: "1A1A1A" });

  // Slide 3: About
  const slide3 = pptx.addSlide();
  slide3.addText(content.about.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide3.addText(content.about.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  slide3.addText(content.about.intro, { x: 0.5, y: 1.4, w: 9, h: 0.6, fontSize: 11, color: "4A4A4A" });
  slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.1, w: 4.2, h: 1.4, fill: { color: lightBg } });
  slide3.addText(content.about.expertiseTitle, { x: 0.7, y: 2.2, w: 3.8, h: 0.3, fontSize: 14, bold: true, color: primaryColor });
  slide3.addText(content.about.expertiseText, { x: 0.7, y: 2.5, w: 3.8, h: 0.9, fontSize: 10, color: "4A4A4A", valign: "top" });
  slide3.addShape(pptx.ShapeType.rect, { x: 5.3, y: 2.1, w: 4.2, h: 1.4, fill: { color: lightBg } });
  slide3.addText(content.about.missionTitle, { x: 5.5, y: 2.2, w: 3.8, h: 0.3, fontSize: 14, bold: true, color: primaryColor });
  slide3.addText(content.about.missionText, { x: 5.5, y: 2.5, w: 3.8, h: 0.9, fontSize: 10, color: "4A4A4A", valign: "top" });
  slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.7, w: 9, h: 0.8, fill: { color: "E8F4F8" }, line: { color: primaryColor, pt: 2 } });
  slide3.addText(`"${content.about.quote}"`, { x: 0.7, y: 3.8, w: 8.6, h: 0.6, fontSize: 11, italic: true, color: "333333" });

  // Slide 4: How We Work
  const slide4 = pptx.addSlide();
  slide4.addText(content.howWeWork.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide4.addText(content.howWeWork.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  content.howWeWork.steps.forEach((step, i) => {
    const yPos = 1.4 + i * 0.7;
    slide4.addShape(pptx.ShapeType.ellipse, { x: 0.5, y: yPos, w: 0.35, h: 0.35, fill: { color: primaryColor } });
    slide4.addText(String(i + 1), { x: 0.5, y: yPos, w: 0.35, h: 0.35, fontSize: 11, color: "FFFFFF", align: "center", valign: "middle" });
    slide4.addText(step.title, { x: 1, y: yPos, w: 8.5, h: 0.25, fontSize: 12, bold: true, color: "1A1A1A" });
    slide4.addText(step.description, { x: 1, y: yPos + 0.25, w: 8.5, h: 0.4, fontSize: 10, color: "4A4A4A" });
  });

  // Slide 5: Solutions
  const slide5 = pptx.addSlide();
  slide5.addText(content.solutions.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide5.addText(content.solutions.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  content.solutions.services.slice(0, 4).forEach((service, i) => {
    const xPos = 0.5 + (i % 2) * 4.75;
    const yPos = 1.4 + Math.floor(i / 2) * 1.2;
    slide5.addShape(pptx.ShapeType.rect, { x: xPos, y: yPos, w: 4.5, h: 1, fill: { color: lightBg } });
    slide5.addText(service.title, { x: xPos + 0.15, y: yPos + 0.1, w: 4.2, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
    slide5.addText(service.description, { x: xPos + 0.15, y: yPos + 0.4, w: 4.2, h: 0.5, fontSize: 9, color: "4A4A4A", valign: "top" });
  });
  slide5.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.9, w: 9, h: 0.8, fill: { color: "FFFFFF" }, line: { color: primaryColor, pt: 2 } });
  slide5.addText(content.solutions.integratedTitle, { x: 0.7, y: 3.95, w: 8.6, h: 0.3, fontSize: 12, bold: true, color: "1A1A1A" });
  slide5.addText(content.solutions.integratedText, { x: 0.7, y: 4.25, w: 8.6, h: 0.4, fontSize: 10, color: "4A4A4A" });

  // Slide 6: Markets
  const slide6 = pptx.addSlide();
  slide6.addText(content.markets.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide6.addText(content.markets.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  content.markets.segments.slice(0, 4).forEach((segment, i) => {
    const xPos = 0.5 + (i % 2) * 4.75;
    const yPos = 1.4 + Math.floor(i / 2) * 1.2;
    slide6.addShape(pptx.ShapeType.rect, { x: xPos, y: yPos, w: 4.5, h: 1, fill: { color: lightBg } });
    slide6.addText(segment.title, { x: xPos + 0.15, y: yPos + 0.1, w: 4.2, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
    slide6.addText(segment.description, { x: xPos + 0.15, y: yPos + 0.4, w: 4.2, h: 0.5, fontSize: 9, color: "4A4A4A", valign: "top" });
  });
  slide6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.9, w: 9, h: 0.8, fill: { color: "E8F4F8" } });
  slide6.addText(content.markets.crossFunctionalTitle, { x: 0.7, y: 3.95, w: 8.6, h: 0.3, fontSize: 12, bold: true, color: "1A1A1A" });
  slide6.addText(content.markets.crossFunctionalText, { x: 0.7, y: 4.25, w: 8.6, h: 0.4, fontSize: 10, color: "4A4A4A" });

  // Slide 7: Clients
  const slide7 = pptx.addSlide();
  slide7.addText(content.clients.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide7.addText(content.clients.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  slide7.addText(content.clients.intro, { x: 0.5, y: 1.4, w: 9, h: 0.5, fontSize: 11, color: "4A4A4A" });
  content.clients.clientTypes.forEach((client, i) => {
    const yPos = 2 + i * 0.8;
    slide7.addShape(pptx.ShapeType.rect, { x: 0.5, y: yPos, w: 9, h: 0.7, fill: { color: lightBg } });
    slide7.addText(client.title, { x: 0.7, y: yPos + 0.05, w: 8.6, h: 0.25, fontSize: 12, bold: true, color: primaryColor });
    slide7.addText(client.description, { x: 0.7, y: yPos + 0.3, w: 8.6, h: 0.35, fontSize: 10, color: "4A4A4A" });
  });

  // Slide 8: Team
  const slide8 = pptx.addSlide();
  slide8.addText(content.team.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide8.addText(content.team.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  content.team.members.slice(0, 6).forEach((member, i) => {
    const xPos = 0.5 + (i % 3) * 3.1;
    const yPos = 1.4 + Math.floor(i / 3) * 1.5;
    slide8.addShape(pptx.ShapeType.rect, { x: xPos, y: yPos, w: 2.9, h: 1.3, fill: { color: lightBg } });
    slide8.addText(member.name, { x: xPos + 0.1, y: yPos + 0.1, w: 2.7, h: 0.25, fontSize: 11, bold: true, color: "1A1A1A" });
    slide8.addText(member.role, { x: xPos + 0.1, y: yPos + 0.35, w: 2.7, h: 0.2, fontSize: 9, italic: true, color: primaryColor });
    slide8.addText(member.bio, { x: xPos + 0.1, y: yPos + 0.55, w: 2.7, h: 0.7, fontSize: 8, color: "4A4A4A", valign: "top" });
  });

  // Slide 9: Proposal
  const slide9 = pptx.addSlide();
  slide9.addText(content.proposal.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide9.addText(content.proposal.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  slide9.addText(content.proposal.packagesTitle, { x: 0.5, y: 1.3, w: 9, h: 0.3, fontSize: 14, bold: true, color: "1A1A1A" });
  content.proposal.packages.forEach((pkg, i) => {
    const xPos = 0.5 + i * 3.1;
    slide9.addShape(pptx.ShapeType.rect, { x: xPos, y: 1.7, w: 2.9, h: 2.8, fill: { color: i === 1 ? "E8F4F8" : lightBg }, line: i === 1 ? { color: primaryColor, pt: 2 } : undefined });
    slide9.addText(pkg.name, { x: xPos + 0.1, y: 1.8, w: 2.7, h: 0.3, fontSize: 14, bold: true, color: primaryColor });
    slide9.addText(pkg.description, { x: xPos + 0.1, y: 2.1, w: 2.7, h: 0.2, fontSize: 9, color: "4A4A4A" });
    slide9.addText(pkg.price, { x: xPos + 0.1, y: 2.35, w: 2.7, h: 0.3, fontSize: 18, bold: true, color: primaryColor });
    slide9.addText(pkg.duration, { x: xPos + 0.1, y: 2.65, w: 2.7, h: 0.2, fontSize: 8, color: "666666" });
    const featureText = pkg.features.map(f => `✓ ${f}`).join('\n');
    slide9.addText(featureText, { x: xPos + 0.1, y: 2.9, w: 2.7, h: 1.5, fontSize: 8, color: "4A4A4A", valign: "top" });
  });

  // Slide 10: Value
  const slide10 = pptx.addSlide();
  slide10.addText(content.value.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide10.addText(content.value.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  content.value.pillars.forEach((pillar, i) => {
    const xPos = 0.5 + i * 2.35;
    slide10.addShape(pptx.ShapeType.rect, { x: xPos, y: 1.4, w: 2.2, h: 1, fill: { color: lightBg } });
    slide10.addText(pillar.title, { x: xPos + 0.1, y: 1.5, w: 2, h: 0.3, fontSize: 14, bold: true, color: primaryColor, align: "center" });
    slide10.addText(pillar.description, { x: xPos + 0.1, y: 1.8, w: 2, h: 0.5, fontSize: 8, color: "4A4A4A", align: "center", valign: "top" });
  });
  slide10.addText("What Sets Us Apart", { x: 0.5, y: 2.6, w: 9, h: 0.4, fontSize: 16, bold: true, color: primaryColor });
  content.value.differentiators.forEach((diff, i) => {
    const yPos = 3.1 + i * 0.6;
    slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: yPos, w: 9, h: 0.5, fill: { color: lightBg } });
    slide10.addText(diff.title, { x: 0.7, y: yPos + 0.05, w: 8.6, h: 0.2, fontSize: 11, bold: true, color: primaryColor });
    slide10.addText(diff.description, { x: 0.7, y: yPos + 0.25, w: 8.6, h: 0.2, fontSize: 9, color: "4A4A4A" });
  });

  // Slide 11: Contact
  const slide11 = pptx.addSlide();
  slide11.addText(content.contact.sectionLabel, { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 12, bold: true, color: primaryColor });
  slide11.addText(content.contact.title, { x: 0.5, y: 0.7, w: 9, h: 0.6, fontSize: 28, color: "1A1A1A" });
  slide11.addText(content.contact.intro, { x: 0.5, y: 1.4, w: 6, h: 0.8, fontSize: 12, color: "4A4A4A" });
  slide11.addText(`Email: ${content.contact.email}`, { x: 0.5, y: 2.4, w: 9, h: 0.3, fontSize: 12, color: "1A1A1A" });
  slide11.addText(`Location: ${content.contact.location}`, { x: 0.5, y: 2.7, w: 9, h: 0.3, fontSize: 12, color: "1A1A1A" });
  slide11.addText(`Website: ${content.contact.website}`, { x: 0.5, y: 3, w: 9, h: 0.3, fontSize: 12, color: "1A1A1A" });
  slide11.addShape(pptx.ShapeType.rect, { x: 0, y: 4.8, w: 10, h: 0.02, fill: { color: primaryColor } });
  slide11.addText(`UnifiMed Global Advisory | ${content.contact.email} | ${content.contact.location}`, { x: 0, y: 4.9, w: 10, h: 0.3, fontSize: 10, color: "666666", align: "center" });

  await pptx.writeFile({ fileName: "UnifiMed-Proposal.pptx" });
};
