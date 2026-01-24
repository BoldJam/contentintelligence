import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ThumbsUp, ThumbsDown, Bookmark, ArrowRight, Sparkles, LayoutTemplate, TrendingUp, User, Bot } from 'lucide-react';
import type { SummaryData } from '@/types/paper';
import { useProduct } from '@/lib/productContext';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
    selectedPaperCount: number;
    summaryData: SummaryData;
    onSaveToNote: (content: string) => void;
    isLoading?: boolean;
    sourceTitles?: string[];
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface({ selectedPaperCount, summaryData, onSaveToNote, isLoading = false, sourceTitles = [] }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const extractKeywords = (titles: string[]) => {
        const stopWords = new Set(['the', 'and', 'a', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'an', 'is', 'are', 'was', 'were', 'be', 'how', 'what', 'why', 'trends', 'report', 'analysis', 'notes', 'transcript', 'video']);
        const allWords = titles.join(' ').toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        const freq: { [key: string]: number } = {};
        allWords.forEach(word => {
            if (word.length > 3 && !stopWords.has(word)) {
                freq[word] = (freq[word] || 0) + 1;
            }
        });
        return Object.entries(freq)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([word]) => word);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI delay and response
        setTimeout(async () => {
            let responseContent = "Based on the analysis of these sources, here's the information you requested.";

            if (text.includes("Framing Guidelines")) {
                responseContent = `### 🎯 Marketing Framing Guidelines

- **Market Positioning**: Focus on the transition toward "Algorithm-Driven Active Management" mentioned in your library. 📈
- **Trust Building**: Use high-confidence institutional terminology like "market resilience" and "long-term staying power". 🛡️
- **Narrative Hook**: Position current bond yield trends as a "Stable Passive Gain" opportunity for retail investors. 🏦
- **Proof Points**: Leverage the 2026 ESG adoption metrics found in your sources to back our green fund claims. 🌿`;
            } else if (text.includes("Trending now")) {
                try {
                    const response = await fetch('/api/trends');
                    const trends = await response.json();

                    const keywords = extractKeywords(sourceTitles);
                    console.log("Extracted Keywords for filtering:", keywords);

                    // Filter news/trends based on keywords from our sources
                    let newsItems = trends.filter((t: any) => {
                        const isNewsOrGoogle = t.platform === 'News' || t.platform === 'Google';
                        if (!isNewsOrGoogle) return false;

                        // Check if any keyword matches the topic or reason
                        return keywords.some(kw =>
                            t.topic.toLowerCase().includes(kw) ||
                            t.reason.toLowerCase().includes(kw)
                        );
                    }).slice(0, 3);

                    // Fallback to top news if no keyword matches found for demo value
                    if (newsItems.length === 0) {
                        newsItems = trends.filter((t: any) => t.platform === 'News' || t.platform === 'Google').slice(0, 3);
                    }

                    if (newsItems.length > 0) {
                        responseContent = `### 🔥 Trending Insights & External Context

I've correlated your internal sources with the latest market movement from Google Trends and News:

${newsItems.map((item: any) => `- **${item.topic}**: ${item.reason}. [Read Article](${item.link})`).join('\n')}

- **Industry Context**: The focus on ${keywords.length > 0 ? `**${keywords[0]}**` : 'these topics'} in your sources aligns with these broader market shifts.
- **Narrative Opportunity**: Leverage these external trending hooks to strengthen your current positioning.`;
                    } else {
                        responseContent = `### 🔥 Trending Insights from your Sources

- **ESG Convergence**: Institutional newsletters are pivoting heavily toward green mutual funds this quarter. 🌿
- **AI Alpha Focus**: Investors are shifting interest from pure growth to "stable AI alpha" strategies. 🤖
- **Expense Ratio Wars**: There's a notable movement toward lower-fee passive indices in the recent reporting. 💸`;
                    }
                } catch (error) {
                    console.error("Failed to fetch live trends:", error);
                    responseContent = `### 🔥 Trending Insights from your Sources

- **ESG Convergence**: Institutional newsletters are pivoting heavily toward green mutual funds this quarter. 🌿
- **AI Alpha Focus**: Investors are shifting interest from pure growth to "stable AI alpha" strategies. 🤖
- **Expense Ratio Wars**: There's a notable movement toward lower-fee passive indices in the recent reporting. 💸`;
                }
            } else {
                responseContent = `I've analyzed the ${selectedPaperCount} source(s) and found that your query regarding "${text}" aligns with the key trends in 2026 investment strategies. How else can I help narrow this down for your marketing copy? 💡`;
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(inputValue);
        }
    };

    return (
        <div className={`flex flex-col h-full relative ${isFundBuzz ? 'bg-slate-50' : 'bg-transparent'}`}>
            {/* Scrollable Content */}
            <div className={`flex-1 overflow-y-auto p-8 pb-44 scrollbar-hide`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto space-y-5"
                >
                    {/* Header */}
                    <div className="space-y-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm ${isFundBuzz ? 'bg-blue-600' : 'bg-gradient-to-br from-orange-400 to-pink-500'}`}>
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>

                        {isLoading ? (
                            <div className="space-y-2 animate-pulse w-full">
                                <div className={`h-10 w-full rounded-lg ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                                <div className={`h-4 w-1/3 rounded-lg ${isFundBuzz ? 'bg-slate-100' : 'bg-white/5'}`} />
                            </div>
                        ) : (
                            <>
                                <h1 className={`text-4xl font-bold leading-tight ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>
                                    {summaryData.title}
                                </h1>

                                <p className={`text-sm font-medium ${isFundBuzz ? 'text-slate-500' : 'text-gray-400'}`}>
                                    {selectedPaperCount} {selectedPaperCount === 1 ? 'source' : 'sources'}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Summary */}
                    <div className={`prose max-w-none ${isFundBuzz ? 'prose-slate' : 'prose-invert'} min-h-[180px]`}>
                        {isLoading ? (
                            <div className="space-y-4 animate-pulse w-full">
                                <div className="space-y-2">
                                    <div className={`h-4 w-full rounded-lg ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                                    <div className={`h-4 w-full rounded-lg ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                                    <div className={`h-4 w-full rounded-lg ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                                    <div className={`h-4 w-11/12 rounded-lg ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <div className={`h-4 w-full rounded-lg ${isFundBuzz ? 'bg-slate-100' : 'bg-white/5'}`} />
                                    <div className={`h-4 w-10/12 rounded-lg ${isFundBuzz ? 'bg-slate-100' : 'bg-white/5'}`} />
                                </div>
                            </div>
                        ) : (
                            <div className={`leading-snug text-lg ${isFundBuzz ? 'text-slate-800' : 'text-gray-300'}`}>
                                <ReactMarkdown>{summaryData.summary}</ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-4 pt-2 border-b pb-6 ${isFundBuzz ? 'border-slate-200' : 'border-white/10'}`}>
                        {!isLoading ? (
                            <>
                                <button
                                    onClick={() => onSaveToNote(summaryData.summary)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isFundBuzz ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                >
                                    <Bookmark className="w-4 h-4" />
                                    Save to note
                                </button>
                                <div className="flex items-center gap-2">
                                    <button className={`p-2 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button className={`p-2 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                                        <ThumbsUp className="w-4 h-4" />
                                    </button>
                                    <button className={`p-2 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                                        <ThumbsDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 animate-pulse w-full">
                                <div className={`h-9 w-32 rounded-lg ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                                <div className={`h-9 w-32 rounded-lg ${isFundBuzz ? 'bg-slate-100' : 'bg-white/5'}`} />
                            </div>
                        )}
                    </div>

                    {/* Suggested Questions (Only show if no messages yet) */}
                    {messages.length === 0 && !isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {summaryData.questions.slice(0, 3).map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSend(question)}
                                    className={`text-left p-3.5 rounded-xl transition-all group ${index === 2 ? 'md:col-span-2' : ''} ${isFundBuzz
                                        ? 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-700'
                                        : 'bg-[#1e293b] border border-white/10 hover:bg-white/5 text-gray-300 group-hover:text-white'
                                        }`}
                                >
                                    <p className="text-sm font-medium leading-tight">
                                        {question}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) || isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 animate-pulse w-full">
                            <div className={`h-14 rounded-xl md:col-span-1 ${isFundBuzz ? 'bg-white border border-slate-100' : 'bg-white/5 border border-white/10'}`} />
                            <div className={`h-14 rounded-xl md:col-span-1 ${isFundBuzz ? 'bg-white border border-slate-100' : 'bg-white/5 border border-white/10'}`} />
                            <div className={`h-14 rounded-xl md:col-span-2 ${isFundBuzz ? 'bg-white border border-slate-100' : 'bg-white/5 border border-white/10'}`} />
                        </div>
                    )}

                    {/* Chat History */}
                    <div className="space-y-4 pt-2">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : (isFundBuzz ? 'bg-slate-200' : 'bg-pink-500')}`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className={`w-4 h-4 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />}
                                </div>
                                <div className={`flex-1 max-w-[85%] rounded-2xl p-3.5 shadow-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : (isFundBuzz ? 'bg-white border border-slate-200 text-slate-800' : 'bg-[#1e293b] border border-white/10 text-gray-300')
                                    }`}>
                                    <div className={`text-sm leading-relaxed max-w-none ${msg.role === 'user' ? 'text-white' : (isFundBuzz ? 'text-slate-800' : 'text-gray-300')}`}>
                                        <ReactMarkdown
                                            components={{
                                                ul: ({ ...props }) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                                                li: ({ ...props }) => <li className="text-sm" {...props} />,
                                                p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                h3: ({ ...props }) => <h3 className="text-base font-bold mb-2 mt-4 first:mt-0" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                    {msg.role === 'assistant' && (
                                        <div className={`mt-3 pt-3 border-t ${isFundBuzz ? 'border-slate-100' : 'border-white/10'}`}>
                                            <button
                                                onClick={() => onSaveToNote(msg.content)}
                                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isFundBuzz ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                            >
                                                <Bookmark className="w-4 h-4" />
                                                Save to note
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isFundBuzz ? 'bg-slate-200' : 'bg-pink-500'}`}>
                                    <Bot className={`w-4 h-4 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />
                                </div>
                                <div className={`rounded-2xl p-3 flex items-center gap-2 ${isFundBuzz ? 'bg-white border border-slate-200 shadow-sm' : 'bg-[#1e293b] border border-white/10'}`}>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </motion.div>
            </div >

            {/* Input Area */}
            < div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t pointer-events-none z-20 ${isFundBuzz ? 'from-slate-50 via-slate-50/80 to-transparent' : 'from-[#0f172a] via-[#0f172a] to-transparent'}`
            }>
                <div className="max-w-3xl mx-auto relative px-4 md:px-0 pointer-events-auto">
                    {/* Quick Actions */}
                    <div className="flex items-center gap-3 mb-4 overflow-x-auto scrollbar-hide">
                        <button
                            disabled={isLoading}
                            onClick={() => handleSend("Framing Guidelines")}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all whitespace-nowrap group shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${isFundBuzz
                                ? 'bg-purple-600 border-purple-500 hover:bg-purple-700 text-white'
                                : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-200'
                                }`}
                        >
                            <LayoutTemplate className={`w-4 h-4 ${isFundBuzz ? 'text-white' : 'text-purple-400'}`} />
                            <span className="text-sm font-medium">Framing Guidelines</span>
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={() => handleSend("Trending now")}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all whitespace-nowrap group shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${isFundBuzz
                                ? 'bg-amber-600 border-amber-500 hover:bg-amber-700 text-white'
                                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-200'
                                }`}
                        >
                            <TrendingUp className={`w-4 h-4 ${isFundBuzz ? 'text-white' : 'text-amber-400'}`} />
                            <span className="text-sm font-medium">Trending now</span>
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            placeholder={isLoading ? "Generating summary..." : "Start typing..."}
                            className={`w-full border rounded-2xl py-4 pl-6 pr-32 transition-all shadow-lg ${isFundBuzz
                                ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                : 'bg-[#1e293b] border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                                } ${isLoading ? 'opacity-50' : ''}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <span className={`text-xs font-medium ${isFundBuzz ? 'text-slate-400' : 'text-gray-500'}`}>
                                {selectedPaperCount} {selectedPaperCount === 1 ? 'source' : 'sources'}
                            </span>
                            <button
                                onClick={() => handleSend(inputValue)}
                                disabled={isLoading}
                                className={`p-2 rounded-full transition-colors shadow-sm ${isFundBuzz ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-black hover:bg-gray-200'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
