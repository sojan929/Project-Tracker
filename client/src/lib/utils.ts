import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Project } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "1":
      return "text-white bg-red-600 border-red-700 shadow-md font-semibold";
    case "2":
      return "text-white bg-orange-600 border-orange-700 shadow-md font-semibold";
    case "3":
      return "text-white bg-yellow-600 border-yellow-700 shadow-md font-semibold";
    case "4":
      return "text-white bg-green-600 border-green-700 shadow-md font-semibold";
    default:
      return "text-gray-700 bg-gray-200 border-gray-300";
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case "1":
      return "Critical";
    case "2":
      return "High";
    case "3":
      return "Medium";
    case "4":
      return "Low";
    default:
      return priority || "None";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Not Started":
      return "text-gray-700 bg-gray-300 border-gray-400 shadow-md font-semibold";
    case "Concept Design":
      return "text-white bg-blue-600 border-blue-700 shadow-md font-semibold";
    case "Preliminary Design":
      return "text-white bg-yellow-600 border-yellow-700 shadow-md font-semibold";
    case "Detailed Design":
      return "text-white bg-purple-600 border-purple-700 shadow-md font-semibold";
    case "Review and Approval":
      return "text-white bg-orange-600 border-orange-700 shadow-md font-semibold";
    case "Construction Phase":
      return "text-white bg-green-600 border-green-700 shadow-md font-semibold";
    case "Completion and Handover":
      return "text-white bg-green-700 border-green-800 shadow-md font-semibold";
    case "In Progress":
      return "text-white bg-blue-600 border-blue-700 shadow-md font-semibold";
    case "Under Review":
      return "text-white bg-orange-600 border-orange-700 shadow-md font-semibold";
    case "Completed":
      return "text-white bg-green-700 border-green-800 shadow-md font-semibold";
    default:
      return "text-gray-700 bg-gray-200 border-gray-300";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "Not Started":
      return "Not Started";
    case "Concept Design":
      return "Concept Design";
    case "Preliminary Design":
      return "Preliminary Design";
    case "Detailed Design":
      return "Detailed Design";
    case "Review and Approval":
      return "Review and Approval";
    case "Construction Phase":
      return "Construction Phase";
    case "Completion and Handover":
      return "Completion and Handover";
    case "In Progress":
      return "In Progress";
    case "Under Review":
      return "Under Review";
    case "Completed":
      return "Completed";
    default:
      return status || "Unknown";
  }
}

export function getStageLabel(stage: string): string {
  switch (stage) {
    case "survey":
      return "Survey";
    case "design":
      return "Design";
    case "drawing":
      return "Drawing";
    case "as-built":
      return "As-Built (WAE)";
    default:
      return "Unknown";
  }
}

export function getConstructionProgressColor(progress: string): string {
  switch (progress) {
    case "Not Started":
      return "text-gray-700 bg-gray-300 border-gray-400 shadow-md font-semibold";
    case "Pre-Construction":
      return "text-white bg-gray-600 border-gray-700 shadow-md font-semibold";
    case "Site Establishment":
      return "text-white bg-blue-600 border-blue-700 shadow-md font-semibold";
    case "Earthworks":
      return "text-white bg-orange-600 border-orange-700 shadow-md font-semibold";
    case "Subsurface Works (e.g. drainage, utilities)":
      return "text-white bg-purple-600 border-purple-700 shadow-md font-semibold";
    case "Pavement / Structural Works":
      return "text-white bg-yellow-600 border-yellow-700 shadow-md font-semibold";
    case "Finishing Works":
      return "text-white bg-teal-600 border-teal-700 shadow-md font-semibold";
    case "Testing and Quality Assurance":
      return "text-white bg-pink-600 border-pink-700 shadow-md font-semibold";
    case "Practical Completion":
      return "text-white bg-green-600 border-green-700 shadow-md font-semibold";
    case "Defects Liability Period / Final Handover":
      return "text-white bg-green-700 border-green-800 shadow-md font-semibold";
    // Legacy values for backward compatibility
    case "completed":
      return "text-white bg-green-600 border-green-700 shadow-md font-semibold";
    case "in-progress":
      return "text-white bg-orange-500 border-orange-600 shadow-md font-semibold";
    case "on-track":
      return "text-white bg-blue-600 border-blue-700 shadow-md font-semibold";
    case "on-hold":
      return "text-white bg-red-500 border-red-600 shadow-md font-semibold";
    case "monitoring":
      return "text-white bg-yellow-600 border-yellow-700 shadow-md font-semibold";
    default:
      return "text-gray-700 bg-gray-200 border-gray-300";
  }
}

