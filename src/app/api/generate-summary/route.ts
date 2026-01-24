import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { papers, query } = await request.json();

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock response based on the input
        const paperCount = papers?.length || 0;
        const firstPaperTitle = papers?.[0]?.title || 'Selected Paper';
        const topic = query || 'the selected research topic';

        const mockSummary = {
            title: `Research Synthesis: ${topic}`,
            summary: `This synthesis is based on ${paperCount} selected paper${paperCount !== 1 ? 's' : ''}, focusing on "${topic}". \n\nThe analyzed research highlights key findings in this domain. ${paperCount > 0 ? `Notably, "${firstPaperTitle}" provides significant insights.` : ''} \n\nOverall, the literature suggests a growing consensus on the importance of this subject, though further investigation is warranted to address emerging challenges and optimize outcomes. The papers collectively demonstrate the multifaceted nature of the problem and propose various methodological approaches for future study.`,
            questions: [
                "What are the primary limitations of the current methodologies discussed?",
                "How do these findings compare to recent developments in related fields?",
                "What are the implications for future practical applications?"
            ]
        };

        return NextResponse.json(mockSummary);
    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}
