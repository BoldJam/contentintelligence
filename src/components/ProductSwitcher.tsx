'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useProduct, ProductType } from '@/lib/productContext';

export default function ProductSwitcher() {
    const { theme } = useProduct();
    return (
        <div className="relative">
            {/* Current Product Button */}
            <button
                className="flex items-center gap-3 hover:bg-orange-500 rounded-lg px-2 py-1.5 transition-colors group"
                onClick={() => window.location.href = '/dashboard'}
            >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                    <img src={theme.logo} alt={`${theme.displayName} Logo`} className="w-full h-full object-cover" />
                </div>
                <span className={`text-xl font-semibold text-white group-hover:text-black transition-colors`}>{theme.displayName}</span>
            </button>
        </div>
    );
}
