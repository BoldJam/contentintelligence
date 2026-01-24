'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, ChevronUp, MoreVertical, ThumbsDown, Square, CheckSquare, FileText, Calendar, TrendingUp, Award, ShieldCheck, ThumbsUp, Plus, Star
} from 'lucide-react';
import { useState } from 'react';
import type { Paper } from '@/types/paper';

interface PapersFetchedProps {
    papers: Paper[];
    onImport: (selectedPapers: Paper[]) => void;
    onDelete: () => void;
    onPaperClick: (paper: Paper) => void;
    onExpandChange?: (isExpanded: boolean) => void;
}

const iconMap: { [key: string]: any } = {
    'star': Star,
    'calendar': Calendar,
    'trending-up': TrendingUp,
    'award': Award,
    'shield-check': ShieldCheck,
};

export default function PapersFetched({ papers, onImport, onDelete, onPaperClick, onExpandChange }: PapersFetchedProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedPapers, setSelectedPapers] = useState<Set<string>>(new Set(papers.map(p => p.id)));
    const displayedPapers = isExpanded ? papers : papers.slice(0, 3);

    const toggleExpansion = (newState: boolean) => {
        setIsExpanded(newState);
        onExpandChange?.(newState);
    };

    const togglePaperSelection = (paperId: string) => {
        setSelectedPapers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(paperId)) {
                newSet.delete(paperId);
            } else {
                newSet.add(paperId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedPapers.size === papers.length) {
            setSelectedPapers(new Set());
        } else {
            setSelectedPapers(new Set(papers.map(p => p.id)));
        }
    };

    const handleImport = () => {
        const selected = papers.filter(p => selectedPapers.has(p.id));
        onImport(selected);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <MoreVertical className="w-5 h-5 text-primary" />
                    <span className="font-medium">Research completed!</span>
                </div>
                <button
                    onClick={() => toggleExpansion(!isExpanded)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                    {isExpanded ? 'View less' : 'View'}
                </button>
            </div>

            {/* Select All Header (only when expanded) */}
            {isExpanded && (
                <div className="px-5 py-2 border-b border-white/5 flex items-center gap-3">
                    <button
                        onClick={toggleSelectAll}
                        className={`transition-colors ${selectedPapers.size === papers.length ? 'text-blue-500' : 'text-gray-500'}`}
                    >
                        {selectedPapers.size === papers.length ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                    <span className="text-sm text-gray-400">Select All</span>
                </div>
            )}

            {/* List */}
            <div className="p-2">
                <AnimatePresence initial={false}>
                    {displayedPapers.map((paper) => (
                        <motion.div
                            key={paper.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="group flex items-start gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                            onClick={() => onPaperClick(paper)}
                        >
                            <div className="p-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                {isExpanded ? (
                                    <button
                                        onClick={() => togglePaperSelection(paper.id)}
                                        className={`transition-colors ${selectedPapers.has(paper.id) ? 'text-blue-500' : 'text-gray-500'}`}
                                    >
                                        {selectedPapers.has(paper.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                    </button>
                                ) : (
                                    <div className="bg-blue-500/10 rounded-lg p-1">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4
                                    className="text-sm font-medium text-white truncate hover:text-blue-400 transition-colors mb-1"
                                >
                                    {paper.title}
                                </h4>
                                <p className="text-xs text-gray-400 truncate mb-2">
                                    {paper.authors}, {paper.year}
                                </p>

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
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-white/5 flex flex-col gap-4">
                <div
                    className="flex items-center gap-2 text-sm text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
                    onClick={() => !isExpanded && toggleExpansion(true)}
                >
                    <Star className="w-4 h-4" />
                    <span>
                        {isExpanded
                            ? `${selectedPapers.size} papers selected`
                            : (papers.length - displayedPapers.length > 0 ? `${papers.length - displayedPapers.length} more sources` : 'All sources shown')
                        }
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <ThumbsDown className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm text-gray-400 hover:text-red-400 font-medium"
                            onClick={onDelete}
                        >
                            Discard
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors shadow-lg ${selectedPapers.size === 0
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                }`}
                            onClick={handleImport}
                            disabled={selectedPapers.size === 0}
                        >
                            <Plus className="w-4 h-4" />
                            Import
                        </button>
                    </div>
                </div>
            </div >
        </motion.div >
    );
}
