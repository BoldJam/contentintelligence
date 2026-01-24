export interface Paper {
    id: string;
    title: string;
    authors: string; // "First Author et al."
    fullAuthors?: string[]; // All author names
    year: number;
    abstract?: string;
    citationCount?: number;
    venue?: string;
    doi?: string;
    badges: Badge[];
    // Enhanced metadata from Semantic Scholar
    tldr?: { text: string; model: string };
    influentialCitationCount?: number;
    s2FieldsOfStudy?: Array<{ category: string; source: string }>;
    externalIds?: { DOI?: string; PubMed?: string; ArXiv?: string };
    publicationDate?: string;
    journal?: { name?: string; volume?: string; pages?: string };
    sourceType?: 'paper' | 'text' | 'audio' | 'image' | 'note' | 'video';
    isMock?: boolean;
}

export interface Badge {
    id: string;
    label: string;
    color: string;
    icon: string;
}

export interface SummaryData {
    title: string;
    summary: string;
    questions: string[];
}
