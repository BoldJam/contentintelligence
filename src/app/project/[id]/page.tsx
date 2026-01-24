'use client';

import { motion } from 'framer-motion';
import {
    ArrowLeft, Share2, Settings, MoreVertical, Plus, Search,
    Globe, Zap, Upload, Mic, Video, FileText, Layout, Layers,
    CreditCard, PieChart, ArrowRight, PanelLeftClose, PanelRightClose, ChevronDown, HardDrive, Loader2, Sparkles, Users, TrendingUp, Pencil, Image, ShieldCheck, ClipboardCheck, Youtube
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/lib/productContext';
import AddSourcesModal from '@/components/AddSourcesModal';
import StudioModal from '@/components/StudioModal';
import CustomizeTextModal from '@/components/CustomizeTextModal';
import CustomizeAudioModal from '@/components/CustomizeAudioModal';
import CustomizeImageModal from '@/components/CustomizeImageModal';
import ContentGenerated from '@/components/ContentGenerated';
import TextContentDetails from '@/components/TextContentDetails';
import LanguageSelector from '@/components/LanguageSelector';
import PapersFetched from '@/components/PapersFetched';
import SelectedPapers from '@/components/SelectedPapers';
import PaperDetails from '@/components/PaperDetails';
import type { Paper, SummaryData } from '@/types/paper';
import ChatInterface from '@/components/ChatInterface';
import { loadProject, saveProject, createNewProject } from '@/lib/projectStorage';
import type { Project, GeneratedContent } from '@/types/project';
import ProductSwitcher from '@/components/ProductSwitcher';

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const { currentProduct, theme } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [projectTitle, setProjectTitle] = useState('Untitled notebook');
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [isAddSourcesOpen, setIsAddSourcesOpen] = useState(false);
    const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
    const [isCustomizeTextOpen, setIsCustomizeTextOpen] = useState(false);
    const [isCustomizeAudioOpen, setIsCustomizeAudioOpen] = useState(false);
    const [isCustomizeImageOpen, setIsCustomizeImageOpen] = useState(false);
    const [selectedStudioTool, setSelectedStudioTool] = useState<string>('');
    const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
    const [isResearchTypeDropdownOpen, setIsResearchTypeDropdownOpen] = useState(false);
    const [selectedSource, setSelectedSource] = useState('VeriSci');
    const [selectedResearchType, setSelectedResearchType] = useState('Deep Research');
    const [isResearching, setIsResearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fetchedPapers, setFetchedPapers] = useState<Paper[]>([]);
    const [importedPapers, setImportedPapers] = useState<Paper[] | null>(null);
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [isPapersExpanded, setIsPapersExpanded] = useState(false);
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
    const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
    const isCreatingProject = useRef(false);
    const searchInputRef = useRef<HTMLTextAreaElement>(null);

    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    // Mock summary generator based on papers
    const generateDynamicSummary = (papers: Paper[]) => {
        if (papers.length === 0) {
            return {
                title: "No sources",
                summary: "Add research reports or video transcripts to generate a synthesized intelligence report.",
                questions: ["How do I add sources?", "What can the assistant do?"]
            };
        }

        if (!isFundBuzz) {
            return {
                title: papers.length > 1 ? `Synthesis: ${papers.length} Sources` : papers[0].title,
                summary: `We've synthesized the ${papers.length} imported research paper(s). The collection focuses on correlated trends across your library, providing a unified view of the current investigative landscape.`,
                questions: ["What are the key findings?", "How does this relate to previous work?"]
            };
        }

        const titles = papers.map(p => p.title).join(", ");
        const websiteCount = papers.filter(p => p.sourceType === 'text').length;
        const videoCount = papers.filter(p => p.sourceType === 'video').length;

        // Logic to customize based on common keywords in my mocks
        let focus = "investment intelligence and portfolio trends";
        let questions = [
            `How do the findings in "${papers[0]?.title || 'these sources'}" impact our Q2 strategy?`,
            "What are the top 3 compliance-safe marketing hooks we can extract?",
            "Can we consolidate these trends into a single LinkedIn thread?"
        ];

        if (titles.includes("ESG")) {
            focus = "ESG integration and sustainable impact";
            questions = [
                "What are the primary compliance risks identified in the ESG disclosures?",
                "How do these sustainability metrics compare to our current green fund narrative?",
                "Extract 3 key 'Impact' proof points for our investor marketing deck."
            ];
        } else if (titles.includes("AI")) {
            focus = "AI-driven active management and technology shifts";
            questions = [
                "What are the ethical concerns regarding 'Alpha' generation via LLMs?",
                "Does the reporting suggest high-frequency trading is stabilizing or adding volatility?",
                "Summarize the impact of AI on mutual fund expense ratios for a client summary."
            ];
        } else if (titles.includes("Bond") || titles.includes("Yield")) {
            focus = "fixed-income yields and market resilience";
            questions = [
                "Position these 10-year yield highs as an opportunity for retail investors.",
                "How do these bond yields affect our 'Staying Power' narrative?",
                "What are the primary interest rate risks identified for short-duration bonds?"
            ];
        }

        const summarizedSourceText = papers.length > 1
            ? `Synthesizing intelligence from ${websiteCount} report(s) and ${videoCount} video transcript(s), this unified analysis highlights a critical pivot towards ${focus}. ${papers[0].title} and related sources suggest that current market sentiment for 2026 is increasingly prioritizing institutional resilience; by correlating cross-platform benchmarks—including specific fund performance metrics and expert video insights—we identify a 12% shift in retail interest toward specialized sectors, necessitating immediate message alignment in our upcoming marketing collateral.`
            : `Our analysis of ${papers[0].title} reveals a concentrated focus on ${focus}. The data suggests that current market sentiment for 2026 is pivoting towards institutional resilience. Key benchmarks found in your source highlight a 12% shift in retail interest towards specialized fund sectors, providing critical insights for tailoring your upcoming marketing assets and ensuring message alignment with documented fund performance.`;

        return {
            title: papers.length > 1 ? `Synthesis: ${papers.length} Sources Analyzed` : `Intelligence Report: ${papers[0].title}`,
            summary: summarizedSourceText,
            questions: questions
        };
    };

    // Load project on mount
    useEffect(() => {
        if (projectId === 'new') {
            // Prevent double creation in Strict Mode
            if (isCreatingProject.current) return;
            isCreatingProject.current = true;

            // Create a new project and redirect to its ID
            const newProject = createNewProject();
            router.replace(`/project/${newProject.id}`);
        } else {
            // Load existing project
            const loaded = loadProject(projectId);
            if (loaded) {
                setProject(loaded);
                setProjectTitle(loaded.title);
                setSearchQuery(loaded.searchQuery);
                setImportedPapers(loaded.importedPapers.length > 0 ? loaded.importedPapers : null);
                setSummaryData(loaded.summaryData);
                setGeneratedContent(loaded.generatedContent || []);
            } else {
                // Project doesn't exist, redirect to dashboard
                router.replace('/dashboard');
            }
        }
    }, [projectId, router]);

    // Auto-save project when data changes
    useEffect(() => {
        if (project && projectId !== 'new') {
            const updatedProject: Project = {
                ...project,
                title: projectTitle,
                searchQuery,
                importedPapers: importedPapers || [],
                summaryData,
                generatedContent,
            };
            saveProject(updatedProject);
        }
    }, [project, projectId, projectTitle, searchQuery, importedPapers, summaryData, generatedContent]);

    const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const query = e.currentTarget.value.trim();
            if (!query) return;

            setSearchQuery(query);
            setIsResearching(true);
            setShowResults(false);
            setIsPapersExpanded(false); // Reset expansion on new search

            try {
                const response = await fetch('/api/search-papers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, limit: 6 }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 429) {
                        alert('Rate limit exceeded. Please wait a moment and try again.');
                    } else {
                        alert(`Failed to search papers: ${errorData.error || 'Unknown error'}`);
                    }
                    return;
                }

                const { papers } = await response.json();
                setFetchedPapers(papers);
                setShowResults(true);
            } catch (error) {
                console.error('Error fetching papers:', error);
                alert('Failed to search papers. Please check your internet connection and try again.');
            } finally {
                setIsResearching(false);
            }
        }
    };

    const handleTriggerSummaryRegeneration = async (papers: Paper[]) => {
        setIsGeneratingSummary(true);
        // Simulate "AI thinking" delay
        setTimeout(() => {
            const newSummary = generateDynamicSummary(papers);
            setSummaryData(newSummary);
            setIsGeneratingSummary(false);
        }, 1500);
    };

    const handleImport = async (selectedPapers: Paper[]) => {
        const current = importedPapers || [];
        const newPapers = selectedPapers.filter(p => !current.some(existing => existing.id === p.id));
        const allPapers = [...current, ...newPapers];

        setImportedPapers(allPapers);
        setShowResults(false);
        setIsPapersExpanded(false);

        handleTriggerSummaryRegeneration(allPapers);
    };

    const handlePaperClick = (paper: Paper) => {
        setSelectedPaper(paper);
    };

    const handleBackFromDetails = () => {
        setSelectedPaper(null);
    };

    const handleRemovePaper = async (paperId: string) => {
        if (!importedPapers) return;

        const updatedPapers = importedPapers.filter(p => p.id !== paperId);
        setImportedPapers(updatedPapers);

        if (updatedPapers.length === 0) {
            setSummaryData(null);
            return;
        }

        handleTriggerSummaryRegeneration(updatedPapers);
    };

    // Handle search icon click in collapsed sidebar
    const handleSearchIconClick = () => {
        setLeftPanelCollapsed(false);
        setLeftPanelOpen(true);
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 300); // Wait for animation to complete
    };

    // Handle paper icon click in collapsed sidebar
    const handlePaperIconClick = (paper: Paper) => {
        setLeftPanelCollapsed(false);
        setLeftPanelOpen(true);
        setSelectedPaper(paper);
    };

    const handleSaveToNote = (content: string) => {
        const newItem: GeneratedContent = {
            id: Date.now().toString(),
            title: 'Research Note',
            type: 'note',
            content: content,
            createdAt: new Date(),
            isLoading: false
        };
        setGeneratedContent(prev => [newItem, ...prev]);
    };

    const handleAddToSources = (content: GeneratedContent) => {
        const newPaper: Paper = {
            id: `${content.id}-${Date.now()}`,
            title: content.title,
            authors: "Generated Content",
            year: new Date().getFullYear(),
            abstract: content.content || "",
            badges: [{ id: 'gen', label: 'AI Generated', color: 'bg-green-500/10 text-green-400', icon: 'sparkles' }],
            sourceType: content.type
        };
        const updatedPapers = [newPaper, ...(importedPapers || [])];
        setImportedPapers(updatedPapers);
        handleTriggerSummaryRegeneration(updatedPapers);
    };

    const generateStudioText = (papers: Paper[], format: string, layout: string[], focus: string, boosts: string[]) => {
        const keywords = papers.map(p => p.title).join(' ');
        const mainTopic = papers[0]?.title || 'market trends';

        let content = '';

        // Simple logic to map layout slots to source-based content
        layout.forEach((slot, index) => {
            const cleanSlot = slot.replace(/\[.*?\]/g, '').replace(/Slide \d+:/g, '').trim();

            if (format === 'Thread Pack') {
                if (index === 0) content += `🧵 NEW RESEARCH: Why the consensus on ${mainTopic} is shifting. ${focus ? `Focusing on ${focus}.` : ''}\n\n`;
                else if (index === 1) content += `1/ The numbers don't lie. Data from ${papers.length} sources shows a critical pivot. "Institutional resilience is no longer optional."\n\n`;
                else if (index === 2) content += `2/ Our internal analysis identifies a 12% shift in retail interest. This isn't just a trend; it's a structural realignment. ${boosts.includes('Summarize the core points.') ? 'Synthesizing the core physics here.' : ''}\n\n`;
                else content += `3/ Bottom line: Align your messaging with performance data now to capture this 2026 momentum. 📉\n\n`;
            } else if (format === 'Carousel Copy') {
                content += `SLIDE ${index + 1}: ${cleanSlot}\n`;
                if (index === 0) content += `> Headline: The Future of ${mainTopic}\n\n`;
                else if (index === 1) content += `> Context: Most investors believe the 2026 cycle is fixed. Our library proves otherwise.\n\n`;
                else if (index === 2) content += `> The Data: Correlated benchmarks suggest institutional alpha is migrating to specialized sectors.\n\n`;
                else content += `> Action: Download our full intelligence report via the link in bio. 🚀\n\n`;
            } else if (format === 'Fact Card') {
                content += `${cleanSlot.toUpperCase()}\n`;
                if (index === 0) content += `📊 STAT: 12% increase in retail interest for ${mainTopic} sectors.\n\n`;
                else if (index === 1) content += `🔍 INSIGHT: "Institutional resilience is the lead indicator for 2026 staying power."\n\n`;
                else content += `✅ SOURCE: Cross-correlated transcript analysis from your project library.\n\n`;
            } else {
                content += `- ${cleanSlot}: Analysis of ${mainTopic} suggests unified growth in ${focus || 'current sectors'}.\n`;
            }
        });

        if (boosts.includes('Provide practical takeaways.')) {
            content += `\n💡 PRACTICAL TAKEAWAY: Reposition marketing hooks toward "Algorithm-Driven Active Management" to align with these findings.`;
        }

        return content.trim();
    };

    const handleUpdateContentStatus = (id: string, status: GeneratedContent['complianceStatus']) => {
        setGeneratedContent(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, complianceStatus: status } : item
            );

            // Persist to storage
            if (project) {
                const updatedProject = { ...project, generatedContent: updated };
                saveProject(updatedProject);
            }

            return updated;
        });
    };

    const handleUpdateContentTitle = (id: string, newTitle: string) => {
        setGeneratedContent(prev => {
            const updated = prev.map(item =>
                item.id === id ? { ...item, title: newTitle } : item
            );

            if (project) {
                const updatedProject = { ...project, generatedContent: updated };
                saveProject(updatedProject);
            }

            return updated;
        });
    };

    // Calculate left panel width based on state
    const leftPanelWidth = leftPanelCollapsed
        ? 64
        : (selectedPaper || isPapersExpanded) ? 624 : 480; // 64px collapsed, 30% wider when showing details or expanded list

    return (
        <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
            {/* Add Sources Modal */}
            <AddSourcesModal
                isOpen={isAddSourcesOpen}
                onClose={() => setIsAddSourcesOpen(false)}
                currentSourceCount={importedPapers?.length || 0}
                onAddSource={(source) => {
                    const updatedPapers = [source, ...(importedPapers || [])];
                    setImportedPapers(updatedPapers);
                    handleTriggerSummaryRegeneration(updatedPapers);
                }}
            />
            {/* Studio Modal */}
            <StudioModal
                isOpen={isStudioModalOpen}
                onClose={() => setIsStudioModalOpen(false)}
                title={selectedStudioTool}
            />
            {/* Customize Text Modal */}
            <CustomizeTextModal
                isOpen={isCustomizeTextOpen}
                onClose={() => setIsCustomizeTextOpen(false)}
                onGenerate={(title, format, layout, focus, boosts) => {
                    const tempTitle = title || `${format} - ${importedPapers?.[0]?.title.substring(0, 30)}...`;
                    const newItem: GeneratedContent = {
                        id: Date.now().toString(),
                        title: tempTitle,
                        type: 'text',
                        format: format,
                        createdAt: new Date(),
                        isLoading: true,
                        complianceStatus: 'Draft'
                    };
                    setGeneratedContent(prev => [newItem, ...prev]);

                    // Simulate generation
                    setTimeout(() => {
                        const generatedText = generateStudioText(importedPapers || [], format, layout, focus, boosts);
                        // Generate a more concise title based on content
                        const conciseTitle = `${format.split(' ')[0]} - ${focus ? focus.substring(0, 15) : (importedPapers?.[0]?.title.substring(0, 20) || 'Market Analysis')}`;

                        setGeneratedContent(prev =>
                            prev.map(item =>
                                item.id === newItem.id
                                    ? { ...item, title: conciseTitle, content: generatedText, isLoading: false }
                                    : item
                            )
                        );
                    }, 2500);
                }}
            />
            {/* Customize Audio Modal */}
            <CustomizeAudioModal
                isOpen={isCustomizeAudioOpen}
                onClose={() => setIsCustomizeAudioOpen(false)}
                onGenerate={(title, voice) => {
                    const newItem: GeneratedContent = {
                        id: Date.now().toString(),
                        title: title,
                        type: 'audio',
                        format: voice,
                        createdAt: new Date(),
                        isLoading: true
                    };
                    setGeneratedContent(prev => [newItem, ...prev]);

                    // Simulate loading for 3 seconds
                    setTimeout(() => {
                        setGeneratedContent(prev =>
                            prev.map(item =>
                                item.id === newItem.id
                                    ? { ...item, isLoading: false }
                                    : item
                            )
                        );
                    }, 3000);
                }}
            />
            {/* Customize Image Modal */}
            <CustomizeImageModal
                isOpen={isCustomizeImageOpen}
                onClose={() => setIsCustomizeImageOpen(false)}
                onGenerate={(title, style) => {
                    const newItem: GeneratedContent = {
                        id: (Date.now()).toString(),
                        title: title,
                        type: 'image',
                        format: style,
                        createdAt: new Date(),
                        isLoading: true
                    };

                    setGeneratedContent(prev => [newItem, ...prev]);

                    // Simulate loading for 3 seconds
                    setTimeout(() => {
                        setGeneratedContent(prev =>
                            prev.map(item =>
                                newItem.id === item.id
                                    ? { ...item, isLoading: false }
                                    : item
                            )
                        );
                    }, 3000);
                }}
            />
            {/* Header */}
            <header className={`h-14 border-b flex items-center justify-between px-4 z-10 transition-colors ${isFundBuzz ? 'bg-white border-slate-100' : 'bg-slate-900 border-white/10'}`}>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                        <ProductSwitcher />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className={`text-gray-400 ${isFundBuzz ? 'text-slate-400' : ''}`}>/</span>
                        <input
                            type="text"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className={`bg-transparent border-none focus:ring-0 font-medium w-80 rounded px-2 py-1 transition-colors ${isFundBuzz ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/5'}`}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isFundBuzz ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200' : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'}`}>
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                    <button className={`p-2 rounded-full transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/5 text-gray-400'}`}>
                        <Settings className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full ml-2" />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Column: Sources */}
                {/* Left Column: Research Assistant */}
                <motion.div
                    initial={false}
                    animate={{
                        width: leftPanelOpen ? leftPanelWidth : 0,
                        opacity: leftPanelOpen ? 1 : 0,
                        backgroundColor: isFundBuzz && leftPanelOpen && !leftPanelCollapsed ? '#ffffff' : '#0f172a' // White for full Fund Buzz panel
                    }}
                    className={`border-r ${isFundBuzz ? 'border-slate-200' : 'border-white/10'} flex flex-col relative transition-colors duration-300`}
                >
                    {leftPanelCollapsed ? (
                        /* Icon-only Sidebar */
                        <div className={`w-16 h-full flex flex-col py-4 px-3 space-y-4 ${isFundBuzz ? 'bg-white border-r border-slate-200' : 'bg-slate-900'}`}>
                            {/* Expand Button */}
                            <button
                                onClick={() => setLeftPanelCollapsed(false)}
                                className={`p-2.5 rounded-lg transition-colors group relative ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                title="Expand Panel"
                            >
                                <PanelRightClose className="w-5 h-5" />
                            </button>

                            {/* Add Sources Icon - Moved Up */}
                            <button
                                onClick={() => setIsAddSourcesOpen(true)}
                                className={`p-2.5 rounded-lg transition-colors group relative ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                title="Add Sources"
                            >
                                <Plus className="w-5 h-5" />
                            </button>

                            <div className={`border-t ${isFundBuzz ? 'border-slate-200' : 'border-white/10'}`} />

                            {/* Divider for Sources */}
                            {importedPapers && importedPapers.length > 0 && (
                                <div className={`border-t ${isFundBuzz ? 'border-slate-200' : 'border-white/10'} my-2`} />
                            )}

                            {/* Selected Papers Icons */}
                            {importedPapers?.map((paper) => (
                                <button
                                    key={paper.id}
                                    onClick={() => handlePaperIconClick(paper)}
                                    className={`p-2.5 rounded-lg transition-colors group relative ${isFundBuzz ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                                    title={paper.title}
                                >
                                    {paper.sourceType === 'text' ? (
                                        <div className="relative">
                                            <Globe className={`w-5 h-5 ${isFundBuzz ? 'text-black' : 'text-blue-400'}`} />
                                            {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 stroke-[3] text-blue-400 fill-blue-950" />}
                                        </div>
                                    ) : paper.sourceType === 'audio' ? (
                                        <div className="relative">
                                            <Mic className="w-5 h-5 text-pink-500" />
                                            {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-pink-500 absolute -top-1 -right-1 fill-pink-950 stroke-[3]" />}
                                        </div>
                                    ) : paper.sourceType === 'image' ? (
                                        <div className="relative">
                                            <Image className="w-5 h-5 text-purple-500" />
                                            {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-purple-500 absolute -top-1 -right-1 fill-purple-950 stroke-[3]" />}
                                        </div>
                                    ) : paper.sourceType === 'video' ? (
                                        <div className="relative">
                                            <Youtube className={`w-5 h-5 text-red-500`} />
                                            {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-red-500 absolute -top-1 -right-1 fill-red-950 stroke-[3]" />}
                                        </div>
                                    ) : paper.sourceType === 'note' ? (
                                        <div className="relative">
                                            <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />
                                            {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 stroke-[3] text-white fill-slate-900" />}
                                        </div>
                                    ) : (
                                        <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Full Panel Content */
                        <>
                            <div className="p-4 flex items-center justify-between">
                                {currentProduct !== 'fundbuzz' && <h2 className="font-semibold text-gray-200">Cite Sources</h2>}
                                <button onClick={() => setLeftPanelCollapsed(true)} className={`p-1 hover:bg-white/5 rounded text-gray-400 ${currentProduct === 'fundbuzz' ? 'ml-auto' : ''}`}>
                                    <PanelLeftClose className="w-4 h-4" />
                                </button>
                            </div>

                            {selectedPaper ? (
                                selectedPaper.sourceType && ['text', 'audio', 'image', 'note'].includes(selectedPaper.sourceType) ? (
                                    <TextContentDetails
                                        content={{
                                            id: selectedPaper.id,
                                            title: selectedPaper.title,
                                            type: selectedPaper.sourceType as any,
                                            content: selectedPaper.abstract,
                                            createdAt: new Date(),
                                            isLoading: false
                                        }}
                                        onBack={handleBackFromDetails}
                                    />
                                ) : (
                                    <PaperDetails paper={selectedPaper} onBack={handleBackFromDetails} />
                                )
                            ) : (
                                <div className="px-4 pb-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
                                    {currentProduct !== 'fundbuzz' && (
                                        <div className="bg-slate-800 border-2 border-blue-600 rounded-2xl p-4 space-y-4 relative z-20">
                                            <div className="flex gap-3">
                                                <Search className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                                                <textarea
                                                    ref={searchInputRef}
                                                    placeholder="What would you like to research?"
                                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 text-lg p-0 resize-none h-[3.5rem] leading-relaxed"
                                                    onKeyDown={handleSearchKeyDown}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex gap-2 overflow-visible">
                                                    {/* Source Dropdown */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full text-sm font-medium hover:bg-black/40 transition-colors border border-white/10 shrink-0"
                                                        >
                                                            {selectedSource === 'VeriSci' ? <Globe className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
                                                            {selectedSource}
                                                            <ChevronDown className="w-3 h-3 text-gray-400" />
                                                        </button>

                                                        {isSourceDropdownOpen && (
                                                            <div className="absolute top-full left-0 mt-2 w-40 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-30">
                                                                <button
                                                                    onClick={() => { setSelectedSource('VeriSci'); setIsSourceDropdownOpen(false); }}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-sm text-left"
                                                                >
                                                                    <Globe className="w-4 h-4" /> VeriSci
                                                                </button>
                                                                <button
                                                                    onClick={() => { setSelectedSource('Drive'); setIsSourceDropdownOpen(false); }}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-sm text-left"
                                                                >
                                                                    <HardDrive className="w-4 h-4" /> Drive
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Research Type Dropdown */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setIsResearchTypeDropdownOpen(!isResearchTypeDropdownOpen)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full text-sm font-medium hover:bg-black/40 transition-colors border border-white/10 whitespace-nowrap shrink-0"
                                                        >
                                                            <div className="relative">
                                                                <Search className="w-3 h-3 absolute -top-0.5 -left-0.5" />
                                                                <Globe className="w-4 h-4 ml-1" />
                                                            </div>
                                                            {selectedResearchType}
                                                            <ChevronDown className="w-3 h-3 text-gray-400" />
                                                        </button>

                                                        {isResearchTypeDropdownOpen && (
                                                            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-30">
                                                                <button
                                                                    onClick={() => { setSelectedResearchType('Deep Research'); setIsResearchTypeDropdownOpen(false); }}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-sm text-left"
                                                                >
                                                                    <div className="relative">
                                                                        <Search className="w-3 h-3 absolute -top-0.5 -left-0.5" />
                                                                        <Globe className="w-4 h-4 ml-1" />
                                                                    </div>
                                                                    Deep Research
                                                                </button>
                                                                <button
                                                                    onClick={() => { setSelectedResearchType('Fast Research'); setIsResearchTypeDropdownOpen(false); }}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-sm text-left"
                                                                >
                                                                    <Zap className="w-4 h-4" /> Fast Research
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <button className="p-2 bg-slate-900 rounded-full hover:bg-black/40 transition-colors border border-white/10 shrink-0">
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${isFundBuzz
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-lg shadow-blue-500/20 font-semibold'
                                            : 'border border-dashed border-white/20 hover:bg-white/5 text-gray-300'
                                            }`}
                                        onClick={() => setIsAddSourcesOpen(true)}
                                    >
                                        <Plus className="w-4 h-4 text-white" />
                                        <span className="text-white">Add Sources</span>
                                    </button>

                                    {isResearching && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="flex items-center justify-center gap-3 py-4 text-blue-400"
                                        >
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="font-medium">Researching Papers</span>
                                        </motion.div>
                                    )}

                                    {showResults && (
                                        <PapersFetched
                                            papers={fetchedPapers}
                                            onImport={handleImport}
                                            onDelete={() => setShowResults(false)}
                                            onPaperClick={handlePaperClick}
                                            onExpandChange={setIsPapersExpanded}
                                        />
                                    )}

                                    {importedPapers && importedPapers.length > 0 && <SelectedPapers papers={importedPapers} onPaperClick={handlePaperClick} onRemove={handleRemovePaper} />}

                                    {!showResults && !isResearching && (!importedPapers || importedPapers.length === 0) && (
                                        <div className="mt-12 text-center px-4">
                                            <div className="w-12 h-12 mx-auto mb-3 text-gray-600">
                                                <FileText className="w-full h-full opacity-20" />
                                            </div>
                                            <p className="text-gray-500 text-sm">
                                                Add sources to get started with your research
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>

                {/* Toggle Left Panel Button (when closed) */}
                {
                    !leftPanelOpen && (
                        <button
                            onClick={() => setLeftPanelOpen(true)}
                            className="absolute top-20 left-4 z-20 p-2 bg-white/10 backdrop-blur rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <PanelLeftClose className="w-5 h-5 rotate-180" />
                        </button>
                    )
                }

                {/* Middle Panel - Chat */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 flex flex-col min-w-0 min-h-0 relative"
                >
                    <div className={`p-4 border-b flex items-center justify-between shrink-0 ${isFundBuzz ? 'bg-white border-slate-200 shadow-sm z-10' : 'bg-slate-900 border-white/5'}`}>
                        <div className="flex items-center gap-2">
                            <span className={`font-medium ${isFundBuzz ? 'text-slate-900' : 'text-gray-200'}`}>Research Assistant</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${isFundBuzz ? 'border-slate-300 text-slate-400' : 'border-white/20 text-gray-400'}`}>i</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className={`p-1.5 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/5 text-gray-400'}`}>
                                <Settings className="w-4 h-4" />
                            </button>
                            <button className={`p-1.5 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/5 text-gray-400'}`}>
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative min-h-0 overflow-hidden flex flex-col items-center justify-center p-8">
                        {importedPapers && summaryData ? (
                            <ChatInterface
                                selectedPaperCount={importedPapers.length}
                                summaryData={summaryData}
                                onSaveToNote={handleSaveToNote}
                                isLoading={isGeneratingSummary}
                                sourceTitles={importedPapers.map(p => p.title)}
                            />
                        ) : (
                            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                                {/* Central Text */}
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm border border-primary/30">
                                            <img src={theme.logo} alt={`${theme.displayName} Logo`} className="w-8 h-8 object-cover" />
                                        </div>
                                        <h3 className={`text-lg font-bold mb-1 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>{theme.displayName}</h3>
                                        <p className={`text-xs ${isFundBuzz ? 'text-slate-600' : 'text-gray-400'}`}>{currentProduct === 'fundbuzz' ? 'Marketing Research Workspace' : 'Continuous Learning Loop'}</p>
                                    </div>
                                </div>

                                {/* Cycle Circle */}
                                <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />

                                {/* Nodes */}
                                {/* Top: Research Assistant / Add Sources */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-900 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                                        {isFundBuzz ? <Plus className="w-5 h-5 text-blue-600" /> : <Search className="w-5 h-5 text-blue-400" />}
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-blue-900 bg-blue-50 border-blue-200 shadow-sm' : 'text-blue-300 bg-slate-900/80 border-blue-500/20'}`}>
                                        {isFundBuzz ? 'Add Sources' : 'Research Assistant'}
                                    </span>
                                </div>

                                {/* Right: Create Content / Review Material */}
                                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-slate-900 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'}`}>
                                        {isFundBuzz ? <ClipboardCheck className="w-5 h-5 text-purple-600" /> : <FileText className="w-5 h-5 text-purple-400" />}
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-white bg-purple-600 border-purple-500 shadow-sm' : 'text-purple-300 bg-slate-900/80 border-purple-500/20'}`}>
                                        {isFundBuzz ? 'Review Material' : 'Create Content'}
                                    </span>
                                </div>

                                {/* Bottom: Users Engage / Submit Compliance */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-pink-500 shadow-lg shadow-pink-500/20' : 'bg-slate-900 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]'}`}>
                                        {isFundBuzz ? <ShieldCheck className="w-5 h-5 text-pink-600" /> : <Users className="w-5 h-5 text-pink-400" />}
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-white bg-pink-600 border-pink-500 shadow-sm' : 'text-pink-300 bg-slate-900/80 border-pink-500/20'}`}>
                                        {isFundBuzz ? 'Submit Compliance' : 'Users Engage'}
                                    </span>
                                </div>

                                {/* Left: Trend Analysis */}
                                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-900 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'}`}>
                                        <TrendingUp className={`w-5 h-5 ${isFundBuzz ? 'text-green-600' : 'text-green-400'}`} />
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-white bg-green-600 border-green-500 shadow-sm' : 'text-green-300 bg-slate-900/80 border-green-500/20'}`}>Trend Analysis</span>
                                </div>

                                {/* Connecting Arrows (SVG) */}
                                <svg className={`absolute inset-0 w-full h-full pointer-events-none ${isFundBuzz ? 'opacity-90' : 'opacity-30'}`} viewBox="0 0 100 100">
                                    <defs>
                                        <marker
                                            id="arrowhead"
                                            markerWidth="8"
                                            markerHeight="6"
                                            refX="4"
                                            refY="3"
                                            orient="auto"
                                            markerUnits="strokeWidth"
                                        >
                                            <polygon points="0 0, 8 3, 0 6" fill={isFundBuzz ? '#3b82f6' : '#fff'} />
                                        </marker>
                                    </defs>
                                    {/* Top to Right */}
                                    <path d="M 55 10 A 45 45 0 0 1 90 45" fill="none" stroke={isFundBuzz ? '#3b82f6' : '#fff'} strokeWidth={isFundBuzz ? '1.2' : '2'} markerEnd="url(#arrowhead)" />
                                    {/* Right to Bottom */}
                                    <path d="M 90 55 A 45 45 0 0 1 55 90" fill="none" stroke={isFundBuzz ? '#3b82f6' : '#fff'} strokeWidth={isFundBuzz ? '1.2' : '2'} markerEnd="url(#arrowhead)" />
                                    {/* Bottom to Left */}
                                    <path d="M 45 90 A 45 45 0 0 1 10 55" fill="none" stroke={isFundBuzz ? '#3b82f6' : '#fff'} strokeWidth={isFundBuzz ? '1.2' : '2'} markerEnd="url(#arrowhead)" />
                                    {/* Left to Top */}
                                    <path d="M 10 45 A 45 45 0 0 1 45 10" fill="none" stroke={isFundBuzz ? '#3b82f6' : '#fff'} strokeWidth={isFundBuzz ? '1.2' : '2'} markerEnd="url(#arrowhead)" />
                                </svg>
                            </div>
                        )}
                    </div>

                </motion.div>

                {/* Right Column: Studio */}
                <motion.div
                    initial={false}
                    animate={{
                        width: rightPanelOpen ? (selectedContent ? 500 : 384) : 64,
                        opacity: 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`border-l transition-colors duration-300 flex flex-col relative ${isFundBuzz ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}
                >
                    {!rightPanelOpen ? (
                        /* Collapsed Sidebar */
                        <div className="flex flex-col items-center py-4 gap-4 h-full">
                            {/* Expand Button */}
                            <button
                                onClick={() => setRightPanelOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Expand Studio"
                            >
                                <PanelRightClose className="w-5 h-5 rotate-180" />
                            </button>

                            <div className="w-8 h-px bg-white/10" />

                            {/* Tools */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setIsCustomizeTextOpen(true)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
                                    title="Text Studio"
                                >
                                    <div className="relative">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        <Sparkles className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 stroke-[3] ${isFundBuzz ? 'text-blue-500 fill-white' : 'text-blue-400 fill-blue-950'}`} />
                                    </div>
                                </button>
                                <button
                                    onClick={() => setIsCustomizeImageOpen(true)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
                                    title="Image Studio"
                                >
                                    <div className="relative">
                                        <Image className="w-5 h-5 text-orange-500" />
                                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-orange-500 fill-white' : 'text-orange-400 fill-orange-950'}`} />
                                    </div>
                                </button>
                                <button
                                    onClick={() => setIsCustomizeAudioOpen(true)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
                                    title="Audio Studio"
                                >
                                    <div className="relative">
                                        <Mic className="w-5 h-5 text-pink-500" />
                                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-pink-500 fill-white' : 'text-pink-400 fill-pink-950'}`} />
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedStudioTool('Video');
                                        setIsStudioModalOpen(true);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
                                    title="Video Studio"
                                >
                                    <div className="relative">
                                        <Video className="w-5 h-5 text-red-500" />
                                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-red-500 fill-white' : 'text-red-400 fill-red-950'}`} />
                                    </div>
                                </button>
                            </div>

                            {generatedContent.length > 0 && (
                                <>
                                    <div className="w-8 h-px bg-white/10" />

                                    {/* Generated Content Icons */}
                                    <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide w-full items-center pb-4">
                                        {generatedContent.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setSelectedContent(item);
                                                    setRightPanelOpen(true);
                                                }}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
                                                title={item.title}
                                            >
                                                {item.type === 'text' ? (
                                                    <div className="relative">
                                                        <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-blue-500' : 'text-blue-400'}`} />
                                                        <Sparkles className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 stroke-[3] ${isFundBuzz ? 'text-blue-500 fill-white' : 'text-blue-400 fill-blue-950'}`} />
                                                    </div>
                                                ) : item.type === 'audio' ? (
                                                    <div className="relative">
                                                        <Mic className={`w-5 h-5 ${isFundBuzz ? 'text-pink-500' : 'text-pink-400'}`} />
                                                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-pink-500 fill-white' : 'text-pink-400 fill-pink-950'}`} />
                                                    </div>
                                                ) : item.type === 'image' ? (
                                                    <div className="relative">
                                                        <Image className={`w-5 h-5 ${isFundBuzz ? 'text-orange-500' : 'text-orange-400'}`} />
                                                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-orange-500 fill-white' : 'text-orange-400 fill-orange-950'}`} />
                                                    </div>
                                                ) : item.type === 'video' ? (
                                                    <div className="relative">
                                                        <Video className={`w-5 h-5 ${isFundBuzz ? 'text-red-500' : 'text-red-400'}`} />
                                                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-red-500 fill-white' : 'text-red-400 fill-red-950'}`} />
                                                    </div>
                                                ) : item.type === 'note' ? (
                                                    <div className="relative">
                                                        <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />
                                                        <Sparkles className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 stroke-[3] ${isFundBuzz ? 'text-slate-600 fill-white' : 'text-white fill-[#0f172a]'}`} />
                                                    </div>
                                                ) : (
                                                    <FileText className="w-5 h-5 text-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* Expanded Content */
                        selectedContent ? (
                            <TextContentDetails
                                content={selectedContent}
                                onBack={() => setSelectedContent(null)}
                                onUpdateTitle={handleUpdateContentTitle}
                            />
                        ) : (
                            <>
                                {/* Expanded Content Header */}
                                <div className={`p-4 flex items-center justify-between border-b ${isFundBuzz ? 'bg-white border-slate-100 shadow-sm' : ''}`}>
                                    <h2 className={`font-semibold ${isFundBuzz ? 'text-slate-900' : 'text-gray-200'}`}>Studio</h2>
                                    <button onClick={() => setRightPanelOpen(false)} className={`p-1 rounded transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/5 text-gray-400'}`}>
                                        <PanelRightClose className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="px-4 pb-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide pt-4">
                                    {/* Studio Cards */}
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <button
                                            onClick={() => setIsCustomizeTextOpen(true)}
                                            className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-colors gap-2 group ${isFundBuzz ? 'bg-slate-50 border border-slate-100 hover:bg-slate-100' : 'bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className="relative">
                                                <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-blue-500' : 'text-blue-400'}`} />
                                                <Sparkles className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 stroke-[3] ${isFundBuzz ? 'text-blue-500 fill-slate-50 group-hover:fill-slate-100' : 'text-blue-400 fill-blue-950'}`} />
                                            </div>
                                            <span className={`text-xs font-medium ${isFundBuzz ? 'text-slate-700' : ''}`}>Text</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsCustomizeImageOpen(true);
                                            }}
                                            className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-colors gap-2 group ${isFundBuzz ? 'bg-slate-50 border border-slate-100 hover:bg-slate-100' : 'bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className="relative">
                                                <Image className={`w-5 h-5 ${isFundBuzz ? 'text-orange-500' : 'text-orange-400'}`} />
                                                <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-orange-500 fill-slate-50 group-hover:fill-slate-100' : 'text-orange-400 fill-orange-950'}`} />
                                            </div>
                                            <span className={`text-xs font-medium ${isFundBuzz ? 'text-slate-700' : ''}`}>Image</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                setIsCustomizeAudioOpen(true);
                                            }}
                                            className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-colors gap-2 group ${isFundBuzz ? 'bg-slate-50 border border-slate-100 hover:bg-slate-100' : 'bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className="relative">
                                                <Mic className={`w-5 h-5 ${isFundBuzz ? 'text-pink-500' : 'text-pink-400'}`} />
                                                <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-pink-500 fill-slate-50 group-hover:fill-slate-100' : 'text-pink-400 fill-pink-950'}`} />
                                            </div>
                                            <span className={`text-xs font-medium ${isFundBuzz ? 'text-slate-700' : ''}`}>Audio</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedStudioTool('Video');
                                                setIsStudioModalOpen(true);
                                            }}
                                            className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-colors gap-2 group ${isFundBuzz ? 'bg-slate-50 border border-slate-100 hover:bg-slate-100' : 'bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className="relative">
                                                <Video className={`w-5 h-5 ${isFundBuzz ? 'text-red-500' : 'text-red-400'}`} />
                                                <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-red-500 fill-slate-50 group-hover:fill-slate-100' : 'text-red-400 fill-red-950'}`} />
                                            </div>
                                            <span className={`text-xs font-medium ${isFundBuzz ? 'text-slate-700' : ''}`}>Video</span>
                                        </button>
                                    </div>

                                    {/* Divider after Studio */}
                                    <div className={`border-t mx-4 ${isFundBuzz ? 'border-slate-100' : 'border-white/10'}`}></div>

                                    {/* Generated Content Section */}
                                    {generatedContent.length > 0 && (
                                        <div className="p-4 pb-2">
                                            <h2 className={`font-semibold ${isFundBuzz ? 'text-slate-900' : 'text-gray-200'}`}>Generated Content</h2>
                                        </div>
                                    )}

                                    <div className="px-4 pb-4">
                                        <ContentGenerated
                                            items={generatedContent}
                                            onDelete={(id) => {
                                                setGeneratedContent(prev => prev.filter(item => item.id !== id));
                                            }}
                                            onSelect={(content) => setSelectedContent(content)}
                                            onAddToSources={handleAddToSources}
                                            onUpdateStatus={handleUpdateContentStatus}
                                        />
                                    </div>

                                    {/* Empty State - Only show when no content generated */}
                                    {generatedContent.length === 0 && (
                                        <div className="mt-12 text-center px-4">
                                            <div className="w-8 h-8 mx-auto mb-3 text-gray-600">
                                                <Zap className="w-full h-full opacity-20" />
                                            </div>
                                            <p className="text-xs text-gray-500 mb-1">Studio output will be saved here.</p>
                                            <p className="text-[10px] text-gray-600">After adding sources, click to add Audio Overview, study guide, mind map and more!</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    )}
                </motion.div>

            </div >
        </div >
    );
}
