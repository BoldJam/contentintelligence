import { NextResponse } from 'next/server';
import { sourceService } from '@/services/sourceService';

// DELETE /api/projects/:id/sources/:sourceId — delete a source
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; sourceId: string }> }
) {
  try {
    const { sourceId } = await params;
    await sourceService.deleteSource(sourceId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 });
  }
}
