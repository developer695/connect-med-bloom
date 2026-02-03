import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { ProposalContent } from "@/contexts/ProposalContentContext";

// Colors matching your UI
const colors = {
  primary: "#0866a4",
  primaryLight: "#e8f4f8",
  dark: "#1a1a2e",
  gray: "#4a4a5a",
  lightGray: "#666666",
  bgLight: "#f8f9fc",
  border: "#e8e9ed",
};

// Styles matching your website design
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: "48px 54px",
    fontFamily: "Helvetica",
    fontSize: 11,
    color: colors.gray,
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  h1: {
    fontSize: 36,
    fontWeight: "light",
    marginBottom: 20,
    color: colors.dark,
  },

  h2: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },

  h3: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: colors.dark,
  },

  paragraph: {
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 10,
  },

  // Cover page
  coverPage: {
    paddingTop: 60,
    height: "100%",
    justifyContent: "space-between",
  },

  coverTitle: {
    fontSize: 42,
    fontWeight: "light",
    marginBottom: 12,
    color: colors.dark,
  },

  coverSubtitle: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 24,
  },

  // Cards
  card: {
    backgroundColor: colors.bgLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    border: `1px solid ${colors.border}`,
  },

  cardHighlight: {
    backgroundColor: colors.primaryLight,
    border: `2px solid ${colors.primary}`,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    color: colors.primary,
    fontSize: 13,
  },

  // Grid
  grid2: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
  },

  grid3: {
    flexDirection: "row",
    gap: 16,
  },

  gridItem: {
    flex: 1,
  },

  // Steps
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },

  stepNumber: {
    width: 28,
    height: 28,
    backgroundColor: colors.primary,
    color: "white",
    borderRadius: 14,
    textAlign: "center",
    paddingTop: 6,
    fontSize: 12,
    fontWeight: "bold",
  },

  stepContent: {
    flex: 1,
  },

  // Tags
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },

  tag: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    padding: "5px 12px",
    borderRadius: 20,
    fontSize: 9,
    border: `1px solid ${colors.primary}`,
  },

  // Quote box
  quoteBox: {
    backgroundColor: colors.primaryLight,
    borderLeft: `4px solid ${colors.primary}`,
    padding: 18,
    marginVertical: 20,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  quoteText: {
    fontStyle: "italic",
    color: "#333333",
    fontSize: 12,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 36,
    left: 54,
    right: 54,
    borderTop: `2px solid ${colors.primary}`,
    paddingTop: 12,
    fontSize: 9,
    color: colors.lightGray,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // Package cards
  packageCard: {
    backgroundColor: colors.bgLight,
    padding: 16,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    flex: 1,
  },

  packageCardFeatured: {
    backgroundColor: colors.primaryLight,
    border: `2px solid ${colors.primary}`,
  },

  packageName: {
    fontWeight: "bold",
    color: colors.primary,
    fontSize: 15,
    marginBottom: 6,
  },

  packagePrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginVertical: 8,
  },

  packageDuration: {
    fontSize: 10,
    color: colors.lightGray,
    marginBottom: 10,
  },

  // Member cards
  memberCard: {
    backgroundColor: colors.bgLight,
    padding: 14,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    flex: 1,
    marginBottom: 12,
  },

  memberName: {
    fontWeight: "bold",
    fontSize: 13,
    color: colors.dark,
    marginBottom: 2,
  },

  memberRole: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 6,
  },

  memberBio: {
    fontSize: 9,
    color: colors.gray,
  },

  // Decorative line
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: colors.primary,
    marginBottom: 16,
  },

  // Pillar
  pillar: {
    textAlign: "center",
    padding: 20,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    flex: 1,
  },

  pillarTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },

  // Letter
  letterPara: {
    marginBottom: 14,
    fontSize: 11,
    lineHeight: 1.7,
  },
});

