import { ShieldCheck, BookOpen, TrendingUp, Quote, AlertTriangle, Zap } from 'lucide-react';

export const papers = [
    {
        id: 1,
        title: "The Future of AI in Healthcare: A Comprehensive Review",
        author: "Sarah J. Connor",
        year: "2024",
        badges: [
            { icon: ShieldCheck, color: "text-green-400", bg: "bg-green-400/10", tooltip: "Akari Recommended" },
            { icon: BookOpen, color: "text-orange-400", bg: "bg-orange-400/10", tooltip: "Rigorous Journal" },
            { icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-400/10", tooltip: "Trending" },
            { icon: Quote, color: "text-blue-400", bg: "bg-blue-400/10", tooltip: "High Citation Count" }
        ]
    },
    {
        id: 2,
        title: "Deep Learning Architectures for Medical Image Analysis",
        author: "Michael Chen, et al.",
        year: "2023",
        badges: [
            { icon: ShieldCheck, color: "text-green-400", bg: "bg-green-400/10", tooltip: "Akari Recommended" },
            { icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-400/10", tooltip: "Trending" }
        ]
    },
    {
        id: 3,
        title: "Ethical Considerations in Autonomous Systems",
        author: "Dr. Emily Vance",
        year: "2023",
        badges: [
            { icon: ShieldCheck, color: "text-green-400", bg: "bg-green-400/10", tooltip: "Akari Recommended" },
            { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10", tooltip: "Controversial Topic" }
        ]
    },
    {
        id: 4,
        title: "Quantum Computing: Breaking the Barriers",
        author: "David R. Smith",
        year: "2024",
        badges: [
            { icon: Zap, color: "text-purple-400", bg: "bg-purple-400/10", tooltip: "Breakthrough Tech" }
        ]
    },
    {
        id: 5,
        title: "Sustainable Energy Solutions for Urban Environments",
        author: "Green Earth Initiative",
        year: "2022",
        badges: [
            { icon: BookOpen, color: "text-orange-400", bg: "bg-orange-400/10", tooltip: "Rigorous Journal" }
        ]
    },
    {
        id: 6,
        title: "Neuroplasticity and Learning: New Insights",
        author: "Brain Research Institute",
        year: "2023",
        badges: [
            { icon: Quote, color: "text-blue-400", bg: "bg-blue-400/10", tooltip: "High Citation Count" }
        ]
    },
    {
        id: 7,
        title: "The Impact of Social Media on Mental Health",
        author: "Global Health Watch",
        year: "2024",
        badges: [
            { icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-400/10", tooltip: "Trending" }
        ]
    }
];
