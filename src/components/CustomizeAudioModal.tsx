import React, { useState } from 'react';
import { X, ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '@/lib/productContext';

interface CustomizeAudioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate?: (format: string, language: string, length: string, focus: string) => void;
}

export default function CustomizeAudioModal({ isOpen, onClose, onGenerate }: CustomizeAudioModalProps) {
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    const [selectedFormat, setSelectedFormat] = useState('Deep dive');
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const [selectedLength, setSelectedLength] = useState('Default');
    const [focusText, setFocusText] = useState('');

    const formats = [
        {
            name: 'Deep dive',
            description: 'A lively conversation between two hosts, unpacking and connecting topics in your sources'
        },
        {
            name: 'Brief',
            description: 'A bite-sized overview to help you grasp the core ideas from your sources quickly'
        },
        {
            name: 'Critique',
            description: 'An expert review of your sources, offering constructive feedback to help you improve your material'
        },
        {
            name: 'Debate',
            description: 'A thoughtful debate between two hosts, illuminating different perspectives on your sources'
        }
    ];

    const languages = ['English', 'Spanish', 'Hindi', 'French', 'German', 'Japanese'];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isFundBuzz ? 'bg-slate-900/40 backdrop-blur-md' : 'bg-black/70 backdrop-blur-sm'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`${isFundBuzz ? 'bg-white border-slate-200' : 'bg-[#1a1a1a] border-white/10'} w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between px-6 py-4 border-b ${isFundBuzz ? 'bg-white border-slate-100' : 'bg-[#1a1a1a] border-white/10'}`}>
                        <div className="flex items-center gap-2">
                            <Sparkles className={`w-5 h-5 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`} />
                            <h2 className={`text-lg font-semibold ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>Customise Audio Overview</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors ${isFundBuzz ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-600' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto">
                        {/* Format Section */}
                        <div className="mb-8">
                            <h3 className={`text-sm font-medium mb-4 ${isFundBuzz ? 'text-slate-500' : 'text-gray-300'}`}>Format</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {formats.map((format) => (
                                    <button
                                        key={format.name}
                                        onClick={() => setSelectedFormat(format.name)}
                                        className={`relative p-5 rounded-xl text-left transition-all h-full flex flex-col border-2 ${selectedFormat === format.name
                                            ? (isFundBuzz ? 'bg-blue-50 border-blue-600' : 'bg-[#2a303c] border-transparent')
                                            : (isFundBuzz ? 'bg-slate-50 border-transparent hover:bg-slate-100' : 'bg-[#2a303c]/50 border-transparent hover:bg-[#2a303c]/80')
                                            }`}
                                    >
                                        <div className="flex justify-between items-start w-full mb-2">
                                            <div className={`font-medium ${isFundBuzz ? 'text-slate-900' : 'text-white'}`}>{format.name}</div>
                                            {selectedFormat === format.name && (
                                                <div className={`rounded-full p-0.5 ${isFundBuzz ? 'bg-blue-600' : 'bg-white'}`}>
                                                    <Check className={`w-3 h-3 ${isFundBuzz ? 'text-white' : 'text-black'}`} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`text-sm leading-relaxed ${isFundBuzz ? 'text-slate-500' : 'text-gray-400'}`}>
                                            {format.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 mb-8">
                            {/* Language Selection */}
                            <div>
                                <label className={`text-sm font-medium mb-3 block ${isFundBuzz ? 'text-slate-500' : 'text-gray-300'}`}>Choose language</label>
                                <div className="relative">
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className={`w-full border rounded-lg px-4 py-3 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isFundBuzz ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1a1a1a] border-white/20 text-white hover:border-white/40'
                                            }`}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang} value={lang} className={isFundBuzz ? 'bg-white text-slate-900' : 'bg-[#1a1a1a]'}>
                                                {lang}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Length Selection */}
                            <div>
                                <label className={`text-sm font-medium mb-3 block ${isFundBuzz ? 'text-slate-500' : 'text-gray-300'}`}>Length</label>
                                <div className={`inline-flex rounded-full p-1 border ${isFundBuzz ? 'bg-slate-50 border-slate-200' : 'bg-[#1a1a1a] border-white/20'}`}>
                                    {['Short', 'Default', 'Long'].map((length) => (
                                        <button
                                            key={length}
                                            onClick={() => setSelectedLength(length)}
                                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedLength === length
                                                ? (isFundBuzz ? 'bg-white text-blue-600 shadow-sm' : 'bg-[#2a303c] text-white')
                                                : (isFundBuzz ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white')
                                                }`}
                                        >
                                            {selectedLength === length && <Check className="w-3 h-3" />}
                                            {length}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Focus Area */}
                        <div>
                            <label className={`text-sm font-medium mb-3 block ${isFundBuzz ? 'text-slate-500' : 'text-gray-300'}`}>
                                What should the AI hosts focus on in this episode?
                            </label>
                            <div className="relative">
                                <textarea
                                    value={focusText}
                                    onChange={(e) => setFocusText(e.target.value)}
                                    rows={6}
                                    className={`w-full border rounded-lg px-4 py-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isFundBuzz ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-[#1a1a1a] border-white/20 text-white placeholder-gray-500'
                                        }`}
                                    placeholder="Things to try
• Focus on a specific source ('only cover the article about Italy')
• Focus on a specific topic ('just discuss the novel's main character')
• Target a specific audience ('explain to someone new to biology')"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`border-t px-6 py-4 flex justify-end ${isFundBuzz ? 'bg-white border-slate-100' : 'bg-[#1a1a1a] border-white/10'}`}>
                        <button
                            onClick={() => {
                                if (onGenerate) {
                                    onGenerate(selectedFormat, selectedLanguage, selectedLength, focusText);
                                    onClose();
                                }
                            }}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Generate
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

