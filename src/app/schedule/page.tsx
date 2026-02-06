'use client';

import TopNavigation from '@/components/TopNavigation';
import { useState, useMemo, useEffect } from 'react';
import { MoreHorizontal, Calendar, TrendingUp, Eye, MousePointerClick, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';

// Type Definitions
interface PublishedPost {
    id: string;
    name: string;
    impressions: string;
    engagement: string;
    clicks: string;
    date: string;
}

interface ScheduledPost {
    id: string;
    name: string;
    date: string;
}

interface ApprovedPost {
    id: string;
    name: string;
    approvedBy: string;
    date: string;
}

type AnyPost = PublishedPost | ScheduledPost | ApprovedPost;


// Mock Data Generators
const generatePublishedPosts = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `pub-${i}`,
        name: `AI Trends Vol. ${i + 1}: ${['Compliance', 'ESG', 'Growth', 'Tech'][i % 4]}`,
        impressions: (1000 + Math.floor(Math.random() * 2000)).toLocaleString(),
        engagement: (100 + Math.floor(Math.random() * 500)).toLocaleString(),
        clicks: (20 + Math.floor(Math.random() * 100)).toLocaleString(),
        date: `Oct ${25 - (i % 20)}, 2025`
    }));
};

const generateScheduledPosts = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `sch-${i}`,
        name: `Draft: ${['Market Recap', 'Webinar Teaser', 'Product Launch', 'Client Story'][i % 4]}`,
        date: `Nov ${1 + (i % 10)}, 2025 • ${10 + (i % 5)}:00 AM`
    }));
};

const generateApprovedPosts = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `app-${i}`,
        name: `${['Q4 Strategy', 'Team Intro', 'Sustainability Rpt', 'Reg Update'][i % 4]}`,
        approvedBy: i % 2 === 0 ? 'Huong Totten' : 'James Miller',
        date: `Oct ${26 - (i % 5)}, 2025`
    }));
};

