import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '@/lib/productContext';

export default function LanguageSelector() {
    const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
    const [isExpanded, setIsExpanded] = useState(false);
    const { currentProduct } = useProduct();

    const languages = [
        { name: 'English (US)', native: 'English (US)', flag: '🇺🇸' },
        { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
        { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
        { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
        { name: 'Tagalog', native: 'Tagalog', flag: '🇵🇭' },
        { name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' }
    ];

    const selectedNative = languages.find(l => l.name === selectedLanguage)?.native || selectedLanguage;
    const selectedFlag = languages.find(l => l.name === selectedLanguage)?.flag || '🇺🇸';

    const isFundBuzz = currentProduct === 'fundbuzz';

    return (
        <div className={`relative p-[1px] rounded-xl overflow-hidden mb-4 group ${isFundBuzz ? 'border border-white/10' : ''}`}>
            {/* Animated Gradient Border - only for non-Fund Buzz */}
            {!isFundBuzz && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-[shimmer_2s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity" />
            )}

            <div className="relative bg-slate-900 rounded-xl overflow-hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                    <div className={`flex items-center gap-2 ${isFundBuzz ? 'text-blue-600' : 'text-pink-300'}`}>
                        <Sparkles className={`w-3 h-3 shrink-0 ${!isFundBuzz ? 'animate-pulse' : ''}`} />
                        <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Content Language</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isExpanded && (
                            <span className="text-lg shrink-0">{selectedFlag}</span>
                        )}
                        {isExpanded ? (
                            <ChevronUp className="w-3 h-3 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        )}
                    </div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="px-3 pb-3 pt-0">
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 pt-2 border-t border-white/10">
                                    {languages.map((lang, index) => (
                                        <React.Fragment key={lang.name}>
                                            <button
                                                onClick={() => {
                                                    setSelectedLanguage(lang.name);
                                                    setIsExpanded(false);
                                                }}
                                                className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-white ${selectedLanguage === lang.name ? (isFundBuzz ? 'text-blue-600 font-bold' : 'text-pink-400 font-medium') : ''}`}
                                            >
                                                <span className="text-sm">{lang.flag}</span>
                                                <span>{lang.native}</span>
                                            </button>
                                            {index < languages.length - 1 && <span className="text-gray-500">|</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 italic">
                                    Generated using AI translations. BETA.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

