import { NextResponse } from 'next/server';
import type { Paper, Badge } from '@/types/paper';

// Badge generation logic
function generateBadges(paper: any): Badge[] {
    const badges: Badge[] = [];
    const year = paper.year || 0;
    const citationCount = paper.citationCount || 0;

    // Highly Cited
    if (citationCount > 100) {
        badges.push({
            id: 'highly-cited',
            label: 'Highly Cited',
            color: 'text-yellow-400',
            icon: 'star'
        });
    }

    // Recent
    if (year >= 2023) {
        badges.push({
            id: 'recent',
            label: 'Recent',
            color: 'text-blue-400',
            icon: 'calendar'
        });
    }

    // Trending
    if (year >= 2024 && citationCount > 50) {
        badges.push({
            id: 'trending',
            label: 'Trending',
            color: 'text-orange-400',
            icon: 'trending-up'
        });
    }

    // Top Venue (based on common high-impact venues)
    const topVenues = ['Nature', 'Science', 'Cell', 'JAMA', 'Lancet', 'NEJM', 'PNAS'];
    if (paper.venue && topVenues.some(v => paper.venue?.includes(v))) {
        badges.push({
            id: 'top-venue',
            label: 'Top Venue',
            color: 'text-green-400',
            icon: 'award'
        });
    }

    // Rigorous (peer-reviewed journals)
    if (paper.venue && !paper.venue.includes('arXiv') && citationCount > 20) {
        badges.push({
            id: 'rigorous',
            label: 'Peer-Reviewed',
            color: 'text-purple-400',
            icon: 'shield-check'
        });
    }

    // Influential Impact (based on influential citations)
    const influentialCount = paper.influentialCitationCount || 0;
    if (influentialCount >= 10) {
        badges.push({
            id: 'influential',
            label: 'Influential Impact',
            color: 'text-pink-400',
            icon: 'zap'
        });
    }

    return badges;
}

// Format authors as "First Author et al."
function formatAuthors(authors: any[]): string {
    if (!authors || authors.length === 0) return 'Unknown';
    if (authors.length === 1) return authors[0].name || 'Unknown';
    return `${authors[0].name || 'Unknown'} et al.`;
}

export async function POST(request: Request) {
    try {
        const { query, limit = 12 } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const encodedQuery = encodeURIComponent(query);

        // Helper function to fetch with retry
        const fetchWithRetry = async (url: string, retries = 2): Promise<Response> => {
            for (let i = 0; i <= retries; i++) {
                try {
                    const response = await fetch(url, {
                        headers: {
                            'Accept': 'application/json',
                        },
                    });

                    // If rate limited (429), wait and retry
                    if (response.status === 429 && i < retries) {
                        console.log(`Rate limited, retrying in ${(i + 1) * 2} seconds...`);
                        await new Promise(resolve => setTimeout(resolve, (i + 1) * 2000));
                        continue;
                    }

                    return response;
                } catch (error) {
                    if (i === retries) throw error;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            throw new Error('Max retries reached');
        };

        // Search Semantic Scholar API with retry
        // Fetch more papers (30) to allow for quality filtering and ranking
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&limit=${limit}&fields=paperId,title,authors,year,citationCount,influentialCitationCount,abstract,venue,publicationTypes,openAccessPdf,tldr,s2FieldsOfStudy,externalIds,publicationDate,journal`;

        const response = await fetchWithRetry(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Semantic Scholar API error:', response.status, errorText);

            // If rate limited, return a more helpful error
            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded. Please wait a moment and try again.' },
                    { status: 429 }
                );
            }

            throw new Error(`Semantic Scholar API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // Transform to our Paper type
        const allPapers: Paper[] = data.data.map((paper: any) => ({
            id: paper.paperId || paper.externalIds?.DOI || Math.random().toString(),
            title: paper.title || 'Untitled',
            authors: formatAuthors(paper.authors),
            fullAuthors: paper.authors?.map((a: any) => a.name) || [],
            year: paper.year || new Date().getFullYear(),
            abstract: paper.abstract,
            citationCount: paper.citationCount || 0,
            venue: paper.venue,
            doi: paper.externalIds?.DOI,
            badges: generateBadges(paper),
            // Enhanced metadata
            tldr: paper.tldr,
            influentialCitationCount: paper.influentialCitationCount,
            s2FieldsOfStudy: paper.s2FieldsOfStudy,
            externalIds: paper.externalIds,
            publicationDate: paper.publicationDate,
            journal: paper.journal,
        }));

        // Rank papers:
        // 1. Badge count (more badges = higher quality/relevance)
        // 2. Citation count (higher = better)
        // 3. Year (newer = better)
        const rankedPapers = allPapers.sort((a, b) => {
            const badgesA = a.badges?.length || 0;
            const badgesB = b.badges?.length || 0;

            if (badgesA !== badgesB) return badgesB - badgesA; // More badges first
            if (a.citationCount !== b.citationCount) return (b.citationCount || 0) - (a.citationCount || 0); // Higher citations first
            return (b.year || 0) - (a.year || 0); // Newer first
        });

        // Return top 6 papers
        const papers = rankedPapers.slice(0, 6);

        return NextResponse.json({ papers });
    } catch (error) {
        console.error('Error searching papers:', error);
        return NextResponse.json(
            { error: 'Failed to search papers' },
            { status: 500 }
        );
    }
}
