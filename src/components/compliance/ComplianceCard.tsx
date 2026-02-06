'use client';

import { useDraggable } from '@dnd-kit/core';
import { FileText, Image, Speaker, Video, Ticket, User } from 'lucide-react';
import type { GeneratedContent } from '@/types/project';

interface ComplianceCardProps {
    id: string;
    projectId: string;
    projectName: string;
    item: GeneratedContent;
    isFundBuzz?: boolean;
    onClick: () => void;
}

export default function ComplianceCard({ id, projectId, projectName, item, isFundBuzz, onClick }: ComplianceCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: {
            projectId,
            contentId: item.id,
            status: item.complianceStatus
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const getIcon = () => {
        switch (item.type) {
            case 'image': return <Image className="w-4 h-4 text-blue-500" />;
            case 'audio': return <Speaker className="w-4 h-4 text-purple-500" />;
            case 'video': return <Video className="w-4 h-4 text-red-500" />;
            default: return <FileText className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`p-3 mb-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${isFundBuzz ? 'bg-white border-slate-200' : 'bg-slate-800 border-white/10'
                }`}
        >
            <div className="flex items-start mb-2">
                <div className={`p-1 rounded-md shrink-0 mr-2 ${isFundBuzz ? 'bg-slate-50' : 'bg-white/5'}`}>
                    {getIcon()}
                </div>
                <span className="text-sm font-medium line-clamp-2 leading-tight pt-0.5 flex-1">
                    {item.title}
                </span>

                <div className="shrink-0 ml-2">
                    {item.assignee ? (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${isFundBuzz ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-300'
                            }`} title={item.assignee}>
                            {item.assignee.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                    ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isFundBuzz ? 'bg-slate-100' : 'bg-slate-700'
                            }`}>
                            <User className={`w-3.5 h-3.5 ${isFundBuzz ? 'text-slate-400' : 'text-slate-500'}`} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${isFundBuzz ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <Ticket className="w-3 h-3" />
                    <span>{projectName}</span>
                </div>
            </div>
        </div>
    );
}
