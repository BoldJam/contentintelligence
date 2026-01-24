import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, MoreHorizontal, Share2, Copy, Check } from 'lucide-react';
import type { GeneratedContent } from '@/types/project';
import { useProduct } from '@/lib/productContext';

interface TextContentDetailsProps {
    content: GeneratedContent;
    onBack: () => void;
    onUpdateTitle?: (id: string, newTitle: string) => void;
}

export default function TextContentDetails({ content, onBack, onUpdateTitle }: TextContentDetailsProps) {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [copied, setCopied] = useState(false);
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    useEffect(() => {
        if (content.content) {
            setText(content.content);
        } else {
            setText('');
        }
        setTitle(content.title);
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTitleSave = () => {
        setIsEditingTitle(false);
        if (title.trim() && title !== content.title && onUpdateTitle) {
            onUpdateTitle(content.id, title);
        } else {
            setTitle(content.title);
        }
    };

    return (
        <div className={`flex flex-col h-full ${isFundBuzz ? 'bg-white' : 'bg-slate-900'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isFundBuzz ? 'border-slate-200' : 'border-white/10'}`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                        onClick={onBack}
                        className={`p-2 rounded-lg transition-colors shrink-0 ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        {isEditingTitle && onUpdateTitle ? (
                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                                className={`w-full bg-transparent font-semibold focus:outline-none ${isFundBuzz ? 'text-slate-900' : 'text-gray-200'}`}
                            />
                        ) : (
                            <h2
                                onClick={() => onUpdateTitle && setIsEditingTitle(true)}
                                className={`font-semibold truncate ${onUpdateTitle ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''} ${isFundBuzz ? 'text-slate-900' : 'text-gray-200'}`}
                            >
                                {title}
                            </h2>
                        )}
                        <p className={`text-xs ${isFundBuzz ? 'text-slate-500' : 'text-gray-500'}`}>{content.format || (content.type === 'text' ? 'Document' : 'Generated Content')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className={`p-2 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Editor Toolbar */}
            <div className={`px-4 py-2 border-b flex items-center gap-1 overflow-x-auto ${isFundBuzz ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                {[Bold, Italic].map((Icon, i) => (
                    <button key={i} className={`p-1.5 rounded transition-colors ${isFundBuzz ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                        <Icon className="w-4 h-4" />
                    </button>
                ))}
                <div className={`w-px h-4 mx-1 ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                {[List, ListOrdered].map((Icon, i) => (
                    <button key={i} className={`p-1.5 rounded transition-colors ${isFundBuzz ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                        <Icon className="w-4 h-4" />
                    </button>
                ))}
                <div className={`w-px h-4 mx-1 ${isFundBuzz ? 'bg-slate-200' : 'bg-white/10'}`} />
                {[LinkIcon, ImageIcon].map((Icon, i) => (
                    <button key={i} className={`p-1.5 rounded transition-colors ${isFundBuzz ? 'hover:bg-slate-200 text-slate-600 hover:text-slate-900' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                        <Icon className="w-4 h-4" />
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full h-full bg-transparent resize-none focus:outline-none text-base leading-relaxed ${isFundBuzz ? 'text-slate-900' : 'text-gray-300'}`}
                    spellCheck={false}
                />
            </div>
        </div>
    );
}