export default function SchedulePage() {
    const [activeTab, setActiveTab] = useState('published');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Memoize mock data to prevent regeneration on render
    const allPosts = useMemo(() => ({
        published: generatePublishedPosts(25),
        scheduled: generateScheduledPosts(12),
        approved: generateApprovedPosts(8)
    }), []);

    // Derived KPIs
    const kpis = [
        { label: 'Published Posts', value: allPosts.published.length, growth: '+4.26%', color: 'text-green-600' },
        { label: 'Scheduled Posts', value: allPosts.scheduled.length, growth: '+2.15%', color: 'text-green-600' },
        { label: 'Approved Content', value: allPosts.approved.length, growth: '+5.50%', color: 'text-green-600' },
    ];

    const brandHealth = {
        name: 'Bold AI LinkedIn',
        reach: '4,325',
        reachGrowth: '+3.56%',
        engagement: '2,352',
        engagementGrowth: '+50%',
        scheduled: allPosts.scheduled.length
    };

    const recentPosts = [
        {
            id: 1,
            author: 'Bold AI',
            time: '2h ago',
            content: 'Excited to announce our latest feature for compliance automation! #FinTech #AI',
            stats: { impressions: '1.2k', engagement: '140', clicks: '45' }
        },
        {
            id: 2,
            author: 'Bold AI',
            time: '1d ago',
            content: 'Check out our new guide on ESG reporting standards. Link in comments.',
            stats: { impressions: '3.4k', engagement: '280', clicks: '120' }
        },
        {
            id: 3,
            author: 'Bold AI',
            time: '3d ago',
            content: 'Great session at the FinTech Summit yesterday! Thanks to everyone who stopped by.',
            stats: { impressions: '2.1k', engagement: '190', clicks: '55' }
        }
    ];

    // Reset page on tab change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    // Pagination Logic
    const currentData = allPosts[activeTab as keyof typeof allPosts];
    const totalPages = Math.ceil(currentData.length / itemsPerPage);
    const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <TopNavigation />

            <div className="p-6 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* LEFT PANE (70%) */}
                    <div className="w-full lg:w-[70%] space-y-6 flex flex-col">

                        {/* KPI Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {kpis.map((kpi, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-orange-200 transition-colors">
                                    <h3 className="text-slate-500 text-sm font-medium mb-2">{kpi.label}</h3>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-bold text-slate-900">{kpi.value}</span>
                                        <span className={`text-sm font-semibold mb-1 ${kpi.color}`}>{kpi.growth}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Brand Health Section */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                    Brand Health
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                                <th className="pb-3 font-medium pl-2">Account Name</th>
                                                <th className="pb-3 font-medium">Reach</th>
                                                <th className="pb-3 font-medium">Engagement</th>
                                                <th className="pb-3 font-medium">Scheduled Posts</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            <tr className="group">
                                                <td className="py-4 pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 border border-slate-200">
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="w-5 h-5 object-contain" />
                                                        </div>
                                                        <span className="font-medium text-slate-900">{brandHealth.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div>
                                                        <span className="text-slate-900 block">{brandHealth.reach}</span>
                                                        <span className="text-green-600 text-xs">{brandHealth.reachGrowth}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div>
                                                        <span className="text-slate-900 block">{brandHealth.engagement}</span>
                                                        <span className="text-green-600 text-xs">{brandHealth.engagementGrowth}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-slate-900 pl-4 font-mono text-lg">{brandHealth.scheduled}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* All Posts Section */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[400px] flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <h2 className="text-lg font-bold text-slate-900">All Posts</h2>
                                <div className="flex p-1 bg-slate-100 rounded-lg">
                                    {['published', 'scheduled', 'approved'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab
                                                ? 'bg-white text-orange-600 shadow-sm ring-1 ring-slate-200'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                                                }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-0 flex-1">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                            <th className="px-6 py-4 font-medium max-w-[300px]">Content Name</th>
                                            {activeTab === 'published' && (
                                                <>
                                                    <th className="px-6 py-4 font-medium">Impressions</th>
                                                    <th className="px-6 py-4 font-medium">Engagement</th>
                                                    <th className="px-6 py-4 font-medium">Clicks</th>
                                                    <th className="px-6 py-4 font-medium text-right">Date</th>
                                                </>
                                            )}
                                            {activeTab === 'scheduled' && (
                                                <th className="px-6 py-4 font-medium">Scheduled Date</th>
                                            )}
                                            {activeTab === 'approved' && (
                                                <>
                                                    <th className="px-6 py-4 font-medium">Approved By</th>
                                                    <th className="px-6 py-4 font-medium">Date Approved</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {activeTab === 'published' && (paginatedData as PublishedPost[]).map((post) => (
                                            <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[300px]">{post.name}</td>
                                                <td className="px-6 py-4 text-slate-600">{post.impressions}</td>
                                                <td className="px-6 py-4 text-slate-600">{post.engagement}</td>
                                                <td className="px-6 py-4 text-slate-600">{post.clicks}</td>
                                                <td className="px-6 py-4 text-slate-500 text-right text-sm">{post.date}</td>
                                            </tr>
                                        ))}
                                        {activeTab === 'scheduled' && (paginatedData as ScheduledPost[]).map((post) => (
                                            <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[300px]">{post.name}</td>
                                                <td className="px-6 py-4 text-orange-600 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {post.date}
                                                </td>
                                            </tr>
                                        ))}
                                        {activeTab === 'approved' && (paginatedData as ApprovedPost[]).map((post) => (
                                            <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[300px]">{post.name}</td>
                                                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold border border-orange-200">
                                                        {post.approvedBy.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    {post.approvedBy}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-sm">{post.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                                    <p className="text-sm text-slate-500">
                                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, currentData.length)}</span> of <span className="font-medium">{currentData.length}</span> results
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-slate-200 text-slate-500"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                                                        ? 'bg-orange-500 text-white shadow-sm'
                                                        : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-slate-200 text-slate-500"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANE (30%) */}
                    <div className="w-full lg:w-[30%] space-y-6 flex flex-col">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900">Recent Posts</h2>
                            </div>
                            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                {recentPosts.map((post) => (
                                    <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-orange-300 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center shrink-0 border border-slate-100">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="w-6 h-6 object-contain" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h3 className="text-sm font-semibold text-slate-900">{post.author}</h3>
                                                    <p className="text-xs text-slate-500">{post.time}</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <p className="text-sm text-slate-700 mb-3 line-clamp-3">
                                            {post.content}
                                        </p>

                                        <div className="h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center border border-slate-200 text-slate-400">
                                            <span className="text-sm">Image Placeholder</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                                            <div className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{post.stats.impressions}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer">
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                <span>{post.stats.engagement}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer">
                                                <MousePointerClick className="w-3.5 h-3.5" />
                                                <span>{post.stats.clicks}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
