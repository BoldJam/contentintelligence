'use client';

import { motion } from 'framer-motion';
import { Layers, Zap, ShieldCheck } from 'lucide-react';

const features = [
    {
        title: 'Source Synthesis',
        description: 'Cross-correlate fragmented data into a unified intelligence report. Navigate journals, transcripts, and records with deep semantic insight.',
        icon: Layers,
        color: 'text-blue-500',
        delay: 0.2,
    },
    {
        title: 'High-Fidelity Studio',
        description: 'Transform complex research into social-ready marketing assets. Tailor formats, layouts, and style boosts to your unique brand voice.',
        icon: Zap,
        color: 'text-pink-500',
        delay: 0.4,
    },
    {
        title: 'Seamless Collaboration',
        description: 'Streamline the approval loop. Sync with teams instantly to ensure every claim is backed by verified, compliance-ready source citations.',
        icon: ShieldCheck,
        color: 'text-emerald-500',
        delay: 0.6,
    },
];

export default function Features() {
    return (
        <section className="py-32 px-4 relative z-10 bg-slate-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Built for <span className="text-gradient">Impact</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        A unified workflow designed to take you from raw evidence to verified content in minutes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: feature.delay }}
                            className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className={`mb-8 p-5 rounded-2xl bg-white/5 w-fit ${feature.color} group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-black/20`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-lg font-light">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
