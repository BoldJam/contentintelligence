import type { Project, ProjectMetadata } from '@/types/project';

const PROJECTS_KEY = 'akari_projects';
const PROJECT_PREFIX = 'akari_project_';

// Generate a unique project ID
export function generateProjectId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all project IDs
function getAllProjectIds(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(PROJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save project IDs list
function saveProjectIds(ids: string[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(ids));
}

// Save a project
export function saveProject(project: Project): void {
    if (typeof window === 'undefined') return;

    const ids = getAllProjectIds();
    if (!ids.includes(project.id)) {
        ids.push(project.id);
        saveProjectIds(ids);
    }

    project.updatedAt = Date.now();
    localStorage.setItem(`${PROJECT_PREFIX}${project.id}`, JSON.stringify(project));
}

// Load a project
export function loadProject(projectId: string): Project | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(`${PROJECT_PREFIX}${projectId}`);
    return stored ? JSON.parse(stored) : null;
}

// Get all projects metadata
export function getAllProjects(): ProjectMetadata[] {
    if (typeof window === 'undefined') return [];

    const ids = getAllProjectIds();
    const projects: ProjectMetadata[] = [];

    for (const id of ids) {
        const project = loadProject(id);
        if (project) {
            projects.push({
                id: project.id,
                title: project.title,
                updatedAt: project.updatedAt,
                paperCount: project.importedPapers.length,
            });
        }
    }

    // Sort by most recently updated
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
}

// Delete a project
export function deleteProject(projectId: string): void {
    if (typeof window === 'undefined') return;

    const ids = getAllProjectIds();
    const newIds = ids.filter(id => id !== projectId);
    saveProjectIds(newIds);

    localStorage.removeItem(`${PROJECT_PREFIX}${projectId}`);
}

// Update project title
export function updateProjectTitle(projectId: string, title: string): void {
    const project = loadProject(projectId);
    if (project) {
        project.title = title;
        saveProject(project);
    }
}

// Create a new project
export function createNewProject(): Project {
    const id = generateProjectId();
    const project: Project = {
        id,
        title: 'Untitled Project',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        searchQuery: '',
        importedPapers: [],
        summaryData: null,
        generatedContent: [],
    };

    saveProject(project);
    return project;
}
