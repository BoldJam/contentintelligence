'use client';

import { motion } from 'framer-motion';
import { MoreVertical, Trash2, FileText, Star, Calendar, TrendingUp, Award, ShieldCheck, Mic, Image as ImageIcon, Sparkles, Video, Globe, Youtube } from 'lucide-react';
import { useState } from 'react';
import type { Paper } from '@/types/paper';
import { useProduct } from '@/lib/productContext';

interface SelectedPapersProps {
    papers: Paper[];
    onPaperClick: (paper: Paper) => void;
    onRemove: (paperId: string) => void;
}

const iconMap: { [key: string]: any } = {
    'star': Star,
    'calendar': Calendar,
    'trending-up': TrendingUp,
    'award': Award,
    'shield-check': ShieldCheck,
    'sparkles': Sparkles,
};

export default function SelectedPapers({ papers, onPaperClick, onRemove }: SelectedPapersProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    const getIcon = (paper: Paper) => {
        // Mock specific icons for Fund Buzz
        if (isFundBuzz && paper.isMock) {
            if (paper.sourceType === 'video') {
                return <Youtube className="w-5 h-5 text-red-600" />;
            }
            if (paper.sourceType === 'text') {
                return <Globe className="w-5 h-5 text-slate-900" />;
            }
        }

        switch (paper.sourceType) {
            case 'website':
                return (
                    <div className="relative">
                        <Globe className={`w-5 h-5 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`} />
                        {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-white absolute -bottom-0.5 -right-0.5 fill-slate-900 stroke-[3]" />}
                    </div>
                );
            case 'text':
                return (
                    <div className="relative">
                        <FileText className="w-5 h-5 text-blue-400" />
                        {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-blue-400 absolute -bottom-0.5 -right-0.5 fill-blue-950 stroke-[3]" />}
                    </div>
                );
            case 'audio':
                return (
                    <div className="relative">
                        <Mic className="w-5 h-5 text-pink-500" />
                        {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-pink-500 absolute -top-1 -right-1 fill-pink-950 stroke-[3]" />}
                    </div>
                );
            case 'image':
                return (
                    <div className="relative">
                        <div className="relative">
                            <ImageIcon className="w-5 h-5 text-purple-500" />
                            {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-purple-500 absolute -top-1 -right-1 fill-purple-950 stroke-[3]" />}
                        </div>
                    </div>
                );
            case 'note':
                return (
                    <div className="relative">
                        <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />
                        {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-white absolute -bottom-0.5 -right-0.5 fill-slate-900 stroke-[3]" />}
                    </div>
                );
            case 'video':
                return (
                    <div className="relative">
                        <Video className="w-5 h-5 text-green-500" />
                        {!isFundBuzz && <Sparkles className="w-2.5 h-2.5 text-green-500 absolute -top-1 -right-1 fill-green-950 stroke-[3]" />}
                    </div>
                );
            default:
                return (
                    <div className="bg-blue-500/10 rounded-lg p-1">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`rounded-xl p-3 border transition-colors ${isFundBuzz ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'}`}
        >
            <h3 className={`text-sm font-semibold mb-3 ${isFundBuzz ? 'text-slate-500' : 'text-gray-300'}`}>
                {isFundBuzz ? 'Sources Included' : 'Selected Papers'} ({papers.length})
            </h3>

            <div className="space-y-2">
                {papers.map((paper) => (
                    <div
                        key={paper.id}
                        className={`group relative flex items-start gap-3 p-3 border rounded-lg transition-colors ${isFundBuzz ? 'bg-slate-50/50 border-slate-100 hover:bg-slate-100' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                        {/* Icon */}
                        <div className="p-1 shrink-0">
                            {getIcon(paper)}
                        </div>

                        {/* Content */}
                        <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => onPaperClick(paper)}
                        >
                            <h4 className={`text-sm font-medium line-clamp-2 pr-8 mb-1 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>{paper.title}</h4>
                            <p className="text-xs text-gray-400 mb-2">{paper.authors} ({paper.year})</p>

                            {/* Badges */}
                            {paper.badges && paper.badges.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {paper.badges.map((badge) => {
                                        const Icon = iconMap[badge.icon] || Star;
                                        return (
                                            <div
                                                key={badge.id}
                                                className={`flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded text-xs ${badge.color}`}
                                                title={badge.label}
                                            >
                                                <Icon className="w-3 h-3" />
                                                <span className="font-medium">{badge.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* More options button - shows on hover */}
                        <div className="absolute top-2 right-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === paper.id ? null : paper.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Dropdown menu */}
                            {openMenuId === paper.id && (
                                <>
                                    {/* Backdrop to close menu */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setOpenMenuId(null)}
                                    />

                                    <div className={`absolute right-0 top-8 mt-1 w-40 border rounded-lg shadow-xl overflow-hidden z-20 ${isFundBuzz ? 'bg-white border-slate-200' : 'bg-slate-800 border-white/10'}`}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(paper.id);
                                                setOpenMenuId(null);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-red-400 hover:text-red-300 transition-colors ${isFundBuzz ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
