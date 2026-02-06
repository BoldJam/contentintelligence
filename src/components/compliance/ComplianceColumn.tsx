'use client';

import { useDroppable } from '@dnd-kit/core';
import ComplianceCard from './ComplianceCard';
import type { GeneratedContent } from '@/types/project';

interface ComplianceItem {
    projectId: string;
    projectName: string;
    content: GeneratedContent;
}

interface ComplianceColumnProps {
    id: string; // The status (Draft, Review, Approved)
    title: string;
    items: ComplianceItem[];
    isFundBuzz?: boolean;
    onCardClick: (item: ComplianceItem) => void;
}

export default function ComplianceColumn({ id, title, items, isFundBuzz, onCardClick }: ComplianceColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    const getStatusColor = () => {
        switch (id) {
            case 'Draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'Pending Review': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className={`flex flex-col h-full rounded-xl ${isFundBuzz ? 'bg-slate-50/50' : 'bg-white/5'}`}>
            {/* Column Header */}
            <div className="p-3 border-b border-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getStatusColor()}`}>
                            {title}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{items.length}</span>
                    </div>
                </div>
            </div>

            {/* Droppable Area */}
            <div ref={setNodeRef} className="flex-1 p-2 overflow-y-auto">
                {items.map((item) => (
                    <ComplianceCard
                        key={`${item.projectId}-${item.content.id}`}
                        id={`${item.projectId}-${item.content.id}`}
                        projectId={item.projectId}
                        projectName={item.projectName}
                        item={item.content}
                        isFundBuzz={isFundBuzz}
                        onClick={() => onCardClick(item)}
                    />
                ))}
            </div>
        </div>
    );
}
