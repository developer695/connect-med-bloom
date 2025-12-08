import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType, PageBreak, ImageRun } from "docx";
import { saveAs } from "file-saver";
import pptxgen from "pptxgenjs";
import type { ProposalContent } from "@/contexts/ProposalContentContext";

// Convert image URL to base64 for embedding
const getImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load image:", error);
    return "";
  }
};

// Generate static HTML for PDF export with rich styling matching original design
const generateStaticHTML = async (content: ProposalContent): Promise<string> => {
  const primaryColor = "#0866a4";
  const primaryLight = "#e8f4f8";
  
  // Load logo as base64 for embedding
  const logoBase64 = await getImageAsBase64("/images/unifimed-logo.png");
  const swoopBase64 = await getImageAsBase64("/images/unifimed-swoop.png");
  
  const styles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; line-height: 1.6; }
      
      .page { 
        width: 8.5in; 
        min-height: 11in; 
        padding: 0; 
        background: white; 
        page-break-after: always;
        position: relative;
        overflow: hidden;
      }
      .page:last-child { page-break-after: auto; }
      
      .page-content { padding: 0.5in 0.6in; position: relative; z-index: 1; }
      
      /* Typography */
      h1 { font-size: 32px; font-weight: 400; margin-bottom: 16px; line-height: 1.2; color: #1a1a2e; }
      h2 { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: ${primaryColor}; }
      h3 { font-size: 13px; font-weight: 600; margin-bottom: 5px; color: #1a1a2e; }
      p { font-size: 10px; line-height: 1.6; margin-bottom: 8px; color: #4a4a5a; }
      
      /* Components */
      .section-label { 
        font-size: 11px; 
        font-weight: 700; 
        color: ${primaryColor}; 
        letter-spacing: 1.5px; 
        margin-bottom: 4px; 
        text-transform: uppercase;
      }
      
      .logo-img { 
        height: 40px; 
        margin-bottom: 12px;
      }
      
      .logo-img-small { 
        height: 28px; 
        margin-bottom: 10px;
      }
      
      .swoop-decoration {
        position: absolute;
        top: -50px;
        left: -100px;
        width: 400px;
        height: 400px;
        opacity: 0.08;
        pointer-events: none;
      }
      
      .cover-title { 
        font-size: 36px; 
        font-weight: 400; 
        margin-bottom: 10px; 
        color: #1a1a2e; 
        line-height: 1.15;
        max-width: 85%;
      }
      
      .cover-subtitle { 
        font-size: 13px; 
        color: #666; 
        margin-bottom: 20px; 
        line-height: 1.5;
        max-width: 80%;
      }
      
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
      
      /* Curved card style matching original */
      .curved-card { 
        background: #f5f8fc;
        padding: 14px 16px; 
        border-radius: 24px;
        border: 1px solid #e0e5eb;
        position: relative;
      }
      
      .curved-card-highlight {
        background: linear-gradient(135deg, ${primaryLight} 0%, #f0f7fb 100%);
        border: 2px solid ${primaryColor};
        padding: 14px 16px;
        border-radius: 24px;
      }
      
      .card-title { 
        font-weight: 600; 
        margin-bottom: 5px; 
        color: ${primaryColor}; 
        font-size: 12px;
      }
      
      .step-container {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        gap: 10px;
      }
      
      .step-number { 
        width: 24px; 
        height: 24px; 
        min-width: 24px;
        background: ${primaryColor}; 
        color: white; 
        border-radius: 50%; 
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px; 
        font-weight: 600;
      }
      
      .step-content { flex: 1; }
      
      .tag { 
        display: inline-block; 
        background: ${primaryColor}12; 
        color: ${primaryColor}; 
        padding: 3px 10px; 
        border-radius: 16px; 
        font-size: 8px; 
        font-weight: 500;
        margin-right: 5px; 
        margin-bottom: 5px; 
      }
      
      .stat-card {
        background: #f5f8fc;
        border: 1px solid #e0e5eb;
        border-radius: 16px;
        padding: 12px 14px;
        text-align: center;
      }
      
      .stat-icon {
        width: 28px;
        height: 28px;
        margin: 0 auto 6px;
        color: ${primaryColor};
      }
      
      .pillar { 
        text-align: center; 
        padding: 16px 12px;
        background: linear-gradient(180deg, ${primaryLight} 0%, white 100%);
        border-radius: 16px;
        border: 1px solid #e0e5eb;
      }
      
      .pillar-title { 
        font-size: 24px; 
        font-weight: 600; 
        color: ${primaryColor}; 
        margin-bottom: 6px; 
      }
      
      .quote-box {
        background: linear-gradient(135deg, ${primaryLight} 0%, #f5f9fc 100%);
        border-left: 3px solid ${primaryColor};
        padding: 14px 18px;
        margin: 14px 0;
        border-radius: 0 16px 16px 0;
      }
      
      .quote-text {
        font-style: italic;
        color: #333;
        font-size: 11px;
        line-height: 1.55;
      }
      
      .footer { 
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #e0e5eb;
        padding: 10px 0.6in;
        font-size: 8px; 
        color: #888; 
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
      }
      
      .footer-logo {
        height: 14px;
        opacity: 0.6;
      }
      
      .letter-para { margin-bottom: 12px; text-align: justify; font-size: 10px; line-height: 1.65; }
      .meta { font-size: 9px; color: #666; }
      
      .package-card {
        background: #f5f8fc;
        padding: 14px;
        border-radius: 16px;
        text-align: center;
        border: 1px solid #e0e5eb;
      }
      
      .package-card.featured {
        background: linear-gradient(135deg, ${primaryLight} 0%, #f0f7fb 100%);
        border: 2px solid ${primaryColor};
      }
      
      .package-name {
        font-weight: 700;
        color: ${primaryColor};
        font-size: 13px;
        margin-bottom: 4px;
      }
      
      .package-price {
        font-size: 20px;
        font-weight: 700;
        color: ${primaryColor};
        margin: 6px 0;
      }
      
      .package-duration {
        font-size: 9px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .package-features {
        text-align: left;
        font-size: 8px;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .package-features li {
        margin-bottom: 3px;
        padding-left: 12px;
        position: relative;
      }
      
      .package-features li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: ${primaryColor};
        font-weight: bold;
      }
      
      .member-card {
        background: #f5f8fc;
        padding: 12px 14px;
        border-radius: 16px;
        border: 1px solid #e0e5eb;
      }
      
      .member-name {
        font-weight: 600;
        font-size: 12px;
        color: #1a1a2e;
        margin-bottom: 2px;
      }
      
      .member-role {
        font-size: 9px;
        color: ${primaryColor};
        font-weight: 500;
        margin-bottom: 5px;
      }
      
      .member-bio {
        font-size: 8px;
        color: #4a4a5a;
        line-height: 1.45;
      }
      
      .decorative-line {
        width: 50px;
        height: 2px;
        background: ${primaryColor};
        margin-bottom: 12px;
      }
      
      /* Cover page special styling */
      .cover-page {
        background: linear-gradient(180deg, white 0%, #f8fbfd 100%);
      }
      
      .cover-swoop {
        position: absolute;
        top: 0;
        left: 0;
        width: 350px;
        height: 350px;
        opacity: 0.5;
        pointer-events: none;
      }
      
      .cover-circle {
        position: absolute;
        bottom: -100px;
        right: -100px;
        width: 450px;
        height: 450px;
        border-radius: 50%;
        border: 1px solid #e8e9ed;
        opacity: 0.4;
        pointer-events: none;
      }
      
      /* Service icon placeholder */
      .service-icon {
        width: 24px;
        height: 24px;
        background: ${primaryColor}15;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        color: ${primaryColor};
        font-size: 12px;
      }
    </style>
  `;

  const coverPage = `
    <div class="page cover-page">
      ${swoopBase64 ? `<img src="${swoopBase64}" class="cover-swoop" />` : ''}
      <div class="cover-circle"></div>
      <div class="page-content">
        ${logoBase64 ? `<img src="${logoBase64}" class="logo-img" />` : '<div style="font-size: 28px; font-weight: 700; color: #0866a4; margin-bottom: 16px;">UnifiMed</div>'}
        <div style="height: 60px;"></div>
        <div class="section-label">${content.cover.tagline}</div>
        <div class="cover-title">${content.cover.title}</div>
        <div class="cover-subtitle">${content.cover.subtitle}</div>
        <div style="height: 160px;"></div>
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div class="meta">
            <div style="font-weight: 600; font-size: 10px; margin-bottom: 3px;">CONFIDENTIAL</div>
            <div>${content.cover.date}</div>
          </div>
          <div class="meta" style="text-align: right;">
            <div style="font-weight: 500;">${content.cover.company}</div>
            <div>${content.cover.email}</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>1</span>
      </div>
    </div>
  `;

  const letterPage = `
    <div class="page">
      <div class="page-content">
        ${logoBase64 ? `<img src="${logoBase64}" class="logo-img-small" />` : '<div style="font-size: 24px; font-weight: 700; color: #0866a4; margin-bottom: 12px;">UnifiMed</div>'}
        <p class="meta" style="margin-bottom: 16px;">${content.letter.date}</p>
        <p style="margin-bottom: 14px; font-size: 11px;">${content.letter.salutation}</p>
        ${content.letter.paragraphs.map(p => `<p class="letter-para">${p}</p>`).join('')}
        <p style="margin-top: 20px; font-size: 11px;">${content.letter.closing}</p>
        <p style="font-weight: 600; font-size: 11px;">${content.letter.signature}</p>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>2</span>
      </div>
    </div>
  `;

  const aboutPage = `
    <div class="page">
      ${swoopBase64 ? `<img src="${swoopBase64}" class="swoop-decoration" />` : ''}
      <div class="page-content">
        <div class="section-label">${content.about.sectionLabel}</div>
        <h1>${content.about.title}</h1>
        <div class="decorative-line"></div>
        <p style="font-size: 11px; margin-bottom: 18px;">${content.about.intro}</p>
        <div class="grid-2" style="margin-bottom: 18px;">
          <div class="curved-card">
            <h2 style="margin-bottom: 6px;">${content.about.expertiseTitle}</h2>
            <p style="font-size: 9px; margin-bottom: 0;">${content.about.expertiseText}</p>
          </div>
          <div class="curved-card">
            <h2 style="margin-bottom: 6px;">${content.about.missionTitle}</h2>
            <p style="font-size: 9px; margin-bottom: 0;">${content.about.missionText}</p>
          </div>
        </div>
        <div class="quote-box">
          <p class="quote-text">"${content.about.quote}"</p>
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>3</span>
      </div>
    </div>
  `;

  const howWeWorkPage = `
    <div class="page">
      <div class="page-content">
        <div class="section-label">${content.howWeWork.sectionLabel}</div>
        <h1>${content.howWeWork.title}</h1>
        <div class="decorative-line"></div>
        ${content.howWeWork.steps.map((step, i) => `
          <div class="step-container">
            <div class="step-number">${i + 1}</div>
            <div class="step-content">
              <h3>${step.title}</h3>
              <p style="font-size: 9px; margin-bottom: 0;">${step.description}</p>
            </div>
          </div>
        `).join('')}
        <div class="quote-box" style="margin-top: 16px;">
          <h3 style="color: ${primaryColor}; margin-bottom: 4px;">${content.howWeWork.collaborativeTitle}</h3>
          <p style="font-size: 9px; margin-bottom: 0;">${content.howWeWork.collaborativeText}</p>
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>4</span>
      </div>
    </div>
  `;

  const solutionsPage = `
    <div class="page">
      <div class="page-content">
        <div class="section-label">${content.solutions.sectionLabel}</div>
        <h1>${content.solutions.title}</h1>
        <div class="decorative-line"></div>
        <div class="grid-2">
          ${content.solutions.services.map(service => `
            <div class="curved-card">
              <div class="card-title">${service.title}</div>
              <p style="font-size: 9px; margin-bottom: 0;">${service.description}</p>
            </div>
          `).join('')}
        </div>
        <div class="curved-card-highlight" style="margin-top: 14px;">
          <h2 style="color: #1a1a2e; margin-bottom: 5px;">${content.solutions.integratedTitle}</h2>
          <p style="font-size: 9px; margin-bottom: 0;">${content.solutions.integratedText}</p>
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>5</span>
      </div>
    </div>
  `;

  const marketsPage = `
    <div class="page">
      <div class="page-content">
        <div class="section-label">${content.markets.sectionLabel}</div>
        <h1>${content.markets.title}</h1>
        <div class="decorative-line"></div>
        <div class="grid-2">
          ${content.markets.segments.map(segment => `
            <div class="curved-card">
              <div class="card-title">${segment.title}</div>
              <p style="font-size: 9px; margin-bottom: 6px;">${segment.description}</p>
              <div>
                ${segment.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="quote-box" style="margin-top: 14px;">
          <h3 style="color: ${primaryColor}; margin-bottom: 4px;">${content.markets.crossFunctionalTitle}</h3>
          <p style="font-size: 9px; margin-bottom: 0;">${content.markets.crossFunctionalText}</p>
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>6</span>
      </div>
    </div>
  `;

  const clientsPage = `
    <div class="page">
      <div class="page-content">
        <div class="section-label">${content.clients.sectionLabel}</div>
        <h1>${content.clients.title}</h1>
        <div class="decorative-line"></div>
        <p style="font-size: 11px; margin-bottom: 16px;">${content.clients.intro}</p>
        ${content.clients.clientTypes.map(client => `
          <div class="curved-card" style="margin-bottom: 12px;">
            <div class="card-title">${client.title}</div>
            <p style="font-size: 9px; margin-bottom: 0;">${client.description}</p>
          </div>
        `).join('')}
        <div class="quote-box" style="margin-top: 14px;">
          <h3 style="color: ${primaryColor}; margin-bottom: 4px;">${content.clients.tailoredTitle}</h3>
          <p style="font-size: 9px; margin-bottom: 0;">${content.clients.tailoredText}</p>
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>7</span>
      </div>
    </div>
  `;

  const teamPage = `
    <div class="page">
      <div class="page-content">
        <div class="section-label">${content.team.sectionLabel}</div>
        <h1>${content.team.title}</h1>
        <div class="decorative-line"></div>
        <p style="font-size: 10px; margin-bottom: 16px;">${content.team.intro}</p>
        <div class="grid-2" style="gap: 12px;">
          ${content.team.members.map(member => `
            <div class="member-card">
              <div class="member-name">${member.name}</div>
              <div class="member-role">${member.role}</div>
              <div class="member-bio">${member.bio}</div>
            </div>
          `).join('')}
        </div>
        <div class="quote-box" style="margin-top: 16px;">
          <h3 style="color: ${primaryColor}; margin-bottom: 4px;">${content.team.collectiveTitle}</h3>
          <p style="font-size: 9px; margin-bottom: 0;">${content.team.collectiveText}</p>
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>8</span>
      </div>
    </div>
  `;

  const proposalPage = `
    <div class="page">
      <div class="page-content">
        <div class="section-label">${content.proposal.sectionLabel}</div>
        <h1>${content.proposal.title}</h1>
        <div class="decorative-line"></div>
        <h2 style="margin-bottom: 6px;">${content.proposal.scopeTitle}</h2>
        <p style="font-size: 10px; margin-bottom: 14px;">${content.proposal.scopeText}</p>
        
        <h2 style="margin-bottom: 8px;">${content.proposal.deliverablesTitle}</h2>
        <div class="grid-2" style="margin-bottom: 14px; gap: 8px;">
          ${content.proposal.deliverables.map(d => `
            <div class="curved-card" style="padding: 10px 12px;">
              <div class="card-title" style="font-size: 10px;">${d.title}</div>
              <p style="font-size: 8px; margin-bottom: 0;">${d.description}</p>
            </div>
          `).join('')}
        </div>
        
        <h2 style="margin-bottom: 10px;">${content.proposal.packagesTitle}</h2>
        <div class="grid-3" style="gap: 10px;">
          ${content.proposal.packages.map((pkg, i) => `
            <div class="package-card ${i === 1 ? 'featured' : ''}">
              <div class="package-name">${pkg.name}</div>
              <p style="font-size: 8px; color: #666; margin-bottom: 4px;">${pkg.description}</p>
              <div class="package-price">${pkg.price}</div>
              <div class="package-duration">${pkg.duration}</div>
              <ul class="package-features">
                ${pkg.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>9</span>
      </div>
    </div>
  `;

  const valuePage = `
    <div class="page">
      <div class="page-content">
        <div class="section-label">${content.value.sectionLabel}</div>
        <h1>${content.value.title}</h1>
        <div class="decorative-line"></div>
        <div class="grid-2" style="margin-bottom: 20px; gap: 14px;">
          ${content.value.pillars.map(pillar => `
            <div class="pillar">
              <div class="pillar-title">${pillar.title}</div>
              <p style="font-size: 9px; margin-bottom: 0;">${pillar.description}</p>
            </div>
          `).join('')}
        </div>
        <h2 style="margin-bottom: 10px;">What Sets Us Apart</h2>
        ${content.value.differentiators.map(diff => `
          <div class="curved-card" style="margin-bottom: 10px;">
            <div class="card-title">${diff.title}</div>
            <p style="font-size: 9px; margin-bottom: 0;">${diff.description}</p>
          </div>
        `).join('')}
      </div>
      <div class="footer">
        <span>CONFIDENTIAL</span>
        <span>10</span>
      </div>
    </div>
  `;

  const contactPage = `
    <div class="page" style="background: linear-gradient(180deg, white 60%, ${primaryLight} 100%);">
      <div class="page-content">
        <div class="section-label">${content.contact.sectionLabel}</div>
        <h1>${content.contact.title}</h1>
        <div class="decorative-line"></div>
        <p style="max-width: 400px; font-size: 11px; margin-bottom: 24px;">${content.contact.intro}</p>
        <div class="curved-card" style="max-width: 350px; margin-bottom: 20px;">
          <p style="margin-bottom: 6px; font-size: 10px;"><strong>Email:</strong> ${content.contact.email}</p>
          <p style="margin-bottom: 6px; font-size: 10px;"><strong>Location:</strong> ${content.contact.location}</p>
          <p style="margin-bottom: 0; font-size: 10px;"><strong>Website:</strong> ${content.contact.website}</p>
        </div>
      </div>
      <div class="footer">
        <span>UnifiMed Global Advisory | ${content.contact.email} | ${content.contact.location}</span>
        <span>11</span>
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      ${styles}
    </head>
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
  
  const htmlContent = await generateStaticHTML(content);
  
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

// Word Document Export with enhanced styling
export const exportToWord = async (content: ProposalContent) => {
  const primaryColor = "0866a4";
  
  // Fetch logo as array buffer for embedding
  let logoImageData: ArrayBuffer | null = null;
  try {
    const response = await fetch("/images/unifimed-logo.png");
    logoImageData = await response.arrayBuffer();
  } catch (error) {
    console.error("Failed to load logo for Word export:", error);
  }
  
  const createLogoRun = () => {
    if (logoImageData) {
      return new ImageRun({
        data: logoImageData,
        transformation: { width: 140, height: 35 },
        type: "png",
      });
    }
    return new TextRun({ text: "UnifiMed", bold: true, size: 48, color: primaryColor });
  };
  
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: { font: "Calibri", size: 22 },
          paragraph: { spacing: { after: 160 } },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          run: { font: "Calibri Light", size: 56, color: "1A1A2E" },
          paragraph: { spacing: { after: 200, before: 160 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          run: { font: "Calibri", size: 26, color: primaryColor, bold: true },
          paragraph: { spacing: { after: 120, before: 160 } },
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children: [
          // Cover Page
          new Paragraph({ spacing: { after: 800 } }),
          new Paragraph({ children: [createLogoRun()] }),
          new Paragraph({ spacing: { after: 600 } }),
          new Paragraph({
            children: [new TextRun({ text: content.cover.tagline, bold: true, size: 22, color: primaryColor, allCaps: true })],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [new TextRun({ text: content.cover.title, size: 52, font: "Calibri Light", color: "1A1A2E" })],
            spacing: { after: 160 },
          }),
          new Paragraph({
            children: [new TextRun({ text: content.cover.subtitle, size: 24, color: "666666" })],
            spacing: { after: 1200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "CONFIDENTIAL", bold: true, size: 18 }),
              new TextRun({ text: "  •  ", size: 18, color: "999999" }),
              new TextRun({ text: content.cover.date, size: 18, color: "666666" }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: content.cover.company, size: 18, color: "666666" }),
              new TextRun({ text: "  •  ", size: 18, color: "999999" }),
              new TextRun({ text: content.cover.email, size: 18, color: "666666" }),
            ],
          }),
          
          // Letter Page
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({ children: [createLogoRun()], spacing: { after: 300 } }),
          new Paragraph({ text: content.letter.date, spacing: { after: 300 } }),
          new Paragraph({ text: content.letter.salutation, spacing: { after: 240 } }),
          ...content.letter.paragraphs.map((p) => new Paragraph({
            text: p,
            spacing: { after: 180 },
            alignment: AlignmentType.JUSTIFIED,
          })),
          new Paragraph({ text: content.letter.closing, spacing: { after: 80, before: 300 } }),
          new Paragraph({ children: [new TextRun({ text: content.letter.signature, bold: true })] }),

          // About Page
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.about.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
            spacing: { after: 80 },
          }),
          new Paragraph({ text: content.about.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: content.about.intro, spacing: { after: 240 } }),
          new Paragraph({ text: content.about.expertiseTitle, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: content.about.expertiseText, spacing: { after: 240 } }),
          new Paragraph({ text: content.about.missionTitle, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: content.about.missionText, spacing: { after: 240 } }),
          new Paragraph({
            children: [new TextRun({ text: `"${content.about.quote}"`, italics: true, color: "333333" })],
            shading: { type: ShadingType.SOLID, fill: "E8F4F8" },
            border: { left: { style: BorderStyle.SINGLE, size: 24, color: primaryColor } },
            spacing: { before: 160, after: 160 },
          }),

          // How We Work
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.howWeWork.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.howWeWork.title, heading: HeadingLevel.HEADING_1 }),
          ...content.howWeWork.steps.flatMap((step, i) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${i + 1}. `, bold: true, color: primaryColor, size: 24 }),
                new TextRun({ text: step.title, bold: true, size: 24 }),
              ],
              spacing: { after: 60, before: 160 },
            }),
            new Paragraph({ text: step.description, spacing: { after: 120 } }),
          ]),
          new Paragraph({ text: content.howWeWork.collaborativeTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 240 } }),
          new Paragraph({ text: content.howWeWork.collaborativeText }),

          // Solutions
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.solutions.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.solutions.title, heading: HeadingLevel.HEADING_1 }),
          ...content.solutions.services.flatMap((service) => [
            new Paragraph({
              children: [new TextRun({ text: service.title, bold: true, color: primaryColor })],
              spacing: { after: 60, before: 120 },
            }),
            new Paragraph({ text: service.description, spacing: { after: 120 } }),
          ]),
          new Paragraph({ text: content.solutions.integratedTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 240 } }),
          new Paragraph({ text: content.solutions.integratedText }),

          // Markets
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.markets.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.markets.title, heading: HeadingLevel.HEADING_1 }),
          ...content.markets.segments.flatMap((segment) => [
            new Paragraph({
              children: [new TextRun({ text: segment.title, bold: true, color: primaryColor })],
              spacing: { after: 60, before: 120 },
            }),
            new Paragraph({ text: segment.description, spacing: { after: 60 } }),
            new Paragraph({
              children: [new TextRun({ text: `Focus: ${segment.tags.join("  •  ")}`, italics: true, color: "666666", size: 18 })],
              spacing: { after: 160 },
            }),
          ]),
          new Paragraph({ text: content.markets.crossFunctionalTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 160 } }),
          new Paragraph({ text: content.markets.crossFunctionalText }),

          // Clients
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.clients.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.clients.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: content.clients.intro, spacing: { after: 240 } }),
          ...content.clients.clientTypes.flatMap((client) => [
            new Paragraph({
              children: [new TextRun({ text: client.title, bold: true, color: primaryColor })],
              spacing: { after: 60, before: 120 },
            }),
            new Paragraph({ text: client.description, spacing: { after: 160 } }),
          ]),
          new Paragraph({ text: content.clients.tailoredTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 160 } }),
          new Paragraph({ text: content.clients.tailoredText }),

          // Team
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.team.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.team.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: content.team.intro, spacing: { after: 240 } }),
          ...content.team.members.flatMap((member) => [
            new Paragraph({
              children: [new TextRun({ text: member.name, bold: true, size: 24 })],
              spacing: { after: 30, before: 160 },
            }),
            new Paragraph({
              children: [new TextRun({ text: member.role, color: primaryColor, italics: true, size: 20 })],
              spacing: { after: 60 },
            }),
            new Paragraph({ text: member.bio, spacing: { after: 120 } }),
          ]),
          new Paragraph({ text: content.team.collectiveTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 240 } }),
          new Paragraph({ text: content.team.collectiveText }),

          // Proposal
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.proposal.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.proposal.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: content.proposal.scopeTitle, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: content.proposal.scopeText, spacing: { after: 240 } }),
          new Paragraph({ text: content.proposal.deliverablesTitle, heading: HeadingLevel.HEADING_2 }),
          ...content.proposal.deliverables.flatMap((d) => [
            new Paragraph({
              children: [new TextRun({ text: `• ${d.title}`, bold: true })],
              spacing: { after: 30, before: 60 },
            }),
            new Paragraph({ text: d.description, spacing: { after: 100 } }),
          ]),
          new Paragraph({ text: content.proposal.packagesTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 240 } }),
          ...content.proposal.packages.flatMap((pkg) => [
            new Paragraph({
              children: [
                new TextRun({ text: pkg.name, bold: true, size: 26, color: primaryColor }),
                new TextRun({ text: `  —  ${pkg.price}`, bold: true, size: 26, color: "1A1A2E" }),
              ],
              spacing: { after: 60, before: 160 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `${pkg.description} (${pkg.duration})`, italics: true, color: "666666" })],
              spacing: { after: 80 },
            }),
            ...pkg.features.map((f) => new Paragraph({
              children: [new TextRun({ text: `✓ ${f}`, color: "333333" })],
              spacing: { after: 40 },
            })),
          ]),
          new Paragraph({ text: content.proposal.termsTitle, heading: HeadingLevel.HEADING_2, spacing: { before: 240 } }),
          new Paragraph({ text: content.proposal.termsText }),

          // Value
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.value.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.value.title, heading: HeadingLevel.HEADING_1 }),
          ...content.value.pillars.flatMap((pillar) => [
            new Paragraph({
              children: [new TextRun({ text: pillar.title, bold: true, size: 36, color: primaryColor })],
              spacing: { after: 60, before: 160 },
            }),
            new Paragraph({ text: pillar.description, spacing: { after: 160 } }),
          ]),
          new Paragraph({ text: "What Sets Us Apart", heading: HeadingLevel.HEADING_2, spacing: { before: 240 } }),
          ...content.value.differentiators.flatMap((diff) => [
            new Paragraph({
              children: [new TextRun({ text: diff.title, bold: true, color: primaryColor })],
              spacing: { after: 60, before: 120 },
            }),
            new Paragraph({ text: diff.description, spacing: { after: 120 } }),
          ]),

          // Contact
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: content.contact.sectionLabel, bold: true, size: 20, color: primaryColor, allCaps: true })],
          }),
          new Paragraph({ text: content.contact.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: content.contact.intro, spacing: { after: 300 } }),
          new Paragraph({
            children: [new TextRun({ text: "Email: ", bold: true }), new TextRun({ text: content.contact.email, color: primaryColor })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Location: ", bold: true }), new TextRun(content.contact.location)],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Website: ", bold: true }), new TextRun({ text: content.contact.website, color: primaryColor })],
            spacing: { after: 300 },
          }),
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 8, color: primaryColor } },
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: `UnifiMed Global Advisory  |  ${content.contact.email}  |  ${content.contact.location}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 160 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "UnifiMed-Proposal.docx");
};

// PowerPoint Export with enhanced styling
export const exportToPowerPoint = async (content: ProposalContent) => {
  const pptx = new pptxgen();
  const primaryColor = "0866a4";
  const primaryLight = "E8F4F8";
  const lightBg = "F5F8FC";
  const darkText = "1A1A2E";
  const grayText = "4A4A5A";
  
  pptx.author = "UnifiMed";
  pptx.title = "UnifiMed Proposal";
  pptx.subject = content.cover.title;
  pptx.layout = "LAYOUT_16x9";

  // Try to load logo
  let logoPath = "/images/unifimed-logo.png";
  
  // Helper function for consistent headers
  const addSlideHeader = (slide: pptxgen.Slide, sectionLabel: string, title: string) => {
    slide.addText(sectionLabel, { x: 0.5, y: 0.35, w: 9, h: 0.3, fontSize: 10, bold: true, color: primaryColor });
    slide.addText(title, { x: 0.5, y: 0.65, w: 9, h: 0.55, fontSize: 28, color: darkText, fontFace: "Calibri Light" });
    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 0.7, h: 0.03, fill: { color: primaryColor } });
  };
  
  // Helper for footer
  const addFooter = (slide: pptxgen.Slide, pageNum: number) => {
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 5.35, w: 10, h: 0.015, fill: { color: "E0E5EB" } });
    slide.addText("CONFIDENTIAL", { x: 0.5, y: 5.4, w: 4, h: 0.2, fontSize: 8, color: "888888" });
    slide.addText(String(pageNum), { x: 9, y: 5.4, w: 0.5, h: 0.2, fontSize: 8, color: "888888", align: "right" });
  };

  // Slide 1: Cover
  const slide1 = pptx.addSlide();
  slide1.addShape(pptx.ShapeType.ellipse, { x: 6, y: 2.5, w: 6, h: 6, fill: { color: "F0F4F8", transparency: 60 } });
  try {
    slide1.addImage({ path: logoPath, x: 0.5, y: 0.4, w: 1.8, h: 0.45 });
  } catch {
    slide1.addText("UnifiMed", { x: 0.5, y: 0.4, w: 3, h: 0.5, fontSize: 28, bold: true, color: primaryColor });
  }
  slide1.addText(content.cover.tagline, { x: 0.5, y: 1.7, w: 9, h: 0.35, fontSize: 11, bold: true, color: primaryColor });
  slide1.addText(content.cover.title, { x: 0.5, y: 2.05, w: 7.5, h: 0.85, fontSize: 30, color: darkText, fontFace: "Calibri Light" });
  slide1.addText(content.cover.subtitle, { x: 0.5, y: 2.95, w: 6.5, h: 0.45, fontSize: 13, color: grayText });
  slide1.addText(`CONFIDENTIAL  •  ${content.cover.date}`, { x: 0.5, y: 4.5, w: 4, h: 0.22, fontSize: 9, color: "666666" });
  slide1.addText(`${content.cover.company}  •  ${content.cover.email}`, { x: 5, y: 4.5, w: 4.5, h: 0.22, fontSize: 9, color: "666666", align: "right" });
  addFooter(slide1, 1);

  // Slide 2: Letter
  const slide2 = pptx.addSlide();
  try {
    slide2.addImage({ path: logoPath, x: 0.5, y: 0.3, w: 1.5, h: 0.38 });
  } catch {
    slide2.addText("UnifiMed", { x: 0.5, y: 0.3, w: 3, h: 0.4, fontSize: 22, bold: true, color: primaryColor });
  }
  slide2.addText(content.letter.date, { x: 0.5, y: 0.75, w: 9, h: 0.22, fontSize: 10, color: "666666" });
  slide2.addText(content.letter.salutation, { x: 0.5, y: 1.05, w: 9, h: 0.22, fontSize: 11, color: darkText });
  const letterText = content.letter.paragraphs.slice(0, 4).join("\n\n");
  slide2.addText(letterText, { x: 0.5, y: 1.35, w: 9, h: 2.5, fontSize: 9, color: grayText, valign: "top" });
  slide2.addText(content.letter.closing, { x: 0.5, y: 4, w: 9, h: 0.22, fontSize: 10, color: darkText });
  slide2.addText(content.letter.signature, { x: 0.5, y: 4.25, w: 9, h: 0.22, fontSize: 10, bold: true, color: darkText });
  addFooter(slide2, 2);

  // Slide 3: About
  const slide3 = pptx.addSlide();
  addSlideHeader(slide3, content.about.sectionLabel, content.about.title);
  slide3.addText(content.about.intro, { x: 0.5, y: 1.35, w: 9, h: 0.45, fontSize: 10, color: grayText });
  slide3.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.95, w: 4.3, h: 1.2, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
  slide3.addText(content.about.expertiseTitle, { x: 0.65, y: 2.05, w: 4, h: 0.22, fontSize: 12, bold: true, color: primaryColor });
  slide3.addText(content.about.expertiseText, { x: 0.65, y: 2.3, w: 4, h: 0.75, fontSize: 8, color: grayText, valign: "top" });
  slide3.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.95, w: 4.3, h: 1.2, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
  slide3.addText(content.about.missionTitle, { x: 5.35, y: 2.05, w: 4, h: 0.22, fontSize: 12, bold: true, color: primaryColor });
  slide3.addText(content.about.missionText, { x: 5.35, y: 2.3, w: 4, h: 0.75, fontSize: 8, color: grayText, valign: "top" });
  slide3.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 3.35, w: 9, h: 0.75, fill: { color: primaryLight }, line: { color: primaryColor, pt: 1 } });
  slide3.addText(`"${content.about.quote}"`, { x: 0.65, y: 3.45, w: 8.7, h: 0.55, fontSize: 10, italic: true, color: "333333" });
  addFooter(slide3, 3);

  // Slide 4: How We Work
  const slide4 = pptx.addSlide();
  addSlideHeader(slide4, content.howWeWork.sectionLabel, content.howWeWork.title);
  content.howWeWork.steps.forEach((step, i) => {
    const yPos = 1.38 + i * 0.68;
    slide4.addShape(pptx.ShapeType.ellipse, { x: 0.5, y: yPos, w: 0.28, h: 0.28, fill: { color: primaryColor } });
    slide4.addText(String(i + 1), { x: 0.5, y: yPos, w: 0.28, h: 0.28, fontSize: 10, color: "FFFFFF", align: "center", valign: "middle", bold: true });
    slide4.addText(step.title, { x: 0.9, y: yPos, w: 8.6, h: 0.2, fontSize: 11, bold: true, color: darkText });
    slide4.addText(step.description, { x: 0.9, y: yPos + 0.22, w: 8.6, h: 0.4, fontSize: 8, color: grayText });
  });
  addFooter(slide4, 4);

  // Slide 5: Solutions
  const slide5 = pptx.addSlide();
  addSlideHeader(slide5, content.solutions.sectionLabel, content.solutions.title);
  content.solutions.services.slice(0, 6).forEach((service, i) => {
    const xPos = 0.5 + (i % 3) * 3.05;
    const yPos = 1.38 + Math.floor(i / 3) * 1.1;
    slide5.addShape(pptx.ShapeType.roundRect, { x: xPos, y: yPos, w: 2.9, h: 0.95, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
    slide5.addText(service.title, { x: xPos + 0.1, y: yPos + 0.08, w: 2.7, h: 0.22, fontSize: 10, bold: true, color: primaryColor });
    slide5.addText(service.description, { x: xPos + 0.1, y: yPos + 0.32, w: 2.7, h: 0.55, fontSize: 7, color: grayText, valign: "top" });
  });
  slide5.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 3.7, w: 9, h: 0.65, fill: { color: primaryLight }, line: { color: primaryColor, pt: 1.5 } });
  slide5.addText(content.solutions.integratedTitle, { x: 0.65, y: 3.78, w: 8.7, h: 0.22, fontSize: 11, bold: true, color: darkText });
  slide5.addText(content.solutions.integratedText, { x: 0.65, y: 4.02, w: 8.7, h: 0.28, fontSize: 8, color: grayText });
  addFooter(slide5, 5);

  // Slide 6: Markets
  const slide6 = pptx.addSlide();
  addSlideHeader(slide6, content.markets.sectionLabel, content.markets.title);
  content.markets.segments.slice(0, 4).forEach((segment, i) => {
    const xPos = 0.5 + (i % 2) * 4.75;
    const yPos = 1.38 + Math.floor(i / 2) * 1.2;
    slide6.addShape(pptx.ShapeType.roundRect, { x: xPos, y: yPos, w: 4.5, h: 1.05, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
    slide6.addText(segment.title, { x: xPos + 0.1, y: yPos + 0.08, w: 4.3, h: 0.22, fontSize: 11, bold: true, color: primaryColor });
    slide6.addText(segment.description, { x: xPos + 0.1, y: yPos + 0.32, w: 4.3, h: 0.38, fontSize: 8, color: grayText, valign: "top" });
    slide6.addText(segment.tags.join("  •  "), { x: xPos + 0.1, y: yPos + 0.72, w: 4.3, h: 0.2, fontSize: 7, italic: true, color: primaryColor });
  });
  slide6.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 3.85, w: 9, h: 0.6, fill: { color: primaryLight } });
  slide6.addText(content.markets.crossFunctionalTitle, { x: 0.65, y: 3.92, w: 8.7, h: 0.2, fontSize: 10, bold: true, color: darkText });
  slide6.addText(content.markets.crossFunctionalText, { x: 0.65, y: 4.12, w: 8.7, h: 0.28, fontSize: 8, color: grayText });
  addFooter(slide6, 6);

  // Slide 7: Clients
  const slide7 = pptx.addSlide();
  addSlideHeader(slide7, content.clients.sectionLabel, content.clients.title);
  slide7.addText(content.clients.intro, { x: 0.5, y: 1.35, w: 9, h: 0.38, fontSize: 10, color: grayText });
  content.clients.clientTypes.forEach((client, i) => {
    const yPos = 1.85 + i * 0.75;
    slide7.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: yPos, w: 9, h: 0.65, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
    slide7.addText(client.title, { x: 0.65, y: yPos + 0.08, w: 8.7, h: 0.2, fontSize: 11, bold: true, color: primaryColor });
    slide7.addText(client.description, { x: 0.65, y: yPos + 0.3, w: 8.7, h: 0.3, fontSize: 8, color: grayText });
  });
  slide7.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 4.2, w: 9, h: 0.6, fill: { color: primaryLight } });
  slide7.addText(content.clients.tailoredTitle, { x: 0.65, y: 4.27, w: 8.7, h: 0.2, fontSize: 10, bold: true, color: darkText });
  slide7.addText(content.clients.tailoredText, { x: 0.65, y: 4.47, w: 8.7, h: 0.28, fontSize: 8, color: grayText });
  addFooter(slide7, 7);

  // Slide 8: Team
  const slide8 = pptx.addSlide();
  addSlideHeader(slide8, content.team.sectionLabel, content.team.title);
  slide8.addText(content.team.intro, { x: 0.5, y: 1.35, w: 9, h: 0.32, fontSize: 9, color: grayText });
  content.team.members.slice(0, 6).forEach((member, i) => {
    const xPos = 0.5 + (i % 3) * 3.05;
    const yPos = 1.75 + Math.floor(i / 3) * 1.35;
    slide8.addShape(pptx.ShapeType.roundRect, { x: xPos, y: yPos, w: 2.9, h: 1.2, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
    slide8.addText(member.name, { x: xPos + 0.1, y: yPos + 0.08, w: 2.7, h: 0.2, fontSize: 10, bold: true, color: darkText });
    slide8.addText(member.role, { x: xPos + 0.1, y: yPos + 0.28, w: 2.7, h: 0.16, fontSize: 8, italic: true, color: primaryColor });
    slide8.addText(member.bio, { x: xPos + 0.1, y: yPos + 0.46, w: 2.7, h: 0.66, fontSize: 7, color: grayText, valign: "top" });
  });
  addFooter(slide8, 8);

  // Slide 9: Proposal / Packages
  const slide9 = pptx.addSlide();
  addSlideHeader(slide9, content.proposal.sectionLabel, content.proposal.title);
  slide9.addText(content.proposal.packagesTitle, { x: 0.5, y: 1.35, w: 9, h: 0.26, fontSize: 13, bold: true, color: darkText });
  content.proposal.packages.forEach((pkg, i) => {
    const xPos = 0.5 + i * 3.05;
    const isFeatured = i === 1;
    slide9.addShape(pptx.ShapeType.roundRect, { 
      x: xPos, y: 1.68, w: 2.9, h: 3.1, 
      fill: { color: isFeatured ? primaryLight : lightBg }, 
      line: isFeatured ? { color: primaryColor, pt: 2 } : { color: "E0E5EB", pt: 1 } 
    });
    slide9.addText(pkg.name, { x: xPos + 0.1, y: 1.76, w: 2.7, h: 0.26, fontSize: 12, bold: true, color: primaryColor });
    slide9.addText(pkg.description, { x: xPos + 0.1, y: 2.02, w: 2.7, h: 0.2, fontSize: 8, color: grayText });
    slide9.addText(pkg.price, { x: xPos + 0.1, y: 2.26, w: 2.7, h: 0.32, fontSize: 18, bold: true, color: primaryColor });
    slide9.addText(pkg.duration, { x: xPos + 0.1, y: 2.58, w: 2.7, h: 0.16, fontSize: 8, color: "666666" });
    const featureText = pkg.features.map(f => `✓ ${f}`).join('\n');
    slide9.addText(featureText, { x: xPos + 0.1, y: 2.8, w: 2.7, h: 1.85, fontSize: 7, color: grayText, valign: "top" });
  });
  addFooter(slide9, 9);

  // Slide 10: Value
  const slide10 = pptx.addSlide();
  addSlideHeader(slide10, content.value.sectionLabel, content.value.title);
  content.value.pillars.forEach((pillar, i) => {
    const xPos = 0.5 + i * 2.35;
    slide10.addShape(pptx.ShapeType.roundRect, { x: xPos, y: 1.38, w: 2.2, h: 1.05, fill: { color: primaryLight }, line: { color: "E0E5EB", pt: 1 } });
    slide10.addText(pillar.title, { x: xPos + 0.08, y: 1.46, w: 2.04, h: 0.32, fontSize: 15, bold: true, color: primaryColor, align: "center" });
    slide10.addText(pillar.description, { x: xPos + 0.08, y: 1.8, w: 2.04, h: 0.55, fontSize: 7, color: grayText, align: "center", valign: "top" });
  });
  slide10.addText("What Sets Us Apart", { x: 0.5, y: 2.6, w: 9, h: 0.28, fontSize: 13, bold: true, color: darkText });
  content.value.differentiators.forEach((diff, i) => {
    const yPos = 2.95 + i * 0.55;
    slide10.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: yPos, w: 9, h: 0.48, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
    slide10.addText(diff.title, { x: 0.65, y: yPos + 0.05, w: 8.7, h: 0.18, fontSize: 10, bold: true, color: primaryColor });
    slide10.addText(diff.description, { x: 0.65, y: yPos + 0.24, w: 8.7, h: 0.18, fontSize: 8, color: grayText });
  });
  addFooter(slide10, 10);

  // Slide 11: Contact
  const slide11 = pptx.addSlide();
  slide11.addShape(pptx.ShapeType.rect, { x: 0, y: 3.3, w: 10, h: 2.33, fill: { color: primaryLight, transparency: 50 } });
  addSlideHeader(slide11, content.contact.sectionLabel, content.contact.title);
  slide11.addText(content.contact.intro, { x: 0.5, y: 1.4, w: 5.5, h: 0.65, fontSize: 11, color: grayText });
  slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 2.2, w: 4.5, h: 1, fill: { color: lightBg }, line: { color: "E0E5EB", pt: 1 } });
  slide11.addText(`Email: ${content.contact.email}`, { x: 0.65, y: 2.3, w: 4.2, h: 0.25, fontSize: 10, color: darkText });
  slide11.addText(`Location: ${content.contact.location}`, { x: 0.65, y: 2.55, w: 4.2, h: 0.25, fontSize: 10, color: darkText });
  slide11.addText(`Website: ${content.contact.website}`, { x: 0.65, y: 2.8, w: 4.2, h: 0.25, fontSize: 10, color: darkText });
  addFooter(slide11, 11);

  await pptx.writeFile({ fileName: "UnifiMed-Proposal.pptx" });
};
