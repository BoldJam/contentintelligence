import type { Paper, SummaryData } from './paper';

export interface GeneratedContent {
    id: string;
    title: string;
    type: 'text' | 'image' | 'audio' | 'video' | 'note';
    format?: string;
    content?: string;
    createdAt: Date;
    isLoading: boolean;
    complianceStatus?: 'Draft' | 'Review' | 'Approved';
}

export interface Project {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    searchQuery: string;
    importedPapers: Paper[];
    summaryData: SummaryData | null;
    generatedContent: GeneratedContent[];
}

export interface ProjectMetadata {
    id: string;
    title: string;
    updatedAt: number;
    paperCount: number;
}
