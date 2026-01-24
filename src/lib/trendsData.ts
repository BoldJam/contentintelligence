export interface Trend {
    id: string;
    topic: string;
    platform: 'YouTube' | 'LinkedIn' | 'TikTok' | 'Google' | 'News';
    growth: number;
    volume: string;
    reason: string;
    timestamp: number;
    link?: string;
}

export async function fetchTrends(platform?: string): Promise<Trend[]> {
    try {
        const response = await fetch('/api/trends');
        if (!response.ok) throw new Error('Failed to fetch trends');

        const data: Trend[] = await response.json();

        if (platform && platform !== 'All') {
            return data.filter(t => t.platform === platform);
        }

        return data;
    } catch (error) {
        console.error('Error fetching trends:', error);
        return [];
    }
}

export async function refreshTrends(): Promise<Trend[]> {
    // The API route handles fetching fresh data
    return fetchTrends();
}