export function getConstructionProgressLabel(progress: string): string {
  switch (progress) {
    case "Not Started":
      return "Not Started";
    case "Pre-Construction":
      return "Pre-Construction";
    case "Site Establishment":
      return "Site Establishment";
    case "Earthworks":
      return "Earthworks";
    case "Subsurface Works (e.g. drainage, utilities)":
      return "Subsurface Works (e.g. drainage, utilities)";
    case "Pavement / Structural Works":
      return "Pavement / Structural Works";
    case "Finishing Works":
      return "Finishing Works";
    case "Testing and Quality Assurance":
      return "Testing and Quality Assurance";
    case "Practical Completion":
      return "Practical Completion";
    case "Defects Liability Period / Final Handover":
      return "Defects Liability Period / Final Handover";
    // Legacy values for backward compatibility
    case "on-track":
      return "On Track";
    case "on-hold":
      return "On Hold";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "monitoring":
      return "Monitoring";
    default:
      return progress || "Unknown";
  }
}

export function calculateKPIs(projects: Project[]) {
  const total = projects.length;
  
  // Active Construction Projects (excluding Not Started and completed phases)
  const activeConstructionProjects = projects.filter(p => 
    p.constructionProgress && 
    p.constructionProgress !== "Not Started" &&
    p.constructionProgress !== "Practical Completion" && 
    p.constructionProgress !== "Defects Liability Period / Final Handover"
  ).length;
  
  // Construction Complete (only final phases)
  const constructionComplete = projects.filter(p => 
    p.constructionProgress === "Practical Completion" || 
    p.constructionProgress === "Defects Liability Period / Final Handover"
  ).length;
  
  // Active Design Projects (excluding Not Started and completed phases)
  const activeDesignProjects = projects.filter(p => 
    p.designStage && 
    p.designStage !== "Not Started" &&
    p.designStage !== "Construction Phase" && 
    p.designStage !== "Completion and Handover"
  ).length;
  
  // Design Complete (only final phases)
  const designComplete = projects.filter(p => 
    p.designStage === "Construction Phase" || 
    p.designStage === "Completion and Handover"
  ).length;
  
  const avgSurveyProgress = total > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.surveyPercentCompleted || 0), 0) / total)
    : 0;
    
  const avgDesignProgress = total > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.designPercentCompleted || 0), 0) / total)
    : 0;

  const avgDrawingsProgress = total > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.drawingsPercentCompleted || 0), 0) / total)
    : 0;

  const avgWaeProgress = total > 0 
    ? Math.round(projects.reduce((sum, p) => sum + (p.waePercentCompleted || 0), 0) / total)
    : 0;

  return {
    total,
    activeConstructionProjects,
    constructionComplete,
    activeDesignProjects,
    designComplete,
    avgSurveyProgress,
    avgDesignProgress,
    avgDrawingsProgress,
    avgWaeProgress,
  };
}

export function exportToCSV(projects: Project[], filename = "Forbes_Design_Projects.csv") {
  const headers = [
    "Priority", "Construction Progress", "Design Stage", "Name", "Design Project Number",
    "Work Order Number", "Estimated Start Date", "Estimated Completion Date", "Brief Scope",
    "Design Project Leader", "Survey By", "Survey Method", "Survey % Completed", "Survey Status",
    "Survey Comments", "Design By", "Design % Completed", "Design Status", "Design Comments",
    "Drawings By", "Drawings % Completed", "Drawings Status", "Drawings Comments",
    "WAE By", "WAE % Completed", "WAE Status", "WAE Comments"
  ];

  const csvContent = [
    headers.join(","),
    ...projects.map(project => [
      `"${project.priority || ""}"`,
      `"${project.constructionProgress || ""}"`,
      `"${project.designStage || ""}"`,
      `"${project.name}"`,
      `"${project.designProjectNumber}"`,
      `"${project.workOrderNumber || ""}"`,
      `"${project.estimatedStartDate || ""}"`,
      `"${project.estimatedCompletionDate || ""}"`,
      `"${project.briefScope || ""}"`,
      `"${project.designProjectLeader || ""}"`,
      `"${project.surveyBy || ""}"`,
      `"${project.surveyMethod || ""}"`,
      `"${project.surveyPercentCompleted || 0}%"`,
      `"${project.surveyStatus || ""}"`,
      `"${project.surveyComments || ""}"`,
      `"${project.designBy || ""}"`,
      `"${project.designPercentCompleted || 0}%"`,
      `"${project.designStatus || ""}"`,
      `"${project.designComments || ""}"`,
      `"${project.drawingsBy || ""}"`,
      `"${project.drawingsPercentCompleted || 0}%"`,
      `"${project.drawingsStatus || ""}"`,
      `"${project.drawingsComments || ""}"`,
      `"${project.waeBy || ""}"`,
      `"${project.waePercentCompleted || 0}%"`,
      `"${project.waeStatus || ""}"`,
      `"${project.waeComments || ""}"`
    ].join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}