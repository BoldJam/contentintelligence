import React, { useState, useEffect } from 'react';
import { FileText, MoreVertical, Loader2, Trash2, Sparkles, Mic, Image as ImageIcon, Video, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GeneratedContent } from '@/types/project';
import { useProduct } from '@/lib/productContext';

interface ContentGeneratedProps {
    items: GeneratedContent[];
    onDelete: (id: string) => void;
    onSelect?: (content: GeneratedContent) => void;
    onAddToSources?: (content: GeneratedContent) => void;
    onUpdateStatus?: (id: string, status: GeneratedContent['complianceStatus']) => void;
}

export default function ContentGenerated({ items, onDelete, onSelect, onAddToSources, onUpdateStatus }: ContentGeneratedProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    const getRelativeTime = (date: Date | string) => {
        const dateObj = new Date(date);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const getIcon = (type: string, isLoading: boolean) => {
        if (isLoading) {
            return <Loader2 className={`w-5 h-5 animate-spin ${currentProduct === 'fundbuzz' ? 'text-primary' : 'text-white'}`} />;
        }

        switch (type) {
            case 'text':
                return (
                    <div className="relative">
                        <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-blue-500' : 'text-blue-400'}`} />
                        <Sparkles className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 stroke-[3] ${isFundBuzz ? 'text-blue-500 fill-white' : 'text-blue-400 fill-blue-950'}`} />
                    </div>
                );
            case 'audio':
                return (
                    <div className="relative">
                        <Mic className={`w-5 h-5 ${isFundBuzz ? 'text-pink-500' : 'text-pink-400'}`} />
                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-pink-500 fill-white' : 'text-pink-400 fill-pink-950'}`} />
                    </div>
                );
            case 'image':
                return (
                    <div className="relative">
                        <ImageIcon className={`w-5 h-5 ${isFundBuzz ? 'text-orange-500' : 'text-orange-400'}`} />
                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-orange-500 fill-white' : 'text-orange-400 fill-orange-950'}`} />
                    </div>
                );
            case 'video':
                return (
                    <div className="relative">
                        <Video className={`w-5 h-5 ${isFundBuzz ? 'text-red-500' : 'text-red-400'}`} />
                        <Sparkles className={`w-2 h-2 absolute -top-1 -right-1 stroke-[3] ${isFundBuzz ? 'text-red-500 fill-white' : 'text-red-400 fill-red-950'}`} />
                    </div>
                );
            case 'note':
                return (
                    <div className="relative">
                        <FileText className={`w-5 h-5 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />
                        <Sparkles className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 stroke-[3] ${isFundBuzz ? 'text-slate-600 fill-white' : 'text-white fill-[#0f172a]'}`} />
                    </div>
                );
            default:
                return <FileText className="w-5 h-5 text-white" />;
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        if (openDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdown]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <AnimatePresence>
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => onSelect?.(item)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors group cursor-pointer border ${isFundBuzz ? 'bg-white border-slate-100 hover:bg-slate-50' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                        {/* Icon */}
                        <div className="shrink-0">
                            {getIcon(item.type, item.isLoading)}
                        </div>

                        {/* Content Info */}
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate mb-0.5 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>
                                {item.title}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {getRelativeTime(item.createdAt)}
                                </span>
                                {item.format && (
                                    <>
                                        <span className="text-gray-300 text-[10px]">•</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isFundBuzz ? 'text-blue-600' : 'text-blue-400'}`}>
                                            {item.format}
                                        </span>
                                    </>
                                )}
                            </div>

                            {isFundBuzz && !item.isLoading && (
                                <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Compliance Status :</span>
                                    <div
                                        style={{
                                            backgroundColor: item.complianceStatus === 'Approved' ? '#10b981' : item.complianceStatus === 'Pending Review' ? '#f59e0b' : '#334155',
                                            borderRadius: '4px',
                                            minWidth: '80px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            padding: '4px 8px'
                                        }}
                                        className="transition-all"
                                    >
                                        <select
                                            value={item.complianceStatus || 'Draft'}
                                            onChange={(e) => onUpdateStatus?.(item.id, e.target.value as any)}
                                            className="appearance-none bg-transparent border-none p-0 pr-4 text-[10px] font-bold cursor-pointer focus:ring-0 w-full text-center"
                                            style={{
                                                color: 'white',
                                                backgroundColor: 'transparent',
                                                WebkitAppearance: 'none'
                                            }}
                                        >
                                            <option value="Draft" style={{ color: '#0f172a', backgroundColor: 'white' }}>Draft</option>
                                            <option value="Pending Review" style={{ color: '#0f172a', backgroundColor: 'white' }}>Pending Review</option>
                                            <option value="Approved" style={{ color: '#0f172a', backgroundColor: 'white' }}>Approved</option>
                                        </select>
                                        <ChevronDown className="absolute right-1 w-2.5 h-2.5 pointer-events-none text-white/90" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* More Options */}
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(openDropdown === item.id ? null : item.id);
                                }}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === item.id && (
                                <div className={`absolute right-0 top-full mt-1 border rounded-lg shadow-xl z-20 min-w-[160px] ${isFundBuzz ? 'bg-white border-slate-200' : 'bg-[#1a1a1a] border-white/10'}`}>
                                    {onAddToSources && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddToSources(item);
                                                setOpenDropdown(null);
                                            }}
                                            className={`w-full flex items-center justify-start gap-2 px-3 py-2 text-sm transition-colors rounded-t-lg whitespace-nowrap text-left ${isFundBuzz ? 'text-slate-700 hover:bg-slate-50' : 'text-gray-300 hover:bg-white/10'}`}
                                        >
                                            <FileText className={`w-4 h-4 shrink-0 ${isFundBuzz ? 'text-slate-600' : 'text-white'}`} />
                                            Add to Sources
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full flex items-center justify-start gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-b-lg text-left`}
                                    >
                                        <Trash2 className="w-4 h-4 shrink-0" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
