'use client';

import { useState, useEffect } from 'react';
import { X, User, Calendar, MessageSquare, Send, Pencil, Check } from 'lucide-react';
import type { GeneratedContent } from '@/types/project';

interface ComplianceItem {
    projectId: string;
    projectName: string;
    content: GeneratedContent;
}

interface ComplianceDetailsModalProps {
    item: ComplianceItem | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (newStatus: GeneratedContent['complianceStatus']) => void;
    onUpdateContent?: (updates: { title?: string; assignee?: string }) => void;
    isFundBuzz?: boolean;
}

const ASSIGNEE_OPTIONS = [
    { name: 'Unassigned', initials: '' },
    { name: 'Huong Totten', initials: 'HT' },
    { name: 'Raghav Babu', initials: 'RB' },
    { name: 'John Miller', initials: 'JM' },
];

export default function ComplianceDetailsModal({ item, isOpen, onClose, onStatusChange, onUpdateContent, isFundBuzz }: ComplianceDetailsModalProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');

    useEffect(() => {
        if (item) {
            setEditedTitle(item.content.title);
            setIsEditingTitle(false);
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const handleTitleSave = () => {
        if (editedTitle.trim() && editedTitle !== item.content.title) {
            onUpdateContent?.({ title: editedTitle.trim() });
        }
        setIsEditingTitle(false);
    };

    const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAssignee = e.target.value === 'Unassigned' ? undefined : e.target.value;
        onUpdateContent?.({ assignee: newAssignee });
    };

    const currentAssignee = item.content.assignee || 'Unassigned';
    const assigneeData = ASSIGNEE_OPTIONS.find(a => a.name === currentAssignee) || ASSIGNEE_OPTIONS[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex overflow-hidden ${isFundBuzz ? 'bg-white' : 'bg-slate-900 border border-white/10'}`}>

                {/* Left Pane (70%) */}
                <div className="w-[70%] flex flex-col border-r border-slate-100">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start">
                        <div className="flex-1">
                            {isEditingTitle ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent flex-1"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleTitleSave();
                                            if (e.key === 'Escape') {
                                                setEditedTitle(item.content.title);
                                                setIsEditingTitle(false);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleTitleSave}
                                        className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group">
                                    <h2 className="text-2xl font-bold mb-2">{item.content.title}</h2>
                                    <button
                                        onClick={() => setIsEditingTitle(true)}
                                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <span>Project: {item.projectName}</span>
                                <span>•</span>
                                <span className="capitalize">{item.content.type}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                        <div className="prose max-w-none">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {item.content.content || "No content preview available."}
                            </p>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="p-6 border-t border-slate-100 bg-white">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Comments
                        </h3>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                JM
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                />
                                <button className="absolute right-2 top-1.5 p-1 hover:bg-slate-100 rounded-md text-blue-600">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pane (30%) */}
                <div className="w-[30%] flex flex-col bg-slate-50/50">
                    <div className="p-4 flex justify-end">
                        <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="px-6 pb-6 space-y-8">
                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Status</label>
                            <select
                                value={item.content.complianceStatus || 'Draft'}
                                onChange={(e) => onStatusChange(e.target.value as any)}
                                className={`w-full appearance-none px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white border-slate-200`}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Pending Review">Pending Review</option>
                                <option value="Approved">Approved</option>
                            </select>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            {/* Assignee Dropdown */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Assignee</label>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentAssignee === 'Unassigned'
                                            ? 'bg-slate-100 text-slate-400'
                                            : 'bg-indigo-100 text-indigo-600'
                                        }`}>
                                        {assigneeData.initials || <User className="w-4 h-4" />}
                                    </div>
                                    <select
                                        value={currentAssignee}
                                        onChange={handleAssigneeChange}
                                        className="flex-1 appearance-none px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        {ASSIGNEE_OPTIONS.map((option) => (
                                            <option key={option.name} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Reporter</label>
                                <div className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                                        JM
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">John Miller</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Dates</label>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Created</span>
                                        <span className="text-slate-900 font-medium">Oct 24, 2025</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Updated</span>
                                        <span className="text-slate-900 font-medium">Just now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
