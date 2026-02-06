'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Settings } from 'lucide-react';
import ProductSwitcher from '@/components/ProductSwitcher';
import { useProduct } from '@/lib/productContext';

export default function TopNavigation() {
    const { currentProduct } = useProduct();
    const pathname = usePathname();
    const isFundBuzz = currentProduct === 'fundbuzz';
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <header className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 transition-colors ${isFundBuzz ? 'bg-[#0f172a] border-slate-800' : 'bg-[#0f172a] border-white/10'}`}>
            <div className="flex items-center gap-8">
                <ProductSwitcher />

                <nav className="flex items-center gap-6">
                    <Link href="/dashboard">
                        <button className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-white border-b-[3px] border-orange-500 pb-0.5' : 'text-slate-400 hover:text-white'}`}>
                            My projects
                        </button>
                    </Link>
                    <Link href="/compliance">
                        <button className={`text-sm font-medium transition-colors ${isActive('/compliance') ? 'text-white border-b-[3px] border-orange-500 pb-0.5' : 'text-slate-400 hover:text-white'}`}>
                            Compliance Tracker
                        </button>
                    </Link>
                    <Link href="/schedule">
                        <button className={`text-sm font-medium transition-colors ${isActive('/schedule') ? 'text-white border-b-[3px] border-orange-500 pb-0.5' : 'text-slate-400 hover:text-white'}`}>
                            Post Schedule
                        </button>
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/trends">
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-orange-500 group ${isActive('/trends') ? 'bg-orange-500 text-black' : 'bg-[#0f172a] hover:bg-orange-500'}`}>
                        <TrendingUp className={`w-4 h-4 transition-colors ${isActive('/trends') ? 'text-black' : 'text-white group-hover:text-black'}`} />
                        <span className={`transition-colors ${isActive('/trends') ? 'text-black' : 'text-white group-hover:text-black'}`}>Financial Trends</span>
                    </button>
                </Link>

                <div className={`rounded-full p-2 transition-colors cursor-pointer border border-orange-500 bg-[#0f172a] hover:bg-slate-800`}>
                    <Settings className="w-5 h-5 text-orange-500" />
                </div>

                {/* Avatar */}
                <div className="relative">
                    <button
                        className="w-10 h-10 rounded-full bg-[#0f172a] border-2 border-orange-500 overflow-hidden relative"
                        title="Huong Totten"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        {/* Placeholder for professional avatar */}
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-orange-500 font-semibold">
                            HT
                        </div>
                    </button>

                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-0 mt-2 w-48 bg-[#0f172a] border border-orange-500 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
                            >
                                <Link href="/settings">
                                    <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-orange-500 hover:text-black transition-colors">
                                        Settings
                                    </button>
                                </Link>
                                <Link href="/">
                                    <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-orange-500 hover:text-black transition-colors border-t border-white/10">
                                        Logout
                                    </button>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
