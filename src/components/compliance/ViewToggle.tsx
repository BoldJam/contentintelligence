'use client';

import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'board' | 'list';
    onViewChange: (mode: 'board' | 'list') => void;
    isFundBuzz?: boolean;
}

export default function ViewToggle({ viewMode, onViewChange, isFundBuzz }: ViewToggleProps) {
    return (
        <div className={`flex items-center p-1 rounded-lg border ${isFundBuzz ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
            <button
                onClick={() => onViewChange('board')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'board'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-black/5'
                    }`}
            >
                <LayoutGrid className="w-3.5 h-3.5" />
                Board
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-black/5'
                    }`}
            >
                <List className="w-3.5 h-3.5" />
                List
            </button>
        </div>
    );
}
