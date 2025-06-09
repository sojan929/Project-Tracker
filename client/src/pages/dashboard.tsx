import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus, Search, Upload } from "lucide-react";
import { ProjectsTable } from "@/components/projects-table";
import { ProjectModal } from "@/components/project-modal";
import { ProjectDetailsModal } from "@/components/project-details-modal";
import { KPICards } from "@/components/kpi-cards";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [constructionProgressFilter, setConstructionProgressFilter] = useState<string>("all");
  const [designStageFilter, setDesignStageFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/projects", searchQuery, constructionProgressFilter, designStageFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (constructionProgressFilter !== "all") params.append("constructionProgress", constructionProgressFilter);
      if (designStageFilter !== "all") params.append("designStage", designStageFilter);
      
      const response = await fetch(`/api/projects?${params.toString()}`);
      return response.json();
    },
  });

  const importMutation = useMutation({
    mutationFn: async (projects: any[]) => {
      const response = await fetch("/api/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      if (!response.ok) throw new Error("Failed to import projects");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Projects imported successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to import projects",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const projects = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const project: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index] || '';
            
            // Map CSV headers to database fields
            switch (header.toLowerCase()) {
              case 'priority':
                const priorityValue = value.trim();
                project.priority = priorityValue && !isNaN(Number(priorityValue)) ? parseInt(priorityValue) : null;
                break;
              case 'construction progress':
                // Map construction progress values to schema values
                const constructionProgressMap: Record<string, string> = {
                  'not started': 'Not Started',
                  'pre-construction': 'Pre-Construction',
                  'site establishment': 'Site Establishment',
                  'earthworks': 'Earthworks',
                  'subsurface works (e.g. drainage, utilities)': 'Subsurface Works (e.g. drainage, utilities)',
                  'pavement / structural works': 'Pavement / Structural Works',
                  'finishing works': 'Finishing Works',
                  'testing and quality assurance': 'Testing and Quality Assurance',
                  'practical completion': 'Practical Completion',
                  'defects liability period / final handover': 'Defects Liability Period / Final Handover',
                  // Legacy mappings
                  'on-track': 'Site Establishment',
                  'in-progress': 'Earthworks',
                  'completed': 'Practical Completion',
                  'monitoring': 'Testing and Quality Assurance'
                };
                const lowerProgress = value.toLowerCase().trim();
                project.constructionProgress = constructionProgressMap[lowerProgress] || value || 'Not Started';
                break;
              case 'design stage':
                // Map design stage values to schema values
                const designStageMap: Record<string, string> = {
                  'not started': 'Not Started',
                  'concept design': 'Concept Design',
                  'preliminary design': 'Preliminary Design',
                  'detailed design': 'Detailed Design',
                  'review and approval': 'Review and Approval',
                  'construction phase': 'Construction Phase',
                  'completion and handover': 'Completion and Handover',
                  // Legacy mappings
                  'not-started': 'Not Started',
                  'in-progress': 'Preliminary Design',
                  'completed': 'Construction Phase'
                };
                const lowerStage = value.toLowerCase().trim();
                project.designStage = designStageMap[lowerStage] || value || 'Not Started';
                break;
              case 'name':
                project.name = value;
                break;
              case 'design project number':
                project.designProjectNumber = value;
                break;
              case 'work order number':
                project.workOrderNumber = value;
                break;
              case 'estimated start date':
                project.projectStartDate = value;
                break;
              case 'estimated date of completion':
                project.projectFinishDate = value;
                break;
              case 'brief scope':
                project.briefScope = value;
                break;
              case 'design project leader':
                project.designProjectLeader = value;
                break;
              case 'survey by':
                project.surveyBy = value;
                break;
              case 'survey method':
                project.surveyMethod = value;
                break;
              case 'survey % completed':
                const surveyPercent = value.replace('%', '');
                project.surveyPercentCompleted = surveyPercent ? parseInt(surveyPercent) : 0;
                break;
              case 'survey status':
                const normalizedSurveyStatus = value.toLowerCase().replace(/\s+/g, '-');
                project.surveyStatus = normalizedSurveyStatus || 'not-started';
                break;
              case 'survey comments':
                project.surveyComments = value;
                break;
              case 'design by':
                project.designBy = value;
                break;
              case 'design % completed':
                const designPercent = value.replace('%', '');
                project.designPercentCompleted = designPercent ? parseInt(designPercent) : 0;
                break;
              case 'design status':
                const normalizedDesignStatus = value.toLowerCase().replace(/\s+/g, '-');
                project.designStatus = normalizedDesignStatus || 'not-started';
                break;
              case 'design comments':
                project.designComments = value;
                break;
              case 'drawings by':
                project.drawingsBy = value;
                break;
              case 'drawings % completed':
                const drawingsPercent = value.replace('%', '');
                project.drawingsPercentCompleted = drawingsPercent ? parseInt(drawingsPercent) : 0;
                break;
              case 'drawings status':
                const normalizedDrawingsStatus = value.toLowerCase().replace(/\s+/g, '-');
                project.drawingsStatus = normalizedDrawingsStatus || 'not-started';
                break;
              case 'drawings comments':
                project.drawingsComments = value;
                break;
              case 'wae by':
                project.waeBy = value;
                break;
              case 'wae % completed':
                const waePercent = value.replace('%', '');
                project.waePercentCompleted = waePercent ? parseInt(waePercent) : 0;
                break;
              case 'wae status':
                const normalizedWaeStatus = value.toLowerCase().replace(/\s+/g, '-');
                project.waeStatus = normalizedWaeStatus || 'not-started';
                break;
              case 'wae comments':
                project.waeComments = value;
                break;
            }
          });
          
          return project;
        })
        .filter(project => project.name && project.name.trim() !== '');

      if (projects.length === 0) {
        toast({
          title: "Error",
          description: "No valid projects found in CSV file",
          variant: "destructive",
        });
        return;
      }

      importMutation.mutate(projects);
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
  };

  const handleEditFromDetails = () => {
    if (selectedProject) {
      setEditingProject(selectedProject);
      setIsDetailsModalOpen(false);
      setIsModalOpen(true);
    }
  };

  const handleProjectSaved = () => {
    handleCloseModal();
    refetch();
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/projects/export/csv");
      const csvData = await response.text();
      
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Forbes_Design_Projects.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="corporate-header text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Forbes Shire Council</h1>
              <p className="text-blue-100 mt-2">Design Projects Tracker</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleImportClick}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                disabled={importMutation.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                {importMutation.isPending ? "Importing..." : "Import CSV"}
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <KPICards projects={projects} isLoading={isLoading} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full lg:w-48">
              <Select value={constructionProgressFilter} onValueChange={setConstructionProgressFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Construction Progress" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Progress</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Pre-Construction">Pre-Construction</SelectItem>
                  <SelectItem value="Site Establishment">Site Establishment</SelectItem>
                  <SelectItem value="Earthworks">Earthworks</SelectItem>
                  <SelectItem value="Subsurface Works (e.g. drainage, utilities)">Subsurface Works</SelectItem>
                  <SelectItem value="Pavement / Structural Works">Pavement / Structural Works</SelectItem>
                  <SelectItem value="Finishing Works">Finishing Works</SelectItem>
                  <SelectItem value="Testing and Quality Assurance">Testing and Quality Assurance</SelectItem>
                  <SelectItem value="Practical Completion">Practical Completion</SelectItem>
                  <SelectItem value="Defects Liability Period / Final Handover">Defects Liability Period / Final Handover</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-48">
              <Select value={designStageFilter} onValueChange={setDesignStageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Design Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Concept Design">Concept Design</SelectItem>
                  <SelectItem value="Preliminary Design">Preliminary Design</SelectItem>
                  <SelectItem value="Detailed Design">Detailed Design</SelectItem>
                  <SelectItem value="Review and Approval">Review and Approval</SelectItem>
                  <SelectItem value="Construction Phase">Construction Phase</SelectItem>
                  <SelectItem value="Completion and Handover">Completion and Handover</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <ProjectsTable
          projects={projects}
          isLoading={isLoading}
          onEditProject={handleEditProject}
          onViewProject={handleViewProject}
          onRefetch={refetch}
        />
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProjectSaved={handleProjectSaved}
        editingProject={editingProject}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onEdit={handleEditFromDetails}
        project={selectedProject}
      />
    </div>
  );
}