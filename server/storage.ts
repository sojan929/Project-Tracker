import { Project, InsertProject } from "@/shared/schema";

export interface IStorage {
  getProject(id: number): Promise<Project | undefined>;
  getProjectByNumber(projectNumber: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  getAllProjects(): Promise<Project[]>;
  searchProjects(query: string): Promise<Project[]>;
  filterProjects(filters: { status?: string; stage?: string; search?: string }): Promise<Project[]>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private currentId: number;

  constructor() {
    this.projects = new Map();
    this.currentId = 1;
    
    // Start with empty data to avoid conflicts with imported CSV data
    this.seedData();
  }

  private seedData() {
    // Start with empty data to avoid conflicts with imported CSV data
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectByNumber(projectNumber: string): Promise<Project | undefined> {
    for (const project of this.projects.values()) {
      if (project.designProjectNumber === projectNumber) {
        return project;
      }
    }
    return undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      id, 
      ...insertProject,
      priority: insertProject.priority || null,
      constructionProgress: insertProject.constructionProgress || null,
      designStage: insertProject.designStage || null,
      workOrderNumber: insertProject.workOrderNumber || null,
      estimatedStartDate: insertProject.estimatedStartDate || null,
      estimatedCompletionDate: insertProject.estimatedCompletionDate || null,
      projectStartDate: insertProject.projectStartDate || null,
      projectFinishDate: insertProject.projectFinishDate || null,
      briefScope: insertProject.briefScope || null,
      designProjectLeader: insertProject.designProjectLeader || null,
      surveyBy: insertProject.surveyBy || null,
      surveyMethod: insertProject.surveyMethod || null,
      surveyPercentCompleted: insertProject.surveyPercentCompleted || 0,
      surveyStatus: insertProject.surveyStatus || null,
      surveyComments: insertProject.surveyComments || null,
      designBy: insertProject.designBy || null,
      designPercentCompleted: insertProject.designPercentCompleted || 0,
      designStatus: insertProject.designStatus || null,
      designComments: insertProject.designComments || null,
      drawingsBy: insertProject.drawingsBy || null,
      drawingsPercentCompleted: insertProject.drawingsPercentCompleted || 0,
      drawingsStatus: insertProject.drawingsStatus || null,
      drawingsComments: insertProject.drawingsComments || null,
      waeBy: insertProject.waeBy || null,
      waePercentCompleted: insertProject.waePercentCompleted || 0,
      waeStatus: insertProject.waeStatus || null,
      waeComments: insertProject.waeComments || null,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = { 
      ...existing, 
      ...updates,
      id: existing.id // Ensure id is not overwritten
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async searchProjects(query: string): Promise<Project[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.projects.values()).filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.designProjectNumber.toLowerCase().includes(lowercaseQuery) ||
      (project.briefScope && project.briefScope.toLowerCase().includes(lowercaseQuery)) ||
      (project.designProjectLeader && project.designProjectLeader.toLowerCase().includes(lowercaseQuery))
    );
  }

  async filterProjects(filters: { constructionProgress?: string; designStage?: string; search?: string }): Promise<Project[]> {
    let projects = Array.from(this.projects.values());

    if (filters.constructionProgress) {
      projects = projects.filter(p => p.constructionProgress === filters.constructionProgress);
    }

    if (filters.designStage) {
      projects = projects.filter(p => p.designStage === filters.designStage);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      projects = projects.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.designProjectNumber.toLowerCase().includes(query) ||
        (p.briefScope && p.briefScope.toLowerCase().includes(query)) ||
        (p.designProjectLeader && p.designProjectLeader.toLowerCase().includes(query))
      );
    }

    return projects;
  }
}

export const storage = new MemStorage();