import type { Project, ProjectMetadata } from '@/types/project';
import type { Source } from '@/types/source';

// Save a project (update)
export async function saveProject(project: Project): Promise<void> {
    await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: project.title,
            searchQuery: project.searchQuery,
            summaryData: project.summaryData,
            sources: project.sources,
            generatedContent: project.generatedContent,
        }),
    });
}

// Load a project by ID
export async function loadProject(projectId: string): Promise<Project | null> {
    const res = await fetch(`/api/projects/${projectId}`);
    if (!res.ok) return null;
    return res.json();
}

// Get all projects metadata
export async function getAllProjects(): Promise<ProjectMetadata[]> {
    const res = await fetch('/api/projects');
    if (!res.ok) return [];
    return res.json();
}

// Delete a project
export async function deleteProject(projectId: string): Promise<void> {
    await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
}

// Update project title
export async function updateProjectTitle(projectId: string, title: string): Promise<void> {
    await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
}

// Create a new project
export async function createNewProject(): Promise<Project> {
    const res = await fetch('/api/projects', { method: 'POST' });
    return res.json();
}

// Add a source to a project (triggers Diaflow processing if URL provided)
export async function addSource(
    projectId: string,
    input: { url?: string; type: string; title: string; content?: string }
): Promise<Source> {
    const res = await fetch(`/api/projects/${projectId}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('Failed to add source');
    return res.json();
}

// Poll a source's processing status
export async function checkSourceStatus(projectId: string, sourceId: string): Promise<Source> {
    const res = await fetch(`/api/projects/${projectId}/sources/${sourceId}/status`);
    if (!res.ok) throw new Error('Failed to check source status');
    return res.json();
}

// Update content status/title/assignee
export async function updateContent(
    projectId: string,
    contentId: string,
    updates: { title?: string; complianceStatus?: string; assignee?: string }
): Promise<void> {
    await fetch(`/api/projects/${projectId}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, ...updates }),
    });
}
