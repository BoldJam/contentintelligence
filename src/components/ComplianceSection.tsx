'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Users, FileSearch } from 'lucide-react';

const points = [
    {
        title: 'Live Citations',
        description: 'Every claim generated is automatically linked back to its primary source.',
        icon: CheckCircle2,
    },
    {
        title: 'Shared Workspaces',
        description: 'Invite compliance teams to review research and content in real-time.',
        icon: Users,
    },
    {
        title: 'Verification Logs',
        description: 'Maintain a full audit trail of source material for every asset.',
        icon: FileSearch,
    },
];

export default function ComplianceSection() {
    return (
        <section className="py-32 px-4 relative z-10 bg-slate-900 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Enterprise-Ready Compliance
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
                            Scale with <br />
                            <span className="text-emerald-500">Confidence</span>
                        </h2>

                        <p className="text-xl text-gray-400 mb-12 leading-relaxed font-light">
                            Accelerate your approval pipeline without sacrificing accuracy. Our unified compliance loop ensures every insight is verified before it leaves the platform.
                        </p>

                        <div className="space-y-6">
                            {points.map((point, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="mt-1 p-1 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                        <point.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{point.title}</h4>
                                        <p className="text-gray-400 font-light">{point.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 relative flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                            {/* Decorative logic simulation */}
                            <div className="w-full h-full rounded-2xl bg-slate-800/50 border border-white/10 backdrop-blur-xl relative z-10 p-8 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-2/3 h-2 bg-emerald-500/30 rounded-full" />
                                    <div className="w-full h-2 bg-white/5 rounded-full" />
                                    <div className="w-4/5 h-2 bg-white/5 rounded-full" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-gray-600" />
                                        ))}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/20">
                                        VERIFIED
                                    </div>
                                </div>
                            </div>

                            {/* Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
