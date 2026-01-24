import { motion } from 'framer-motion';
import React from 'react';
import { ArrowLeft, ExternalLink, Star, Calendar, TrendingUp, Award, ShieldCheck, Lightbulb, FileText, Link2, Info, Zap, Video, Youtube, Clock } from 'lucide-react';
import type { Paper } from '@/types/paper';
import { useProduct } from '@/lib/productContext';

interface PaperDetailsProps {
    paper: Paper;
    onBack: () => void;
}

const iconMap: { [key: string]: any } = {
    'star': Star,
    'calendar': Calendar,
    'trending-up': TrendingUp,
    'award': Award,
    'shield-check': ShieldCheck,
    'zap': Zap,
};

export default function PaperDetails({ paper, onBack }: PaperDetailsProps) {
    const [authorsExpanded, setAuthorsExpanded] = React.useState(false);
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    const semanticScholarUrl = paper.doi
        ? `https://www.semanticscholar.org/paper/${paper.id}`
        : `https://www.semanticscholar.org/search?q=${encodeURIComponent(paper.title)}`;

    const isVideo = paper.sourceType === 'video';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col bg-slate-900"
        >
            {/* Header with Back Button */}
            <div className={`p-4 border-b flex items-center gap-3 ${isFundBuzz ? 'border-slate-200' : 'border-white/10'}`}>
                <button
                    onClick={onBack}
                    className={`p-2 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className={`text-lg font-semibold ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>
                    {isFundBuzz ? 'Source Details' : 'Paper Details'}
                </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-8 scrollbar-hide">
                {/* Title */}
                <div>
                    <h3 className={`text-2xl font-bold leading-tight mb-2 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>
                        {paper.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span
                            onClick={() => paper.fullAuthors && paper.fullAuthors.length > 1 && setAuthorsExpanded(!authorsExpanded)}
                            className={paper.fullAuthors && paper.fullAuthors.length > 1 ? "cursor-pointer hover:underline transition-colors" : ""}
                        >
                            {authorsExpanded && paper.fullAuthors ? paper.fullAuthors.join(', ') : paper.authors}
                        </span>
                        <span>•</span>
                        <span>{paper.year}</span>
                    </div>

                    {/* Research Fields Pills */}
                    {paper.s2FieldsOfStudy && paper.s2FieldsOfStudy.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {Array.from(new Set(paper.s2FieldsOfStudy.map(f => f.category))).map((category, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20`}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Video specific header if applicable */}
                {isVideo && (
                    <div className={`rounded-xl p-4 border flex items-center gap-4 ${isFundBuzz ? 'bg-red-50 border-red-100' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className={`p-3 rounded-full ${isFundBuzz ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}>
                            <Youtube className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className={`font-semibold ${isFundBuzz ? 'text-red-900' : 'text-red-400'}`}>Video Content</h4>
                            <p className={`text-xs ${isFundBuzz ? 'text-red-700' : 'text-red-300'}`}>Transcript and analysis available below</p>
                        </div>
                    </div>
                )}

                {/* 1. Abstract / Transcription Section */}
                {paper.abstract && (
                    <div className="space-y-3">
                        <h4 className={`text-sm font-semibold uppercase tracking-wider ${isFundBuzz ? 'text-slate-500' : 'text-gray-400'}`}>
                            {isVideo ? 'Transcript' : (isFundBuzz ? 'Source Overview' : 'Abstract')}
                        </h4>
                        <div className={`p-5 rounded-2xl border text-base leading-relaxed ${isFundBuzz
                                ? 'bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                                : 'bg-white/5 border-white/10 text-gray-200'
                            }`}>
                            {isVideo ? (
                                <div className="space-y-4 font-mono text-sm">
                                    {paper.abstract.split('\n').map((line, i) => {
                                        const timestampMatch = line.match(/^\[(\d{2}:\d{2}:\d{2})\]/);
                                        if (timestampMatch) {
                                            const timestamp = timestampMatch[1];
                                            const content = line.replace(/^\[\d{2}:\d{2}:\d{2}\]\s*/, '');
                                            return (
                                                <div key={i} className="flex gap-4 group">
                                                    <span className={`shrink-0 font-bold ${isFundBuzz ? 'text-blue-600' : 'text-pink-400'}`}>{timestamp}</span>
                                                    <span>{content}</span>
                                                </div>
                                            );
                                        }
                                        return <p key={i}>{line}</p>;
                                    })}
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap">{paper.abstract}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. Quick Take (TLDR) */}
                {paper.tldr && (
                    <div className={`rounded-xl p-4 border ${isFundBuzz ? 'bg-blue-50 border-blue-100' : 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className={`w-4 h-4 ${isFundBuzz ? 'text-blue-600' : 'text-primary'}`} />
                            <h4 className={`text-sm font-semibold ${isFundBuzz ? 'text-blue-900' : 'text-primary'}`}>Quick Take</h4>
                        </div>
                        <p className={`text-sm leading-relaxed ${isFundBuzz ? 'text-blue-800' : 'text-gray-200'}`}>{paper.tldr.text}</p>
                    </div>
                )}

                {/* Quality Indicators */}
                {paper.badges && paper.badges.length > 0 && (
                    <div className={`rounded-xl p-4 border ${isFundBuzz ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <h4 className={`text-sm font-semibold mb-3 ${isFundBuzz ? 'text-slate-900' : 'text-gray-300'}`}>Quality Indicators</h4>
                        <div className="space-y-2">
                            {paper.badges.map((badge) => {
                                const Icon = iconMap[badge.icon] || Star;
                                return (
                                    <div
                                        key={badge.id}
                                        className={`flex items-start gap-3 p-3 rounded-lg ${isFundBuzz ? 'bg-white' : 'bg-white/5'}`}
                                    >
                                        <div className={`p-1.5 rounded-lg bg-slate-900/10 ${badge.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-medium text-sm ${badge.color}`}>
                                                {badge.label}
                                            </div>
                                            <div className={`text-xs mt-0.5 ${isFundBuzz ? 'text-slate-500' : 'text-gray-400'}`}>
                                                {badge.label === 'Highly Cited' && 'This paper has been cited over 100 times, indicating significant impact'}
                                                {badge.label === 'Recent' && 'Published recently (2023 or later), representing current research'}
                                                {badge.label === 'Trending' && 'Recent paper with strong citation momentum'}
                                                {badge.label === 'Top Venue' && 'Published in a prestigious academic journal or conference'}
                                                {badge.label === 'Peer-Reviewed' && 'Rigorously reviewed by experts in the field'}
                                                {badge.label === 'Influential Impact' && 'Has 10+ influential citations where other papers significantly built upon this work'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. Impact Metrics */}
                {(paper.citationCount !== undefined || paper.influentialCitationCount !== undefined) && (
                    <div>
                        <h4 className={`text-sm font-semibold mb-3 ${isFundBuzz ? 'text-slate-500' : 'text-gray-300'}`}>Impact Metrics</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {paper.citationCount !== undefined && (
                                <div className={`rounded-xl p-4 border ${isFundBuzz ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 relative group/tooltip">
                                        <span>Total Citations</span>
                                        <Info className="w-3 h-3 text-gray-500 cursor-pointer" />
                                    </div>
                                    <div className={`text-2xl font-bold ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>{paper.citationCount.toLocaleString()}</div>
                                </div>
                            )}
                            {paper.influentialCitationCount !== undefined && (
                                <div className={`rounded-xl p-4 border ${isFundBuzz ? 'bg-blue-50 border-blue-100' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex items-center gap-1.5 text-xs text-blue-600 mb-1 relative group/tooltip">
                                        <span>Influential</span>
                                        <Info className="w-3 h-3 text-blue-400 cursor-pointer" />
                                    </div>
                                    <div className={`text-2xl font-bold ${isFundBuzz ? 'text-blue-600' : 'text-primary'}`}>{paper.influentialCitationCount.toLocaleString()}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* External Access */}
                {paper.externalIds && Object.keys(paper.externalIds).some(key => paper.externalIds?.[key as keyof typeof paper.externalIds]) && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {paper.externalIds.DOI && (
                            <a
                                href={`https://doi.org/${paper.externalIds.DOI}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${isFundBuzz
                                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Link2 className="w-3 h-3" />
                                <span>View Document</span>
                                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

