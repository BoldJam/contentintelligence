'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Clock, Filter, Search, Settings } from 'lucide-react';
import { fetchTrends, refreshTrends, type Trend } from '@/lib/trendsData';
import TrendCard from '@/components/TrendCard';
import { useProduct } from '@/lib/productContext';

const PLATFORMS = ['All', 'YouTube', 'LinkedIn', 'TikTok', 'Google', 'News'];

import TopNavigation from '@/components/TopNavigation';

export default function TrendsPage() {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    useEffect(() => {
        loadTrends();
    }, [selectedPlatform, currentProduct]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoRefresh) {
            interval = setInterval(() => {
                handleRefresh();
            }, 10000); // Auto-refresh every 10s for demo purposes
        }
        return () => clearInterval(interval);
    }, [isAutoRefresh, selectedPlatform]);

    const loadTrends = async () => {
        setLoading(true);
        try {
            const data = await fetchTrends(selectedPlatform);
            // In Fund Buzz, filter out health/science news
            const filtered = isFundBuzz
                ? data.filter(t => !t.id.includes('Health') && !t.id.includes('Science'))
                : data;
            setTrends(filtered);
        } catch (error) {
            console.error('Failed to load trends:', error);
        } finally {
            setLoading(false);
            setLastUpdated(new Date());
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const data = await refreshTrends();
            let filtered = selectedPlatform === 'All'
                ? data
                : data.filter(t => t.platform === selectedPlatform);

            if (isFundBuzz) {
                filtered = filtered.filter(t => !t.id.includes('Health') && !t.id.includes('Science'));
            }

            setTrends(filtered);
        } catch (error) {
            console.error('Failed to refresh trends:', error);
        } finally {
            setLoading(false);
            setLastUpdated(new Date());
        }
    };

    return (
        <div className={`min-h-screen transition-colors ${isFundBuzz ? 'bg-slate-50 text-slate-900' : 'bg-slate-900 text-white'}`}>
            <TopNavigation />

            <div className="p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Trending Topics
                            <span className={`text-xs font-normal px-2 py-0.5 rounded-full border ${isFundBuzz ? 'bg-white text-slate-600 border-slate-200' : 'text-gray-500 bg-white/5 border-white/10'
                                }`}>North America</span>
                        </h1>
                        <div className="flex items-center gap-2 text-xs mt-1">
                            <span className={isFundBuzz ? 'text-slate-500' : 'text-gray-400'}>Real-time analysis</span>
                            <span className={isFundBuzz ? 'text-slate-300' : 'text-gray-600'}>•</span>
                            <span className={isFundBuzz ? 'text-blue-600' : 'text-blue-400'}>Source: Google News (Finance)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 rounded-lg p-1 pr-3 border transition-colors ${isFundBuzz ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
                            }`}>
                            <button
                                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                                className={`p-1.5 rounded-md transition-all ${isAutoRefresh ? 'bg-green-500/20 text-green-400' : (isFundBuzz ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white')}`}
                            >
                                <Clock className="w-4 h-4" />
                            </button>
                            <span className={`text-xs font-medium ${isFundBuzz ? 'text-slate-500' : 'text-gray-400'}`}>
                                {isAutoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
                            </span>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm ${isFundBuzz ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-white'
                                }`}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters - Only show for Akari */}
                {!isFundBuzz && (
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        <Filter className="w-4 h-4 text-gray-500 mr-2" />
                        {PLATFORMS.map(platform => (
                            <button
                                key={platform}
                                onClick={() => setSelectedPlatform(platform)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-sm border ${selectedPlatform === platform
                                    ? 'bg-white text-black border-white'
                                    : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            // Skeleton Loading
                            Array.from({ length: 8 }).map((_, i) => (
                                <motion.div
                                    key={`skeleton-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`aspect-[4/3] rounded-2xl animate-pulse ${isFundBuzz ? 'bg-slate-200' : 'bg-white/5'}`}
                                />
                            ))
                        ) : (
                            trends.map((trend, index) => (
                                <TrendCard key={trend.id} trend={trend} index={index} />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {!loading && trends.length === 0 && (
                    <div className="text-center py-20">
                        <Search className={`w-12 h-12 mx-auto mb-4 opacity-20 ${isFundBuzz ? 'text-slate-900' : 'text-white'}`} />
                        <p className={isFundBuzz ? 'text-slate-500' : 'text-gray-500'}>No trending topics found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
