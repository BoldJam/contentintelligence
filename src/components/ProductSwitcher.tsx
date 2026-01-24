'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useProduct, ProductType } from '@/lib/productContext';

export default function ProductSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { currentProduct, setProduct, theme } = useProduct();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const products = [
        { id: 'akari' as ProductType, name: 'Akari v2', logo: '/logo.png' },
        { id: 'fundbuzz' as ProductType, name: 'Fund Buzz', logo: '/fundbuzz-logo.svg' },
    ];

    const handleProductChange = (productId: ProductType) => {
        setProduct(productId);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Current Product Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors group"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                    <img src={theme.logo} alt={`${theme.displayName} Logo`} className="w-full h-full object-cover" />
                </div>
                <span className={`text-xl font-semibold ${currentProduct === 'fundbuzz' ? 'text-slate-900' : 'text-white'}`}>{theme.displayName}</span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full left-0 mt-2 w-56 border rounded-xl shadow-xl overflow-hidden z-50 ${currentProduct === 'fundbuzz' ? 'bg-white border-slate-200' : 'bg-slate-800 border-white/10'}`}
                    >
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleProductChange(product.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${currentProduct === product.id ? (currentProduct === 'fundbuzz' ? 'bg-slate-100' : 'bg-white/5') : (currentProduct === 'fundbuzz' ? 'hover:bg-slate-50' : 'hover:bg-white/5')
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                                    <img src={product.logo} alt={`${product.name} Logo`} className="w-full h-full object-cover" />
                                </div>
                                <span className={`font-medium ${currentProduct === 'fundbuzz' ? 'text-slate-900' : 'text-white'}`}>{product.name}</span>
                                {currentProduct === product.id && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
