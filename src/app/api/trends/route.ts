import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

const FEEDS = {
    TRENDS: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US',
    NEWS_HEALTH: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtdHZLQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen',
    NEWS_SCIENCE: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtdHZHZ0pMVWlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
    NEWS_FINANCE: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZd0NpQW1WdnNnQVAB?hl=en-US&gl=US&ceid=US%3Aen'
};

interface TrendItem {
    id: string;
    topic: string;
    platform: 'YouTube' | 'LinkedIn' | 'TikTok' | 'Google' | 'News';
    growth: number;
    volume: string;
    reason: string;
    timestamp: number;
    link: string;
}

async function fetchFeed(url: string) {
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const xml = await response.text();
        return parser.parse(xml);
    } catch (error) {
        console.error(`Error fetching feed ${url}:`, error);
        return null;
    }
}

export async function GET() {
    try {
        const [trendsData, healthData, scienceData, financeData] = await Promise.all([
            fetchFeed(FEEDS.TRENDS),
            fetchFeed(FEEDS.NEWS_HEALTH),
            fetchFeed(FEEDS.NEWS_SCIENCE),
            fetchFeed(FEEDS.NEWS_FINANCE)
        ]);

        const allTrends: TrendItem[] = [];

        // Process Google Trends
        if (trendsData?.rss?.channel?.item) {
            const items = Array.isArray(trendsData.rss.channel.item)
                ? trendsData.rss.channel.item
                : [trendsData.rss.channel.item];

            items.forEach((item: any, index: number) => {
                const traffic = item['ht:approx_traffic'] || '10k+';
                // Map to Google (primary)
                allTrends.push({
                    id: `google-${index}`,
                    topic: item.title,
                    platform: 'Google',
                    growth: 100 + Math.floor(Math.random() * 400), // Simulated growth
                    volume: traffic,
                    reason: item.description || 'High search volume today',
                    timestamp: new Date(item.pubDate).getTime(),
                    link: item.link
                });

                // Map to YouTube/TikTok (inferred viral potential)
                if (index % 2 === 0) {
                    allTrends.push({
                        id: `yt-${index}`,
                        topic: item.title,
                        platform: 'YouTube',
                        growth: 80 + Math.floor(Math.random() * 200),
                        volume: 'High velocity',
                        reason: 'Trending in search, likely viral video topic',
                        timestamp: new Date(item.pubDate).getTime(),
                        link: item.link
                    });
                }
                if (index % 3 === 0) {
                    allTrends.push({
                        id: `tt-${index}`,
                        topic: item.title,
                        platform: 'TikTok',
                        growth: 150 + Math.floor(Math.random() * 300),
                        volume: 'Viral',
                        reason: 'High search interest suggests viral potential',
                        timestamp: new Date(item.pubDate).getTime(),
                        link: item.link
                    });
                }
            });
        }

        // Process Google News (Health & Science)
        const processNews = (data: any, category: string) => {
            if (data?.rss?.channel?.item) {
                const items = Array.isArray(data.rss.channel.item)
                    ? data.rss.channel.item
                    : [data.rss.channel.item];

                items.slice(0, 10).forEach((item: any, index: number) => {
                    // Map to News
                    let newsVolume = 'Breaking';
                    if (category === 'Science' && index % 3 === 0) newsVolume = 'Academic Focus';
                    if (category === 'Health' && index % 3 === 0) newsVolume = 'Public Awareness';

                    allTrends.push({
                        id: `news-${category}-${index}`,
                        topic: item.title,
                        platform: 'News',
                        growth: 50 + Math.floor(Math.random() * 100),
                        volume: newsVolume,
                        reason: `Latest in ${category}: ${item.source?.['#text'] || 'News'}`,
                        timestamp: new Date(item.pubDate).getTime(),
                        link: item.link
                    });

                    // Map to LinkedIn (Professional interest)
                    if (index % 2 === 1) {
                        allTrends.push({
                            id: `li-${category}-${index}`,
                            topic: item.title,
                            platform: 'LinkedIn',
                            growth: 40 + Math.floor(Math.random() * 80),
                            volume: 'Professional discussion',
                            reason: `Industry update in ${category}`,
                            timestamp: new Date(item.pubDate).getTime(),
                            link: item.link
                        });
                    }
                });
            }
        };

        processNews(healthData, 'Health');
        processNews(scienceData, 'Science');
        processNews(financeData, 'Finance');

        // Sort by timestamp descending
        allTrends.sort((a, b) => b.timestamp - a.timestamp);

        return NextResponse.json(allTrends);
    } catch (error) {
        console.error('Error in trends API:', error);
        return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }
}
