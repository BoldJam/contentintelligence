import { NextResponse } from 'next/server';
import { contentRepository } from '@/repositories/contentRepository';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await request.json();
    const { contentId, ...updates } = body;

    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
    }

    await contentRepository.update(contentId, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
