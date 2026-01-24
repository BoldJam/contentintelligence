'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, CheckCircle2, Clock, FileText, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getAllProjects, loadProject, saveProject } from '@/lib/projectStorage';
import type { GeneratedContent, Project } from '@/types/project';
import ProductSwitcher from '@/components/ProductSwitcher';
import { useProduct } from '@/lib/productContext';

interface ComplianceItem {
    projectId: string;
    projectName: string;
    content: GeneratedContent;
}

export default function CompliancePage() {
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';
    const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);

    useEffect(() => {
        loadComplianceData();
    }, []);

    const loadComplianceData = () => {
        const metadata = getAllProjects();
        const allItems: ComplianceItem[] = [];

        metadata.forEach(meta => {
            const project = loadProject(meta.id);
            if (project && project.generatedContent) {
                project.generatedContent.forEach(content => {
                    allItems.push({
                        projectId: project.id,
                        projectName: project.title,
                        content: content
                    });
                });
            }
        });

        // Sort by most recent
        allItems.sort((a, b) => new Date(b.content.createdAt).getTime() - new Date(a.content.createdAt).getTime());
        setComplianceItems(allItems);
    };

    const handleUpdateStatus = (projectId: string, contentId: string, newStatus: GeneratedContent['complianceStatus']) => {
        const project = loadProject(projectId);
        if (project) {
            project.generatedContent = project.generatedContent.map(item =>
                item.id === contentId ? { ...item, complianceStatus: newStatus } : item
            );
            saveProject(project);
            loadComplianceData(); // Refresh local state
        }
    };

    const getStatusStyles = (status?: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Review':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            default:
                return 'bg-slate-50 text-slate-500 border-slate-200';
        }
    };

    return (
        <div className={`min-h-screen p-6 transition-colors duration-300 ${isFundBuzz ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
            {/* Header */}
            <header className={`flex items-center justify-between p-4 border-b sticky top-0 z-10 transition-colors ${isFundBuzz ? 'bg-white border-slate-100' : 'bg-slate-900 border-white/10'}`}>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        <h1 className="text-xl font-bold tracking-tight">Compliance Tracking</h1>
                    </div>
                </div>
                <ProductSwitcher />
            </header>

            <main className="max-w-6xl mx-auto py-12">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-2">Review Management</h2>
                    <p className="text-slate-500">Monitor and approve generated content across all your active projects.</p>
                </div>

                {/* Table */}
                <div className={`border rounded-[2rem] overflow-hidden shadow-sm ${isFundBuzz ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'}`}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b transition-colors ${isFundBuzz ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/10'}`}>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Project Name</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Content Name</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 transition-colors">
                            {complianceItems.length > 0 ? (
                                complianceItems.map((item, idx) => (
                                    <motion.tr
                                        key={`${item.projectId}-${item.content.id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group hover:bg-slate-50/50 transition-colors`}
                                    >
                                        <td className="px-6 py-5">
                                            <Link href={`/project/${item.projectId}`} className="font-medium text-slate-900 hover:text-blue-600 transition-colors">
                                                {item.projectName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500/20 ring-1 ring-blue-500/40" />
                                                <span className="text-slate-600">{item.content.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 capitalize">
                                                <FileText className="w-3 h-3" />
                                                {item.content.format || item.content.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="relative inline-block w-32">
                                                <select
                                                    value={item.content.complianceStatus || 'Draft'}
                                                    onChange={(e) => handleUpdateStatus(item.projectId, item.content.id, e.target.value as any)}
                                                    className={`w-full appearance-none px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${getStatusStyles(item.content.complianceStatus)}`}
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Review">Review</option>
                                                    <option value="Approved">Approved</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <p className="text-slate-400 font-medium">No content pending compliance review.</p>
                                            <Link href="/dashboard" className="text-blue-600 text-sm font-semibold hover:underline">
                                                Start a new project
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
