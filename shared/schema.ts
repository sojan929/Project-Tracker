import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  priority: text("priority"),
  constructionProgress: text("construction_progress"),
  designStage: text("design_stage"),
  name: text("name").notNull(),
  designProjectNumber: text("design_project_number").notNull().unique(),
  workOrderNumber: text("work_order_number"),
  estimatedStartDate: text("estimated_start_date"),
  estimatedCompletionDate: text("estimated_completion_date"),
  projectStartDate: text("project_start_date"),
  projectFinishDate: text("project_finish_date"),
  briefScope: text("brief_scope"),
  designProjectLeader: text("design_project_leader"),
  
  // Survey fields
  surveyBy: text("survey_by"),
  surveyMethod: text("survey_method"),
  surveyPercentCompleted: integer("survey_percent_completed").default(0),
  surveyStatus: text("survey_status"),
  surveyComments: text("survey_comments"),
  
  // Design fields
  designBy: text("design_by"),
  designPercentCompleted: integer("design_percent_completed").default(0),
  designStatus: text("design_status"),
  designComments: text("design_comments"),
  
  // Drawings fields
  drawingsBy: text("drawings_by"),
  drawingsPercentCompleted: integer("drawings_percent_completed").default(0),
  drawingsStatus: text("drawings_status"),
  drawingsComments: text("drawings_comments"),
  
  // Works As Executed fields
  waeBy: text("wae_by"),
  waePercentCompleted: integer("wae_percent_completed").default(0),
  waeStatus: text("wae_status"),
  waeComments: text("wae_comments"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
}).extend({
  surveyPercentCompleted: z.number().min(0).max(100).nullable().optional(),
  designPercentCompleted: z.number().min(0).max(100).nullable().optional(),
  drawingsPercentCompleted: z.number().min(0).max(100).nullable().optional(),
  waePercentCompleted: z.number().min(0).max(100).nullable().optional(),
  constructionProgress: z.enum([
    "Not Started",
    "Pre-Construction", 
    "Site Establishment",
    "Earthworks",
    "Subsurface Works (e.g. drainage, utilities)",
    "Pavement / Structural Works",
    "Finishing Works",
    "Testing and Quality Assurance",
    "Practical Completion",
    "Defects Liability Period / Final Handover"
  ]).nullable().optional(),
  designStage: z.enum([
    "Not Started",
    "Concept Design",
    "Preliminary Design", 
    "Detailed Design",
    "Review and Approval",
    "Construction Phase",
    "Completion and Handover"
  ]).nullable().optional(),
  surveyStatus: z.enum(["not-started", "in-progress", "completed"]).nullable().optional(),
  designStatus: z.enum(["not-started", "in-progress", "completed"]).nullable().optional(),
  drawingsStatus: z.enum(["not-started", "in-progress", "completed"]).nullable().optional(),
  waeStatus: z.enum(["not-started", "in-progress", "completed"]).nullable().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
