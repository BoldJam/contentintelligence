'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-20">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Next-Generation Content Intelligence
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-[1.1]">
            Intelligence-Driven <br />
            <span className="text-gradient">Creation</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Synthesize deep source data, generate high-fidelity content, and
          accelerate compliance in one unified platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10"
        >
          <Link href="/auth" className="group px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-white/5">
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-10 py-5 bg-white backdrop-blur-md text-black rounded-2xl font-bold text-lg hover:bg-white/90 transition-all border border-white/10 cursor-default">
            Watch the Demo
          </button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-20 relative px-4"
        >
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)] border border-white/10">
            <img
              src="/images/hero_visual.png"
              alt="Intelligence Creation Illustration"
              className="w-full h-auto object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </section>
  );
}
