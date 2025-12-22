import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Custom debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Helper to get current date formatted
const getCurrentDateFormatted = () => format(new Date(), "MMMM yyyy");
const getCurrentDateFullFormatted = () => format(new Date(), "MMMM d, yyyy");

export interface ShapeConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DurationUnit = 'weeks' | 'months';

const WEEKS_PER_MONTH = 4.345;

export interface SubDeliverable {
  name: string;
  included: boolean;
}

export interface Deliverable {
  title: string;
  description: string;
  rate: number;
  hoursPerPeriod: number;
  duration: number;
  durationUnit: DurationUnit;
  subDeliverables: SubDeliverable[];
}

export interface Package {
  name: string;
  description: string;
  price: string;
  duration: string;
  hoursPerWeek: number;
  durationWeeks: number;
  features: string[];
  includedDeliverables: string[];
  autoCalculate: boolean;
}

export interface ProposalContent {
  cover: {
    tagline: string;
    title: string;
    subtitle: string;
    clientLogo?: string;
    date?: string;
    company: string;
    email: string;
  };
  letter: {
    date?: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
    footer: string;
  };
  about: {
    sectionLabel: string;
    title: string;
    intro: string;
    stats: { title: string; description: string }[];
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
  team: {
    sectionLabel: string;
    title: string;
    intro: string;
    members: { name: string; role: string; bio: string; image?: string }[];
    collectiveTitle: string;
    collectiveText: string;
  };
  proposal: {
    sectionLabel: string;
    title: string;
    projectTeamTitle: string;
    projectTeam: { name: string; title: string; bio: string; image?: string }[];
    scopeTitle: string;
    scopeText: string;
    deliverablesTitle: string;
    deliverables: Deliverable[];
    hiddenDeliverables: Deliverable[];
    packagesTitle: string;
    packages: Package[];
    hiddenPackages: Package[];
    termsTitle: string;
    termsText: string;
  };
  value: {
    sectionLabel: string;
    title: string;
    pillars: { title: string; description: string }[];
    hiddenPillars: { title: string; description: string }[];
    differentiatorsTitle: string;
    differentiators: { title: string; description: string }[];
    hiddenDifferentiators: { title: string; description: string }[];
  };
  contact: {
    sectionLabel: string;
    title: string;
    conversationTitle: string;
    intro: string;
    email: string;
    location: string;
    website: string;
    nextStepsTitle: string;
    nextSteps: { title: string; description: string }[];
    ctaButton: string;
    academyTitle: string;
    academyText: string;
  };
  shapes: Record<string, ShapeConfig>;
}

// Minimal fallback content
const fallbackContent: ProposalContent = {
  cover: {
    tagline: "Loading...",
    title: "Loading content...",
    subtitle: "",
    date: getCurrentDateFormatted(),
    company: "Loading...",
    email: "",
  },
  letter: {
    date: getCurrentDateFullFormatted(),
    salutation: "",
    paragraphs: ["Please wait while we load your content..."],
    closing: "",
    signature: "",
    footer: "",
  },
  about: {
    sectionLabel: "",
    title: "",
    intro: "",
    stats: [],
    expertiseTitle: "",
    expertiseText: "",
    missionTitle: "",
    missionText: "",
    quote: "",
  },
  howWeWork: {
    sectionLabel: "",
    title: "",
    steps: [],
    collaborativeTitle: "",
    collaborativeText: "",
  },
  solutions: {
    sectionLabel: "",
    title: "",
    services: [],
    integratedTitle: "",
    integratedText: "",
  },
  markets: {
    sectionLabel: "",
    title: "",
    segments: [],
    crossFunctionalTitle: "",
    crossFunctionalText: "",
  },
  clients: {
    sectionLabel: "",
    title: "",
    intro: "",
    clientTypes: [],
    tailoredTitle: "",
    tailoredText: "",
  },
  team: {
    sectionLabel: "",
    title: "",
    intro: "",
    members: [],
    collectiveTitle: "",
    collectiveText: "",
  },
  proposal: {
    sectionLabel: "",
    title: "",
    projectTeamTitle: "",
    projectTeam: [],
    scopeTitle: "",
    scopeText: "",
    deliverablesTitle: "",
    deliverables: [],
    hiddenDeliverables: [],
    packagesTitle: "",
    packages: [],
    hiddenPackages: [],
    termsTitle: "",
    termsText: "",
  },
  value: {
    sectionLabel: "",
    title: "",
    pillars: [],
    hiddenPillars: [],
    differentiatorsTitle: "",
    differentiators: [],
    hiddenDifferentiators: [],
  },
  contact: {
    sectionLabel: "",
    title: "",
    conversationTitle: "",
    intro: "",
    email: "",
    location: "",
    website: "",
    nextStepsTitle: "",
    nextSteps: [],
    ctaButton: "",
    academyTitle: "",
    academyText: "",
  },
  shapes: {},
};

// ✅ CALCULATION HELPER FUNCTIONS (EXPORTED)

// Calculate total hours from deliverable
export const calculateDeliverableHours = (deliverable: Deliverable): number => {
  if (deliverable.durationUnit === 'months') {
    const weeks = deliverable.duration * WEEKS_PER_MONTH;
    return Math.round(deliverable.hoursPerPeriod * weeks);
  }
  return deliverable.hoursPerPeriod * deliverable.duration;
};

// Calculate deliverable total cost
export const calculateDeliverableCost = (deliverable: Deliverable): number => {
  return deliverable.rate * calculateDeliverableHours(deliverable);
};

// Helper to calculate price from deliverables
export const calculatePackagePrice = (
  includedDeliverables: string[],
  allDeliverables: Deliverable[]
): number => {
  return includedDeliverables.reduce((total, title) => {
    const deliverable = allDeliverables.find(d => d.title === title);
    if (deliverable) {
      return total + calculateDeliverableCost(deliverable);
    }
    return total;
  }, 0);
};

export const calculatePackageHours = (
  includedDeliverables: string[],
  allDeliverables: Deliverable[]
): number => {
  return includedDeliverables.reduce((total, title) => {
    const deliverable = allDeliverables.find(d => d.title === title);
    if (deliverable) {
      return total + calculateDeliverableHours(deliverable);
    }
    return total;
  }, 0);
};

// Helper to calculate duration in months from deliverables
export const calculatePackageDurationMonths = (
  includedDeliverables: string[],
  allDeliverables: Deliverable[]
): number => {
  let maxMonths = 0;

  includedDeliverables.forEach(title => {
    const deliverable = allDeliverables.find(d => d.title === title);
    if (deliverable) {
      let months: number;
      if (deliverable.durationUnit === 'months') {
        months = deliverable.duration;
      } else {
        months = deliverable.duration / WEEKS_PER_MONTH;
      }
      maxMonths = Math.max(maxMonths, months);
    }
  });

  return Math.ceil(maxMonths) || 1;
};

// Format price as currency
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export interface SavedProposal {
  id: string;
  name: string;
  clientName: string;
  savedAt: string;
  content: ProposalContent;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdBy?: string;
}

interface ProposalContextType {
  content: ProposalContent;
  updateContent: <K extends keyof ProposalContent>(section: K, data: Partial<ProposalContent[K]>) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  resetContent: () => void;
  currentProposalUuid: string | null;
  setCurrentProposalUuid: (uuid: string | null) => void;
  currentProposalVersion: number;
  setCurrentProposalVersion: (version: number) => void;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  loadSiteContent: () => Promise<void>;
  getContent: () => ProposalContent;
}

const ProposalContentContext = createContext<ProposalContextType | undefined>(undefined);

interface ProposalContentProviderProps {
  children: ReactNode;
  initialContent?: ProposalContent;
  readOnly?: boolean ;
  proposalId?: string;
}

export const ProposalContentProvider = ({
  children,
  initialContent,
  readOnly = false,
  proposalId
}: ProposalContentProviderProps) => {
  const [content, setContent] = useState<ProposalContent>(initialContent || fallbackContent);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProposalUuid, setCurrentProposalUuid] = useState<string | null>(proposalId || null);
  const [currentProposalVersion, setCurrentProposalVersion] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(!initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const contentRef = useRef<ProposalContent>(content);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const getContent = useCallback(() => {
    return contentRef.current;
  }, []);

  useEffect(() => {
    if (!initialContent) {
      loadSiteContent();
    }
  }, []);

  // ✅ UPDATED: Load from individual columns
  const loadSiteContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Loading site content from Supabase...');
      const startTime = Date.now();

      const { data, error: fetchError } = await supabase
        .from('site_content')
        .select('*') // ✅ Select all columns
        .eq('is_active', true)
        .eq('content_type', 'proposal')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const loadTime = Date.now() - startTime;
      console.log(`⏱️ Load time: ${loadTime}ms`);

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        throw fetchError;
      }

