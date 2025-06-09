import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, ArrowUpDown, Trash } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { getStatusColor, getStatusLabel, getConstructionProgressColor, getConstructionProgressLabel, getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onEditProject: (project: Project) => void;
  onViewProject?: (project: Project) => void;
  onRefetch: () => void;
}

type SortField = keyof Project;
type SortDirection = "asc" | "desc";

export function ProjectsTable({ projects, isLoading, onEditProject, onViewProject, onRefetch }: ProjectsTableProps) {
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      onRefetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(
        ids.map(id => 
          fetch(`/api/projects/${id}`, { method: "DELETE" })
        )
      );
    },
    onSuccess: () => {
      toast({
        title: "Projects deleted",
        description: `${selectedProjects.size} projects have been successfully deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setSelectedProjects(new Set());
      onRefetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete projects. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    } else {
      setSelectedProjects(new Set());
    }
  };

  const handleSelectProject = (projectId: number, checked: boolean) => {
    const newSelected = new Set(selectedProjects);
    if (checked) {
      newSelected.add(projectId);
    } else {
      newSelected.delete(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedProjects.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedProjects.size} selected projects? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate(Array.from(selectedProjects));
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Design Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Design Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found. Create your first project to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Design Projects ({projects.length})</CardTitle>
          {selectedProjects.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedProjects.size} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProjects(new Set())}
              >
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProjects.size === projects.length && projects.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all projects"
                  />
                </TableHead>
                <SortableHeader field="priority">Priority</SortableHeader>
                <SortableHeader field="constructionProgress">Construction Progress</SortableHeader>
                <SortableHeader field="designStage">Design Stage</SortableHeader>
                <SortableHeader field="name">Project Name</SortableHeader>
                <SortableHeader field="designProjectNumber">Project #</SortableHeader>
                <SortableHeader field="workOrderNumber">Work Order #</SortableHeader>
                <SortableHeader field="designProjectLeader">Leader</SortableHeader>
                <SortableHeader field="projectStartDate">Start Date</SortableHeader>
                <SortableHeader field="projectFinishDate">Finish Date</SortableHeader>
                <TableHead>Survey</TableHead>
                <TableHead>Design</TableHead>
                <TableHead>Drawings</TableHead>
                <TableHead>WAE</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.map((project) => (
                <TableRow 
                  key={project.id} 
                  className="hover:bg-gray-50"
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedProjects.has(project.id)}
                      onCheckedChange={(checked) => handleSelectProject(project.id, !!checked)}
                      aria-label={`Select project ${project.name}`}
                    />
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    {project.priority ? (
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority} - {getPriorityLabel(project.priority)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-mono">
                        -
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    {project.constructionProgress && (
                      <Badge className={getConstructionProgressColor(project.constructionProgress)}>
                        {getConstructionProgressLabel(project.constructionProgress)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    {project.designStage && (
                      <Badge className={getStatusColor(project.designStage)}>
                        {getStatusLabel(project.designStage)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{project.name}</div>
                      {project.briefScope && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {project.briefScope}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <span className="font-mono text-sm">{project.designProjectNumber}</span>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <span className="font-mono text-sm">{project.workOrderNumber || "-"}</span>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <span className="text-sm">{project.designProjectLeader || "-"}</span>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <span className="text-sm">
                      {project.projectStartDate ? new Date(project.projectStartDate).toLocaleDateString() : "-"}
                    </span>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <span className="text-sm">
                      {project.projectFinishDate ? new Date(project.projectFinishDate).toLocaleDateString() : "-"}
                    </span>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <div className="space-y-1 min-w-20">
                      <div className="flex justify-between text-xs">
                        <span>{project.surveyPercentCompleted || 0}%</span>
                      </div>
                      <Progress value={project.surveyPercentCompleted || 0} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <div className="space-y-1 min-w-20">
                      <div className="flex justify-between text-xs">
                        <span>{project.designPercentCompleted || 0}%</span>
                      </div>
                      <Progress value={project.designPercentCompleted || 0} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <div className="space-y-1 min-w-20">
                      <div className="flex justify-between text-xs">
                        <span>{project.drawingsPercentCompleted || 0}%</span>
                      </div>
                      <Progress value={project.drawingsPercentCompleted || 0} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer"
                    onClick={() => onViewProject?.(project)}
                  >
                    <div className="space-y-1 min-w-20">
                      <div className="flex justify-between text-xs">
                        <span>{project.waePercentCompleted || 0}%</span>
                      </div>
                      <Progress value={project.waePercentCompleted || 0} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProject(project);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(project.id);
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}