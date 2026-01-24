import { motion } from 'framer-motion';
import { Youtube, Linkedin, Search, Newspaper, Video, TrendingUp, ArrowUpRight, Info } from 'lucide-react';
import type { Trend } from '@/lib/trendsData';
import { useProduct } from '@/lib/productContext';

interface TrendCardProps {
    trend: Trend;
    index: number;
}

export default function TrendCard({ trend, index }: TrendCardProps) {
    const { currentProduct } = useProduct();
    const isFundBuzz = currentProduct === 'fundbuzz';

    const getIcon = (platform: string) => {
        switch (platform) {
            case 'YouTube': return Youtube;
            case 'LinkedIn': return Linkedin;
            case 'Google': return Search;
            case 'News': return Newspaper;
            case 'TikTok': return Video;
            default: return TrendingUp;
        }
    };

    const getColor = (platform: string) => {
        switch (platform) {
            case 'YouTube': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'LinkedIn': return 'text-blue-600 bg-blue-600/10 border-blue-600/20';
            case 'Google': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'News': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'TikTok': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const Icon = getIcon(trend.platform);
    const colorClass = getColor(trend.platform);

    const getVolumeDescription = (volume: string) => {
        if (volume.includes('Breaking')) return 'High velocity news coverage hitting major outlets.';
        if (volume.includes('Professional')) return 'Trending in industry circles and professional networks.';
        if (volume.includes('Academic')) return 'High interest in new research papers and studies.';
        if (volume.includes('Public')) return 'Broad mainstream attention and general public interest.';
        if (volume.includes('Viral')) return 'Explosive social engagement and sharing.';
        if (volume.includes('High velocity')) return 'Rapidly growing search interest.';
        return 'Significant search volume and engagement.';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative border rounded-2xl p-5 cursor-pointer transition-all ${isFundBuzz
                ? 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg shadow-sm'
                : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-green-600 bg-green-600/10 px-2 py-1 rounded-lg text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{trend.growth}%</span>
                </div>
            </div>

            <h3 className={`text-lg font-semibold mb-2 line-clamp-2 transition-colors ${isFundBuzz ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-primary'
                }`}>
                {trend.topic}
            </h3>

            <p className={`text-sm mb-4 line-clamp-2 ${isFundBuzz ? 'text-slate-600' : 'text-gray-400'}`}>
                {trend.reason}
            </p>

            <div className={`flex items-center justify-between text-xs border-t pt-4 ${isFundBuzz ? 'text-slate-500 border-slate-100' : 'text-gray-500 border-white/5'
                }`}>
                <div className="flex items-center gap-1.5 relative group/tooltip">
                    <span className={`font-medium ${isFundBuzz ? 'text-slate-500' : 'text-gray-400'}`}>{trend.volume} volume</span>
                    <Info className={`w-3 h-3 cursor-pointer ${isFundBuzz ? 'text-slate-400' : 'text-gray-500'}`} />

                    {/* Tooltip */}
                    <div className={`absolute bottom-full left-0 mb-2 w-48 p-2 rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 border ${isFundBuzz ? 'bg-white border-slate-200' : 'bg-slate-800 border-white/10'
                        }`}>
                        <p className={`text-[10px] leading-tight ${isFundBuzz ? 'text-slate-600' : 'text-gray-300'}`}>
                            {getVolumeDescription(trend.volume)}
                        </p>
                        <div className={`absolute bottom-[-4px] left-4 w-2 h-2 rotate-45 border-r border-b ${isFundBuzz ? 'bg-white border-slate-200' : 'bg-slate-800 border-white/10'
                            }`}></div>
                    </div>
                </div>
                <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium ${isFundBuzz ? 'text-blue-600' : 'text-primary'
                    }`}>
                    <span>View details</span>
                    <ArrowUpRight className="w-3 h-3" />
                </div>
            </div>
        </motion.div>
    );
}
