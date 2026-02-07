import { prisma } from '@/lib/prisma';

interface ContentInput {
  id: string;
  title: string;
  type: string;
  format?: string;
  content?: string;
  complianceStatus?: string;
  assignee?: string;
  createdAt?: string | Date;
  isLoading?: boolean;
}

export const contentRepository = {
  async deleteByProjectId(projectId: string) {
    return prisma.generatedContent.deleteMany({ where: { projectId } });
  },

  async createMany(projectId: string, contents: ContentInput[]) {
    return prisma.generatedContent.createMany({
      data: contents
        .filter((c) => !c.isLoading)
        .map((c) => ({
          id: c.id,
          title: c.title,
          type: c.type,
          format: c.format,
          content: c.content,
          complianceStatus: c.complianceStatus || 'Draft',
          assignee: c.assignee,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          projectId,
        })),
    });
  },

  async update(contentId: string, data: { title?: string; complianceStatus?: string; assignee?: string }) {
    return prisma.generatedContent.update({
      where: { id: contentId },
      data: {
        title: data.title,
        complianceStatus: data.complianceStatus,
        assignee: data.assignee,
      },
    });
  },
};
