import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects with optional filtering
  app.get("/api/projects", async (req, res) => {
    try {
      const { constructionProgress, designStage, search } = req.query;
      
      if (constructionProgress || designStage || search) {
        const projects = await storage.filterProjects({
          constructionProgress: constructionProgress as string,
          designStage: designStage as string,
          search: search as string,
        });
        res.json(projects);
      } else {
        const projects = await storage.getAllProjects();
        res.json(projects);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Export projects as CSV
  app.get("/api/projects/export/csv", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      
      // CSV headers matching Forbes Shire Council format
      const headers = [
        "Priority",
        "Construction Progress", 
        "Design Stage",
        "Name",
        "Design Project Number",
        "Work Order Number",
        "Estimated Start Date",
        "Estimated Date of Completion",
        "Brief Scope",
        "Design Project Leader",
        "Survey By",
        "Survey Method",
        "Survey % Completed",
        "Survey Status",
        "Survey Comments",
        "Design By",
        "Design % Completed", 
        "Design Status",
        "Design Comments",
        "Drawings By",
        "Drawings % Completed",
        "Drawings Status", 
        "Drawings Comments",
        "WAE By",
        "WAE % Completed",
        "WAE Status",
        "WAE Comments"
      ];

      // Convert projects to CSV format
      const csvRows = [headers.join(",")];
      
      projects.forEach(project => {
        const row = [
          project.priority || "",
          project.constructionProgress || "",
          project.designStage || "",
          `"${(project.name || "").replace(/"/g, '""')}"`,
          project.designProjectNumber || "",
          project.workOrderNumber || "",
          project.estimatedStartDate || "",
          project.estimatedCompletionDate || "",
          `"${(project.briefScope || "").replace(/"/g, '""')}"`,
          project.designProjectLeader || "",
          project.surveyBy || "",
          project.surveyMethod || "",
          project.surveyPercentCompleted ? `${project.surveyPercentCompleted}%` : "0%",
          project.surveyStatus || "",
          `"${(project.surveyComments || "").replace(/"/g, '""')}"`,
          project.designBy || "",
          project.designPercentCompleted ? `${project.designPercentCompleted}%` : "0%",
          project.designStatus || "",
          `"${(project.designComments || "").replace(/"/g, '""')}"`,
          project.drawingsBy || "",
          project.drawingsPercentCompleted ? `${project.drawingsPercentCompleted}%` : "0%",
          project.drawingsStatus || "",
          `"${(project.drawingsComments || "").replace(/"/g, '""')}"`,
          project.waeBy || "",
          project.waePercentCompleted ? `${project.waePercentCompleted}%` : "0%",
          project.waeStatus || "",
          `"${(project.waeComments || "").replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=Forbes_Design_Projects.csv");
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      
      // Check if project number already exists
      const existingProject = await storage.getProjectByNumber(validatedData.designProjectNumber);
      if (existingProject) {
        return res.status(400).json({ message: "Design project number already exists" });
      }
      
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Update project (PUT)
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      // If updating project number, check for duplicates
      if (validatedData.designProjectNumber) {
        const existingProject = await storage.getProjectByNumber(validatedData.designProjectNumber);
        if (existingProject && existingProject.id !== id) {
          return res.status(400).json({ message: "Design project number already exists" });
        }
      }
      
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Update project (PATCH)
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      // If updating project number, check for duplicates
      if (validatedData.designProjectNumber) {
        const existingProject = await storage.getProjectByNumber(validatedData.designProjectNumber);
        if (existingProject && existingProject.id !== id) {
          return res.status(400).json({ message: "Design project number already exists" });
        }
      }
      
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Import projects from CSV
  app.post("/api/projects/import", async (req, res) => {
    try {
      const { projects } = req.body;
      
      if (!Array.isArray(projects) || projects.length === 0) {
        return res.status(400).json({ error: "No projects provided" });
      }

      const importedProjects = [];
      
      for (const projectData of projects) {
        try {
          // Check if project with same number already exists
          const existing = await storage.getProjectByNumber(projectData.projectNumber);
          
          if (existing) {
            // Update existing project
            const updated = await storage.updateProject(existing.id, projectData);
            if (updated) {
              importedProjects.push(updated);
            }
          } else {
            // Create new project
            const newProject = await storage.createProject(projectData);
            importedProjects.push(newProject);
          }
        } catch (error) {
          console.error(`Error importing project ${projectData.projectNumber}:`, error);
          // Continue with other projects
        }
      }

      res.json({ 
        success: true, 
        imported: importedProjects.length,
        projects: importedProjects 
      });
    } catch (error) {
      console.error("Error importing projects:", error);
      res.status(500).json({ error: "Failed to import projects" });
    }
  });

  // Export projects to CSV
  app.get("/api/projects/export/csv", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      
      const csvHeaders = "Priority,Construction Progress,Design Stage,Name,Design Project Number,Work Order Number,Estimated Start Date,Estimated Completion Date,Brief Scope,Design Project Leader,Survey By,Survey Method,Survey % Completed,Survey Status,Survey Comments,Design By,Design % Completed,Design Status,Design Comments,Drawings By,Drawings % Completed,Drawings Status,Drawings Comments,WAE By,WAE % Completed,WAE Status,WAE Comments\n";
      const csvRows = projects.map(project => 
        `"${project.priority || ""}","${project.constructionProgress || ""}","${project.designStage || ""}","${project.name}","${project.designProjectNumber}","${project.workOrderNumber || ""}","${project.estimatedStartDate || ""}","${project.estimatedCompletionDate || ""}","${project.briefScope || ""}","${project.designProjectLeader || ""}","${project.surveyBy || ""}","${project.surveyMethod || ""}","${project.surveyPercentCompleted || 0}%","${project.surveyStatus || ""}","${project.surveyComments || ""}","${project.designBy || ""}","${project.designPercentCompleted || 0}%","${project.designStatus || ""}","${project.designComments || ""}","${project.drawingsBy || ""}","${project.drawingsPercentCompleted || 0}%","${project.drawingsStatus || ""}","${project.drawingsComments || ""}","${project.waeBy || ""}","${project.waePercentCompleted || 0}%","${project.waeStatus || ""}","${project.waeComments || ""}"`
      ).join("\n");
      
      const csv = csvHeaders + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="Forbes_Design_Projects.csv"');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: "Failed to export projects" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