      if (data) {
    
        const siteContent: ProposalContent = {
          cover: data.cover || fallbackContent.cover,
          letter: data.letter || fallbackContent.letter,
          about: data.about || fallbackContent.about,
          howWeWork: data.how_we_work || fallbackContent.howWeWork,
          solutions: data.solutions || fallbackContent.solutions,
          markets: data.markets || fallbackContent.markets,
          clients: data.clients || fallbackContent.clients,
          team: data.team || fallbackContent.team,
          proposal: data.proposal || fallbackContent.proposal,
          value: data.value || fallbackContent.value,
          contact: data.contact || fallbackContent.contact,
          shapes: data.shapes || fallbackContent.shapes,
        };

        const contentWithDates: ProposalContent = {
          ...siteContent,
          cover: {
            ...siteContent.cover,
            date: getCurrentDateFormatted(),
          },
          letter: {
            ...siteContent.letter,
            date: getCurrentDateFullFormatted(),
          },
        };

        setContent(contentWithDates);
        console.log('✅ Site content loaded from Supabase');
      } else {
        console.warn('⚠️ No default content found, using fallback');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load site content';
      setError(errorMessage);
      console.error('❌ Error loading site content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ UPDATED: Auto-save to individual columns
  const autoSaveToDatabase = useCallback(
    debounce(async (contentToSave: ProposalContent, uuid: string, version: number) => {
      if (!autoSaveEnabled || readOnly) return;

      try {
        setSaveStatus('saving');
        setIsSaving(true);
        console.log('🔄 Auto-saving to Supabase...', uuid);

        const newVersion = version + 1;

        // ✅ Save each section to its own column
        const { error } = await supabase
          .from("site_content")
          .update({
            cover: contentToSave.cover,
            letter: contentToSave.letter,
            about: contentToSave.about,
            how_we_work: contentToSave.howWeWork,
            solutions: contentToSave.solutions,
            markets: contentToSave.markets,
            clients: contentToSave.clients,
            team: contentToSave.team,
            proposal: contentToSave.proposal,
            value: contentToSave.value,
            contact: contentToSave.contact,
            shapes: contentToSave.shapes,
            version: newVersion,
            updated_at: new Date().toISOString()
          })
          .eq("id", uuid);

        if (error) {
          console.error('❌ Auto-save failed:', error);
          setSaveStatus('error');
          return;
        }

        console.log('✅ Auto-saved successfully! Version:', newVersion);
        setCurrentProposalVersion(newVersion);
        setSaveStatus('saved');
        setLastSaved(new Date());

        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('❌ Auto-save error:', error);
        setSaveStatus('error');
      } finally {
        setIsSaving(false);
      }
    }, 2000),
    [autoSaveEnabled, readOnly]
  );

const updateContent = useCallback(<K extends keyof ProposalContent>(
    section: K,
    data: Partial<ProposalContent[K]>
  ) => {
    console.log('🔥 UPDATECONTENT ENTERED!', { section, data, readOnly });
    
    if (readOnly) {
      console.log('❌ BLOCKED: readOnly is true!');
      return;
    }

    console.log('✅ PASSED readOnly check, updating state...');
    console.log('section ,', section, data);
    
    setContent(prev => {
      console.log('🔥 setContent executing...');
      const newContent = {
        ...prev,
        [section]: { ...prev[section], ...data },
      };
      console.log('✅ New content created:', newContent[section]);
      return newContent;
    });
  }, [readOnly, currentProposalUuid, currentProposalVersion, autoSaveEnabled, autoSaveToDatabase]);

  const resetContent = async () => {
    await loadSiteContent();
    setCurrentProposalUuid(null);
    setCurrentProposalVersion(1);
    setLastSaved(null);
    setSaveStatus('idle');
  };

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ProposalContentContext.Provider value={{
      content,
      updateContent,
      isEditMode,
      setIsEditMode,
      resetContent,
      currentProposalUuid,
      setCurrentProposalUuid,
      currentProposalVersion,
      setCurrentProposalVersion,
      isLoading,
      isSaving,
      error,
      lastSaved,
      autoSaveEnabled,
      setAutoSaveEnabled,
      saveStatus,
      loadSiteContent,
      getContent,
    }}>
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