// Cover Page
const CoverPagePDF = ({ content }: { content: ProposalContent["cover"] }) => (
  <Page size="LETTER" style={styles.page}>
    <View style={styles.coverPage}>
      <View>
        <Text style={styles.logo}>UnifiMed</Text>
      </View>

      <View>
        <Text style={styles.sectionLabel}>{content.tagline || "PROFESSIONAL ADVISORY"}</Text>
        <Text style={styles.coverTitle}>{content.title || "Business Proposal"}</Text>
        <Text style={styles.coverSubtitle}>
          {content.subtitle || "Transforming Healthcare Through Innovation"}
        </Text>

        {content.clientLogo && content.clientLogo.startsWith('data:image') && (
          <Image
            src={content.clientLogo}
            style={{ width: 180, height: 80, objectFit: "contain", marginTop: 20 }}
          />
        )}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 4 }}>
            CONFIDENTIAL
          </Text>
          <Text style={{ fontSize: 10, color: colors.lightGray }}>{content.date}</Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={{ fontSize: 10, color: colors.lightGray }}>{content.company}</Text>
          <Text style={{ fontSize: 10, color: colors.lightGray }}>{content.email}</Text>
        </View>
      </View>
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Letter Page
const LetterPagePDF = ({ content }: { content: ProposalContent["letter"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.logo}>UnifiMed</Text>
    <Text style={{ fontSize: 10, color: colors.lightGray, marginBottom: 20 }}>
      {content.date}
    </Text>
    <Text style={{ marginBottom: 18, fontSize: 12 }}>{content.salutation}</Text>

    {content.paragraphs.map((para, i) => (
      <Text key={i} style={styles.letterPara}>
        {para}
      </Text>
    ))}

    <Text style={{ marginTop: 24, fontSize: 12 }}>{content.closing}</Text>
    <Text style={{ fontWeight: "bold", fontSize: 12 }}>{content.signature}</Text>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// About Page
const AboutPagePDF = ({ content }: { content: ProposalContent["about"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />
    <Text style={{ fontSize: 12, marginBottom: 24 }}>{content.intro}</Text>

    <View style={styles.grid2}>
      <View style={[styles.card, styles.gridItem]}>
        <Text style={[styles.h2, { marginBottom: 8 }]}>{content.expertiseTitle}</Text>
        <Text style={{ fontSize: 10 }}>{content.expertiseText}</Text>
      </View>
      <View style={[styles.card, styles.gridItem]}>
        <Text style={[styles.h2, { marginBottom: 8 }]}>{content.missionTitle}</Text>
        <Text style={{ fontSize: 10 }}>{content.missionText}</Text>
      </View>
    </View>

    <View style={styles.quoteBox}>
      <Text style={styles.quoteText}>"{content.quote}"</Text>
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// How We Work Page
const HowWeWorkPagePDF = ({ content }: { content: ProposalContent["howWeWork"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />

    {content.steps.map((step, i) => (
      <View key={i} style={styles.stepContainer}>
        <Text style={styles.stepNumber}>{i + 1}</Text>
        <View style={styles.stepContent}>
          <Text style={styles.h3}>{step.title}</Text>
          <Text style={{ fontSize: 10 }}>{step.description}</Text>
        </View>
      </View>
    ))}

    <View style={[styles.quoteBox, { marginTop: 20 }]}>
      <Text style={[styles.h3, { color: colors.primary, marginBottom: 6 }]}>
        {content.collaborativeTitle}
      </Text>
      <Text style={{ fontSize: 10 }}>{content.collaborativeText}</Text>
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Solutions Page
const SolutionsPagePDF = ({ content }: { content: ProposalContent["solutions"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />

    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {content.services.map((service, i) => (
        <View key={i} style={[styles.card, { width: "48%" }]}>
          <Text style={styles.cardTitle}>{service.title}</Text>
          <Text style={{ fontSize: 10 }}>{service.description}</Text>
        </View>
      ))}
    </View>

    <View style={[styles.cardHighlight, { marginTop: 16 }]}>
      <Text style={[styles.h2, { color: colors.dark, marginBottom: 6 }]}>
        {content.integratedTitle}
      </Text>
      <Text style={{ fontSize: 10 }}>{content.integratedText}</Text>
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Markets Page
const MarketsPagePDF = ({ content }: { content: ProposalContent["markets"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />

    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {content.segments.map((segment, i) => (
        <View key={i} style={[styles.card, { width: "48%" }]}>
          <Text style={styles.cardTitle}>{segment.title}</Text>
          <Text style={{ fontSize: 10, marginBottom: 8 }}>{segment.description}</Text>
          <View style={styles.tagsContainer}>
            {segment.tags.map((tag, j) => (
              <Text key={j} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>

    <View style={[styles.quoteBox, { marginTop: 16 }]}>
      <Text style={[styles.h3, { color: colors.primary, marginBottom: 6 }]}>
        {content.crossFunctionalTitle}
      </Text>
      <Text style={{ fontSize: 10 }}>{content.crossFunctionalText}</Text>
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Clients Page
const ClientsPagePDF = ({ content }: { content: ProposalContent["clients"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />
    <Text style={{ fontSize: 12, marginBottom: 20 }}>{content.intro}</Text>

    {content.clientTypes.map((client, i) => (
      <View key={i} style={[styles.card, { marginBottom: 14 }]}>
        <Text style={styles.cardTitle}>{client.title}</Text>
        <Text style={{ fontSize: 10 }}>{client.description}</Text>
      </View>
    ))}

    <View style={[styles.quoteBox, { marginTop: 16 }]}>
      <Text style={[styles.h3, { color: colors.primary, marginBottom: 6 }]}>
        {content.tailoredTitle}
      </Text>
      <Text style={{ fontSize: 10 }}>{content.tailoredText}</Text>
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Team Page
const TeamPagePDF = ({ content }: { content: ProposalContent["team"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />
    <Text style={{ fontSize: 11, marginBottom: 20 }}>{content.intro}</Text>

    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
      {content.members.map((member, i) => (
        <View key={i} style={[styles.memberCard, { width: "48%" }]}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRole}>{member.role}</Text>
          <Text style={styles.memberBio}>{member.bio}</Text>
        </View>
      ))}
    </View>

    <View style={[styles.quoteBox, { marginTop: 18 }]}>
      <Text style={[styles.h3, { color: colors.primary, marginBottom: 6 }]}>
        {content.collectiveTitle}
      </Text>
      <Text style={{ fontSize: 10 }}>{content.collectiveText}</Text>
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Proposal Page - Page 1 (Scope & Deliverables)
const ProposalPage1PDF = ({ content }: { content: ProposalContent["proposal"] }) => (
  <Page size="LETTER" style={styles.page} wrap>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />

    {/* Engagement Scope Section */}
    <Text style={[styles.h2, { marginBottom: 8 }]}>{content.scopeTitle}</Text>
    <Text style={{
      fontSize: 11,
      marginBottom: 24,
      lineHeight: 1.6,
      color: colors.dark
    }}>
      {content.scopeText}
    </Text>

    {/* Key Deliverables Section */}
    <Text style={[styles.h2, { marginBottom: 14 }]}>{content.deliverablesTitle}</Text>
    <View style={{
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      marginBottom: 20
    }}>
      {content.deliverables.slice(0, 4).map((d, i) => (
        <View
          key={i}
          style={{
            backgroundColor: colors.bgLight,
            padding: 18,
            borderRadius: 10,
            border: `2px solid ${colors.border}`,
            borderLeft: `4px solid ${colors.primary}`,
            width: "48%",
            minHeight: 110
          }}
        >
          <Text style={{
            fontWeight: "bold",
            fontSize: 13,
            color: colors.primary,
            marginBottom: 10,
            letterSpacing: 0.3
          }}>
            {d.title}
          </Text>
          <Text style={{
            fontSize: 10,
            lineHeight: 1.6,
            color: colors.dark
          }}>
            {d.description}
          </Text>
        </View>
      ))}
    </View>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Proposal Page - Page 2 (Engagement Options / Pricing)
const ProposalPage2PDF = ({ content }: { content: ProposalContent["proposal"] }) => (
  <Page size="LETTER" style={styles.page} break>
    {/* Header - Centered with more top space */}
    <Text style={{
      fontSize: 26,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 24,
      marginTop: 60,
      textAlign: "center"
    }}>
      Engagement Options
    </Text>

    {/* Three Package Cards - Centered Layout with wrap prevention */}
    <View style={{
      flexDirection: "row",
      gap: 16,
      justifyContent: "center",
      marginTop: 20
    }} wrap={false}>
      {content.packages.map((pkg, i) => (
        <View
          key={i}
          wrap={false}
          style={{
            backgroundColor: i === 1 ? colors.primaryLight : colors.bgLight,
            border: i === 1 ? `3px solid ${colors.primary}` : `1px solid ${colors.border}`,
            padding: 20,
            borderRadius: 12,
            width: "30%",
            minHeight: 300,
          }}
        >
          {/* Package Name */}
          <Text style={{
            fontWeight: "bold",
            color: colors.primary,
            fontSize: 14,
            marginBottom: 8,
            textAlign: "center",
            borderBottom: `2px solid ${colors.primary}`,
            paddingBottom: 8
          }}>
            {pkg.name}
          </Text>

          {/* Package Description */}
          <Text style={{
            fontSize: 9,
            color: colors.gray,
            marginBottom: 12,
            textAlign: "center",
            minHeight: 32
          }}>
            {pkg.description}
          </Text>

          {/* Price - Large and Prominent */}
          <Text style={{
            fontSize: 28,
            fontWeight: "bold",
            color: colors.primary,
            marginVertical: 12,
            textAlign: "center"
          }}>
            {pkg.price}
          </Text>

          {/* Duration */}
          <Text style={{
            fontSize: 10,
            color: colors.lightGray,
            marginBottom: 16,
            textAlign: "center"
          }}>
            {pkg.duration}
          </Text>

          {/* Features List */}
          <View style={{ marginTop: 8 }}>
            {pkg.features.slice(0, 5).map((f, j) => (
              <View key={j} style={{
                flexDirection: "row",
                marginBottom: 6,
                alignItems: "flex-start"
              }}>
                <Text style={{
                  color: colors.primary,
                  marginRight: 6,
                  fontSize: 9,
                  fontWeight: "bold"
                }}>
                  ✓
                </Text>
                <Text style={{
                  fontSize: 9,
                  flex: 1,
                  lineHeight: 1.4,
                  color: colors.dark
                }}>
                  {f}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>

    {/* Footer Note */}
    <Text style={{
      fontSize: 10,
      color: colors.gray,
      textAlign: "center",
      marginTop: 40,
      fontStyle: "italic"
    }}>
      All packages include ongoing strategic support and regular progress reviews
    </Text>

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Value Page
const ValuePagePDF = ({ content }: { content: ProposalContent["value"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />

    {/* Pillars Grid - 2 columns with better spacing */}
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
      {content.pillars.map((pillar, i) => (
        <View
          key={i}
          style={{
            width: "48%",
            backgroundColor: colors.primaryLight,
            padding: 16,
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            minHeight: 120,
          }}
        >
          <Text style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 8,
            textAlign: "center"
          }}>
            {pillar.title}
          </Text>
          <Text style={{
            fontSize: 9,
            color: colors.gray,
            textAlign: "center",
            lineHeight: 1.4
          }}>
            {pillar.description}
          </Text>
        </View>
      ))}
    </View>

    {/* Differentiators Section */}
    <Text style={[styles.h2, { marginBottom: 10, marginTop: 16 }]}>What Sets Us Apart</Text>
    {content.differentiators.slice(0, 4).map((diff, i) => (
      <View key={i} style={[styles.card, { marginBottom: 8, padding: 12 }]}>
        <Text style={{ fontWeight: "bold", fontSize: 11, color: colors.primary, marginBottom: 4 }}>
          {diff.title}
        </Text>
        <Text style={{ fontSize: 9, color: colors.gray, lineHeight: 1.3 }}>
          {diff.description}
        </Text>
      </View>
    ))}

    <View style={styles.footer} fixed>
      <Text>CONFIDENTIAL</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Contact Page
const ContactPagePDF = ({ content }: { content: ProposalContent["contact"] }) => (
  <Page size="LETTER" style={styles.page}>
    <Text style={styles.sectionLabel}>{content.sectionLabel}</Text>
    <Text style={styles.h1}>{content.title}</Text>
    <View style={styles.decorativeLine} />
    <Text style={{ fontSize: 12, marginBottom: 28 }}>{content.intro}</Text>

    <View style={[styles.card, { maxWidth: 400, marginBottom: 24 }]}>
      <Text style={{ marginBottom: 8 }}>
        <Text style={{ fontWeight: "bold" }}>Email: </Text>
        {content.email}
      </Text>
      <Text style={{ marginBottom: 8 }}>
        <Text style={{ fontWeight: "bold" }}>Location: </Text>
        {content.location}
      </Text>
      <Text>
        <Text style={{ fontWeight: "bold" }}>Website: </Text>
        {content.website}
      </Text>
    </View>

    <View style={styles.footer} fixed>
      <Text>UnifiMed Global Advisory | {content.email} | {content.location}</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  </Page>
);

// Main PDF Document
export const ProposalPDFDocument = ({ content }: { content: ProposalContent }) => (
  <Document>
    <CoverPagePDF content={content.cover} />
    <LetterPagePDF content={content.letter} />
    <AboutPagePDF content={content.about} />
    <HowWeWorkPagePDF content={content.howWeWork} />
    <SolutionsPagePDF content={content.solutions} />
    <MarketsPagePDF content={content.markets} />
    <ClientsPagePDF content={content.clients} />
    <TeamPagePDF content={content.team} />
    <ProposalPage1PDF content={content.proposal} />
    <ProposalPage2PDF content={content.proposal} />
    <ValuePagePDF content={content.value} />
    <ContactPagePDF content={content.contact} />
  </Document>
);
