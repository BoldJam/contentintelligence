'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Clock, Filter, Search, Settings } from 'lucide-react';
import { fetchTrends, refreshTrends, type Trend } from '@/lib/trendsData';
import TrendCard from '@/components/TrendCard';

const PLATFORMS = ['All', 'YouTube', 'LinkedIn', 'TikTok', 'Google', 'News'];

export default function TrendsPage() {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        loadTrends();
    }, [selectedPlatform]);

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
            setTrends(data);
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
            const filtered = selectedPlatform === 'All'
                ? data
                : data.filter(t => t.platform === selectedPlatform);
            setTrends(filtered);
        } catch (error) {
            console.error('Failed to refresh trends:', error);
        } finally {
            setLoading(false);
            setLastUpdated(new Date());
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-900/80 backdrop-blur-md z-20 py-4 -mx-6 px-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Trending Topics
                            <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">North America</span>
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Real-time analysis</span>
                            <span>•</span>
                            <span className="text-blue-400">Source: Google Trends & News</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 pr-3 border border-white/10">
                        <button
                            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                            className={`p-1.5 rounded-md transition-all ${isAutoRefresh ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Clock className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium text-gray-400">
                            {isAutoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
                        </span>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                {PLATFORMS.map(platform => (
                    <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedPlatform === platform
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {platform}
                    </button>
                ))}
            </div>

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
                                className="aspect-[4/3] bg-white/5 rounded-2xl animate-pulse"
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
                <div className="text-center py-20 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No trending topics found for this filter.</p>
                </div>
            )}
        </div>
    );
}
