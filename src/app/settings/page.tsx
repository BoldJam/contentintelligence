'use client';

import { useState } from 'react';
import TopNavigation from '@/components/TopNavigation';
import { User, Palette, Link as LinkIcon, Upload, Check } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('personal');
    const [selectedFont, setSelectedFont] = useState('Inter');
    const [selectedPalette, setSelectedPalette] = useState(0);

    const fonts = [
        'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
        'Poppins', 'Raleway', 'Ubuntu', 'Merriweather', 'Playfair Display'
    ];

    const palettes = [
        ['#0ea5e9', '#64748b', '#cbd5e1'], // Blue/Slate
        ['#f97316', '#1e293b', '#94a3b8'], // Orange/Dark
        ['#10b981', '#065f46', '#d1fae5'], // Emerald
        ['#8b5cf6', '#4c1d95', '#ddd6fe'], // Violet
        ['#ec4899', '#831843', '#fbcfe8'], // Pink
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <TopNavigation />

            <div className="max-w-6xl mx-auto p-8 flex gap-8">
                {/* Left Sidebar - Tabs */}
                <div className="w-64 shrink-0 space-y-2">
                    <h2 className="text-xl font-bold mb-6 px-4">Settings</h2>

                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'personal' ? 'bg-orange-500 text-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <User className="w-5 h-5" />
                        Personal Details
                    </button>
                    <button
                        onClick={() => setActiveTab('brand')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'brand' ? 'bg-orange-500 text-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Palette className="w-5 h-5" />
                        Brand
                    </button>
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'integrations' ? 'bg-orange-500 text-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <LinkIcon className="w-5 h-5" />
                        Integrations
                    </button>
                </div>

                {/* Right Content */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 text-slate-900">
                    {activeTab === 'personal' && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-slate-900">Personal Details</h3>

                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-orange-500 flex items-center justify-center text-3xl font-bold text-orange-500">
                                    HT
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium transition-colors text-black">
                                    Change Picture
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-500">Full Name</label>
                                    <input type="text" defaultValue="Huong Totten" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-500">Display Name</label>
                                    <input type="text" defaultValue="Huong" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-500">Company Name</label>
                                    <input type="text" defaultValue="Bold AI" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-500">Email Address</label>
                                    <input type="email" defaultValue="huong@boldai.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 font-medium" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="px-6 py-2.5 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'brand' && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-slate-900">Brand Settings</h3>

                            {/* Typography */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-slate-700">Typography</h4>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                    {fonts.map(font => (
                                        <button
                                            key={font}
                                            onClick={() => setSelectedFont(font)}
                                            className={`p-3 rounded-lg border text-sm transition-all ${selectedFont === font ? 'bg-orange-500 text-black border-orange-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                                            style={{ fontFamily: font }}
                                        >
                                            {font}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Palette */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-slate-700">Color Palette</h4>
                                <div className="flex gap-4 flex-wrap">
                                    {palettes.map((colors, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedPalette(idx)}
                                            className={`p-1 rounded-xl border-2 transition-all ${selectedPalette === idx ? 'border-orange-500' : 'border-transparent'}`}
                                        >
                                            <div className="flex h-16 w-24 rounded-lg overflow-hidden ring-1 ring-slate-200 shadow-sm">
                                                <div className="flex-1" style={{ backgroundColor: colors[0] }} />
                                                <div className="flex-1" style={{ backgroundColor: colors[1] }} />
                                                <div className="flex-1" style={{ backgroundColor: colors[2] }} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-slate-900">Integrations</h3>

                            <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="w-8 h-8 object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900">LinkedIn</h4>
                                        <p className="text-sm text-slate-500 mt-1 max-w-sm">Connect your professional network for compliance tracking and content distribution.</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 transition-colors">
                                    Connect
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
