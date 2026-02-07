'use client';

import { motion } from 'framer-motion';
import {
    Share2, Settings, MoreVertical, Plus,
    Zap, Mic, Video, FileText,
    PanelLeftClose, PanelRightClose, Sparkles, Users, Pencil, Image, ShieldCheck, Youtube
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
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
import SelectedSources from '@/components/SelectedSources';
import SourceDetails from '@/components/SourceDetails';
import type { Source, SummaryData } from '@/types/source';
import ChatInterface from '@/components/ChatInterface';
import { loadProject, saveProject, createNewProject, addSource as addSourceAPI, checkSourceStatus } from '@/lib/projectStorage';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [sources, setSources] = useState<Source[] | null>(null);
    const [selectedSource, setSelectedSource] = useState<Source | null>(null);
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
    const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
    const isCreatingProject = useRef(false);
    const pollingTimers = useRef<Record<string, NodeJS.Timeout>>({});

    // Derive summaryData from sources (no separate state needed)
    const summaryData: SummaryData | null = (() => {
        if (!sources || sources.length === 0) return null;

        const completedSources = sources.filter(s => s.summary);
        const processingSources = sources.filter(s => s.processingStatus === 'processing');

        if (completedSources.length === 0 && processingSources.length > 0) {
            return {
                title: 'Processing Sources...',
                summary: `${processingSources.length} source(s) are being processed by AI. Summaries will appear here once complete.`,
                questions: [],
            };
        }

        if (completedSources.length === 0) {
            return {
                title: sources.length > 1 ? `${sources.length} Sources Added` : sources[0].title,
                summary: 'Source summaries are not yet available.',
                questions: [],
            };
        }

        // Build summary from individual source summaries
        const summary = completedSources
            .map(s => `**${s.title}**\n${s.summary}`)
            .join('\n\n---\n\n');

        return {
            title: completedSources.length > 1
                ? `Synthesis: ${completedSources.length} Sources Analyzed`
                : `Intelligence Report: ${completedSources[0].title}`,
            summary,
            questions: [
                `How do the findings in "${completedSources[0]?.title}" impact our strategy?`,
                'What are the key compliance considerations?',
                'What marketing hooks can we extract from this research?',
            ],
        };
    })();

    const isGeneratingSummary = sources?.some(s => s.processingStatus === 'processing') ?? false;

    // Poll for source processing status
    const startPolling = useCallback((sourceId: string) => {
        // Clear any existing timer for this source
        if (pollingTimers.current[sourceId]) {
            clearInterval(pollingTimers.current[sourceId]);
        }

        pollingTimers.current[sourceId] = setInterval(async () => {
            try {
                const updated = await checkSourceStatus(projectId, sourceId);
                if (updated.processingStatus === 'completed' || updated.processingStatus === 'failed') {
                    clearInterval(pollingTimers.current[sourceId]);
                    delete pollingTimers.current[sourceId];
                }
                // Update the source in state
                setSources(prev => {
                    if (!prev) return prev;
                    return prev.map(s => s.id === sourceId ? updated : s);
                });
            } catch (error) {
                console.error('Polling error:', error);
                clearInterval(pollingTimers.current[sourceId]);
                delete pollingTimers.current[sourceId];
            }
        }, 3000);
    }, [projectId]);

    // Clean up polling on unmount
    useEffect(() => {
        const timers = pollingTimers.current;
        return () => {
            Object.values(timers).forEach(clearInterval);
        };
    }, []);

    // Load project on mount
    useEffect(() => {
        const init = async () => {
            if (projectId === 'new') {
                if (isCreatingProject.current) return;
                isCreatingProject.current = true;
                const newProject = await createNewProject();
                router.replace(`/project/${newProject.id}`);
            } else {
                const loaded = await loadProject(projectId);
                if (loaded) {
                    setProject(loaded);
                    setProjectTitle(loaded.title);
                    setSearchQuery(loaded.searchQuery);
                    setSources(loaded.sources.length > 0 ? loaded.sources : null);
                    setGeneratedContent(loaded.generatedContent || []);

                    // Resume polling for any sources still processing
                    loaded.sources
                        .filter(s => s.processingStatus === 'processing')
                        .forEach(s => startPolling(s.id));
                } else {
                    router.replace('/dashboard');
                }
            }
        };
        init();
    }, [projectId, router, startPolling]);

    // Auto-save project when data changes (debounced)
    // Sources are managed via their own API — do NOT include them here
    useEffect(() => {
        if (!project || projectId === 'new') return;

        const timeout = setTimeout(() => {
            const updatedProject: Project = {
                ...project,
                title: projectTitle,
                searchQuery,
                sources: [],
                summaryData: null,
                generatedContent,
            };
            saveProject(updatedProject);
        }, 500);

        return () => clearTimeout(timeout);
    }, [project, projectId, projectTitle, searchQuery, generatedContent]);

    // Add a source via the API and start polling
    const handleAddSource = async (input: { url: string; type: string; title: string }) => {
        try {
            const source = await addSourceAPI(projectId, input);
            setSources(prev => [source, ...(prev || [])]);

            // Start polling if the source is being processed
            if (source.processingStatus === 'processing') {
                startPolling(source.id);
            }
        } catch (error) {
            console.error('Failed to add source:', error);
        }
    };

    const handleSourceClick = (source: Source) => {
        setSelectedSource(source);
    };

    const handleBackFromDetails = () => {
        setSelectedSource(null);
    };

    const handleRemoveSource = async (sourceId: string) => {
        if (!sources) return;
        // Stop polling if active
        if (pollingTimers.current[sourceId]) {
            clearInterval(pollingTimers.current[sourceId]);
            delete pollingTimers.current[sourceId];
        }
        const updatedSources = sources.filter(s => s.id !== sourceId);
        setSources(updatedSources.length > 0 ? updatedSources : null);
    };

    const handleSourceIconClick = (source: Source) => {
        setLeftPanelCollapsed(false);
        setLeftPanelOpen(true);
        setSelectedSource(source);
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
        const newSource: Source = {
            id: `${content.id}-${Date.now()}`,
            title: content.title,
            authors: "Generated Content",
            year: new Date().getFullYear(),
            type: content.type as Source['type'],
            content: content.content,
            processingStatus: 'completed',
            metadata: {},
            createdAt: new Date(),
        };
        setSources(prev => [newSource, ...(prev || [])]);
    };

    const generateStudioText = (srcList: Source[], format: string, layout: string[], focus: string, boosts: string[]) => {
        const mainTopic = srcList[0]?.title || 'market trends';

        let content = '';

        layout.forEach((slot, index) => {
            const cleanSlot = slot.replace(/\[.*?\]/g, '').replace(/Slide \d+:/g, '').trim();

            if (format === 'Thread Pack') {
                if (index === 0) content += `🧵 NEW RESEARCH: Why the consensus on ${mainTopic} is shifting. ${focus ? `Focusing on ${focus}.` : ''}\n\n`;
                else if (index === 1) content += `1/ The numbers don't lie. Data from ${srcList.length} sources shows a critical pivot. "Institutional resilience is no longer optional."\n\n`;
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
        setGeneratedContent(prev =>
            prev.map(item =>
                item.id === id ? { ...item, complianceStatus: status } : item
            )
        );
    };

    const handleUpdateContentTitle = (id: string, newTitle: string) => {
        setGeneratedContent(prev =>
            prev.map(item =>
                item.id === id ? { ...item, title: newTitle } : item
            )
        );
    };

    // Calculate left panel width based on state
    const leftPanelWidth = leftPanelCollapsed
        ? 64
        : selectedSource ? 500 : 384;

    return (
        <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
            {/* Add Sources Modal */}
            <AddSourcesModal
                isOpen={isAddSourcesOpen}
                onClose={() => setIsAddSourcesOpen(false)}
                currentSourceCount={sources?.length || 0}
                onAddSource={handleAddSource}
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
                    const tempTitle = title || `${sources?.[0]?.title.substring(0, 35)}...`;
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

                    setTimeout(() => {
                        const generatedText = generateStudioText(sources || [], format, layout, focus, boosts);
                        const conciseTitle = focus ? (focus.charAt(0).toUpperCase() + focus.slice(1).substring(0, 35)) : (sources?.[0]?.title.substring(0, 35) || 'Market Analysis');

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
            <header className={`h-16 border-b flex items-center justify-between px-6 z-10 transition-colors bg-[#0f172a] border-white/10`}>
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                        <ProductSwitcher />
                    </Link>

                    <div className="h-6 w-px bg-white/10" />

                    <nav className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <span className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                My projects
                            </span>
                        </Link>

                        <span className="text-slate-600">/</span>

                        <div className="flex items-center gap-2 group">
                            <input
                                type="text"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 font-medium text-white px-0 py-0 w-[300px] placeholder-gray-500 focus:bg-white/5 rounded transition-colors"
                            />
                            <Pencil className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white/5 hover:bg-white/10 text-white border border-white/5">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                    <button className="p-2 rounded-full transition-colors hover:bg-white/5 text-gray-400">
                        <Settings className="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 bg-[#0f172a] rounded-full ml-2 border-2 border-orange-500 flex items-center justify-center text-xs text-orange-500 font-semibold" title="Huong Totten">
                        HT
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Column: Sources */}
                <motion.div
                    initial={false}
                    animate={{
                        width: leftPanelOpen ? leftPanelWidth : 0,
                        opacity: leftPanelOpen ? 1 : 0,
                        backgroundColor: isFundBuzz && leftPanelOpen && !leftPanelCollapsed ? '#ffffff' : '#0f172a'
                    }}
                    className={`border-r ${isFundBuzz ? 'border-slate-200' : 'border-white/10'} flex flex-col relative transition-colors duration-300`}
                >
                    {leftPanelCollapsed ? (
                        /* Icon-only Sidebar */
                        <div className={`w-16 h-full flex flex-col py-4 px-3 space-y-4 ${isFundBuzz ? 'bg-white border-r border-slate-200' : 'bg-slate-900'}`}>
                            <button
                                onClick={() => setLeftPanelCollapsed(false)}
                                className={`p-2.5 rounded-lg transition-colors group relative ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                title="Expand Panel"
                            >
                                <PanelRightClose className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsAddSourcesOpen(true)}
                                className={`p-2.5 rounded-lg transition-colors group relative ${isFundBuzz ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
                                title="Add Sources"
                            >
                                <Plus className="w-5 h-5" />
                            </button>

                            {sources && sources.length > 0 && (
                                <div className={`border-t ${isFundBuzz ? 'border-slate-200' : 'border-white/10'} my-2`} />
                            )}

                            {sources?.map((source) => (
                                <button
                                    key={source.id}
                                    onClick={() => handleSourceIconClick(source)}
                                    className={`p-2.5 rounded-lg transition-colors group relative ${isFundBuzz ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                                    title={source.title}
                                >
                                    {source.type === 'video' ? (
                                        <Youtube className="w-5 h-5 text-red-500" />
                                    ) : source.type === 'audio' ? (
                                        <Mic className="w-5 h-5 text-pink-500" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-purple-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Full Panel Content */
                        <>
                            <div className="p-4 flex items-center gap-2">
                                <button
                                    onClick={() => setLeftPanelCollapsed(true)}
                                    className={`p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors border border-transparent hover:border-white/10`}
                                    title="Collapse Panel"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => setIsAddSourcesOpen(true)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isFundBuzz
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-500/50'
                                        }`}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Source</span>
                                </button>
                            </div>

                            {selectedSource ? (
                                <SourceDetails source={selectedSource} onBack={handleBackFromDetails} />
                            ) : (
                                <div className="px-4 pb-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide">
                                    {sources && sources.length > 0 && (
                                        <SelectedSources
                                            sources={sources}
                                            onSourceClick={handleSourceClick}
                                            onRemove={handleRemoveSource}
                                        />
                                    )}

                                    {(!sources || sources.length === 0) && (
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
                        {sources && summaryData ? (
                            <ChatInterface
                                selectedSourceCount={sources.length}
                                summaryData={summaryData}
                                onSaveToNote={handleSaveToNote}
                                isLoading={isGeneratingSummary}
                                sourceTitles={sources.map(s => s.title)}
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
                                        <p className={`text-xs text-center ${isFundBuzz ? 'text-slate-600' : 'text-gray-400'}`}>{currentProduct === 'fundbuzz' ? 'Compliance First, Agentic Content Workflow' : 'Continuous Learning Loop'}</p>
                                    </div>
                                </div>

                                {/* Cycle Circle */}
                                <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />

                                {/* Nodes */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-900 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                                        <Plus className={`w-5 h-5 ${isFundBuzz ? 'text-blue-600' : 'text-blue-400'}`} />
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-blue-900 bg-blue-50 border-blue-200 shadow-sm' : 'text-blue-300 bg-slate-900/80 border-blue-500/20'}`}>
                                        Add Sources
                                    </span>
                                </div>

                                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-slate-900 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'}`}>
                                        <Sparkles className={`w-5 h-5 ${isFundBuzz ? 'text-purple-600' : 'text-purple-400'}`} />
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-white bg-purple-600 border-purple-500 shadow-sm' : 'text-purple-300 bg-slate-900/80 border-purple-500/20'}`}>
                                        Generate Content
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-pink-500 shadow-lg shadow-pink-500/20' : 'bg-slate-900 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]'}`}>
                                        {isFundBuzz ? <ShieldCheck className="w-5 h-5 text-pink-600" /> : <Users className="w-5 h-5 text-pink-400" />}
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-white bg-pink-600 border-pink-500 shadow-sm' : 'text-pink-300 bg-slate-900/80 border-pink-500/20'}`}>
                                        {isFundBuzz ? 'Submit Compliance' : 'Users Engage'}
                                    </span>
                                </div>

                                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-shadow ${isFundBuzz ? 'bg-white border-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-900 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'}`}>
                                        <Share2 className={`w-5 h-5 ${isFundBuzz ? 'text-green-600' : 'text-green-400'}`} />
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${isFundBuzz ? 'text-white bg-green-600 border-green-500 shadow-sm' : 'text-green-300 bg-slate-900/80 border-green-500/20'}`}>Post on Socials</span>
                                </div>

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
                        <div className="flex flex-col items-center py-4 gap-4 h-full">
                            <button
                                onClick={() => setRightPanelOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Expand Studio"
                            >
                                <PanelRightClose className="w-5 h-5 rotate-180" />
                            </button>

                            <div className="w-8 h-px bg-white/10" />

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
                            </div>

                            {generatedContent.length > 0 && (
                                <>
                                    <div className="w-8 h-px bg-white/10" />
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
                        selectedContent ? (
                            <TextContentDetails
                                content={selectedContent}
                                onBack={() => setSelectedContent(null)}
                                onUpdateTitle={handleUpdateContentTitle}
                            />
                        ) : (
                            <>
                                <div className={`p-4 flex items-center justify-between border-b ${isFundBuzz ? 'bg-white border-slate-100 shadow-sm' : ''}`}>
                                    <h2 className={`font-semibold ${isFundBuzz ? 'text-slate-900' : 'text-gray-200'}`}>Content Studio</h2>
                                    <button onClick={() => setRightPanelOpen(false)} className={`p-1 rounded transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/5 text-gray-400'}`}>
                                        <PanelRightClose className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="px-4 pb-4 space-y-4 overflow-y-auto flex-1 scrollbar-hide pt-4">
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
                                            onClick={() => setIsCustomizeImageOpen(true)}
                                            className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-colors gap-2 group ${isFundBuzz ? 'bg-slate-50 border border-slate-100 hover:bg-slate-100' : 'bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className="relative">
                                                <Image className={`w-5 h-5 ${isFundBuzz ? 'text-orange-500' : 'text-orange-400'}`} />
                                                <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-orange-500 fill-slate-50 group-hover:fill-slate-100' : 'text-orange-400 fill-orange-950'}`} />
                                            </div>
                                            <span className={`text-xs font-medium ${isFundBuzz ? 'text-slate-700' : ''}`}>Image</span>
                                        </button>
                                    </div>

                                    <div className={`border-t mx-4 ${isFundBuzz ? 'border-slate-100' : 'border-white/10'}`}></div>

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

                                    {generatedContent.length === 0 && (
                                        <div className="mt-12 text-center px-4">
                                            <div className="w-8 h-8 mx-auto mb-3 text-gray-600">
                                                <Zap className="w-full h-full opacity-20" />
                                            </div>
                                            <p className="text-xs text-gray-500 mb-1">Studio output will be saved here.</p>
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
