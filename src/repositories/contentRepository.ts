import { prisma } from '@/lib/prisma';

export const contentRepository = {
  async findByProjectId(projectId: string) {
    return prisma.generatedContent.findMany({
      where: { projectId, processingStatus: { not: 'failed' } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findBySourceId(sourceId: string) {
    return prisma.generatedContent.findMany({
      where: { sourceId, processingStatus: { not: 'failed' } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.generatedContent.findUnique({ where: { id } });
  },

  async create(data: {
    projectId: string;
    title: string;
    type: string;
    format?: string;
    content?: string;
    complianceStatus?: string;
    assignee?: string;
    sourceId?: string;
    url?: string;
    diaflowSessionId?: string;
    processingStatus?: string;
  }) {
    return prisma.generatedContent.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        type: data.type,
        format: data.format,
        content: data.content,
        url: data.url,
        complianceStatus: data.complianceStatus || 'Draft',
        assignee: data.assignee,
        sourceId: data.sourceId,
        diaflowSessionId: data.diaflowSessionId,
        processingStatus: data.processingStatus || 'completed',
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      url: string;
      complianceStatus: string;
      assignee: string;
      processingStatus: string;
      diaflowSessionId: string;
    }>,
  ) {
    return prisma.generatedContent.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.generatedContent.delete({ where: { id } });
  },

  async deleteByProjectId(projectId: string) {
    return prisma.generatedContent.deleteMany({ where: { projectId } });
  },
};
