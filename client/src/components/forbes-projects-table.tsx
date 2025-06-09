import { useState } from "react";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

interface ForbesProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onEditProject: (project: Project) => void;
  onRefetch: () => void;
}

type SortField = keyof Project;
type SortDirection = "asc" | "desc";

export function ForbesProjectsTable({ projects, isLoading, onEditProject, onRefetch }: ForbesProjectsTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { toast } = useToast();

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      onRefetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
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

  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getProgressBarColor = (status: string | null, completion: number) => {
    if (completion === 100) return "bg-[hsl(122,39%,49%)]";
    if (status === "in-progress") return "bg-[hsl(36,100%,48%)]";
    if (status === "not-started") return "bg-gray-400";
    return "bg-[hsl(207,90%,54%)]";
  };

  const getBadgeVariant = (status: string | null) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "not-started":
        return "outline";
      default:
        return "outline";
    }
  };

  const getConstructionProgressColor = (progress: string | null) => {
    switch (progress) {
      case "on-track":
        return "text-green-600 bg-green-50";
      case "on-hold":
        return "text-yellow-600 bg-yellow-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      case "monitoring":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const SortableHeader = ({ field, children, className = "" }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead 
      className={`sticky top-0 bg-[hsl(207,90%,54%)] text-white cursor-pointer hover:bg-[hsl(207,90%,48%)] transition-colors duration-200 ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span className="text-xs">{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(15)].map((_, i) => (
                <TableHead key={i} className="bg-[hsl(207,90%,54%)] text-white text-xs">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(15)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <SortableHeader field="priority" className="w-16">Priority</SortableHeader>
              <SortableHeader field="constructionProgress" className="w-32">Construction Progress</SortableHeader>
              <SortableHeader field="designStage" className="w-28">Design Stage</SortableHeader>
              <SortableHeader field="name" className="w-48">Project Name</SortableHeader>
              <SortableHeader field="designProjectNumber" className="w-32">Project #</SortableHeader>
              <SortableHeader field="designProjectLeader" className="w-32">Leader</SortableHeader>
              
              {/* Survey Section */}
              <TableHead className="sticky top-0 bg-[hsl(207,90%,54%)] text-white text-center border-l-2 border-white" colSpan={3}>
                <span className="text-xs font-semibold">SURVEY</span>
              </TableHead>
              
              {/* Design Section */}
              <TableHead className="sticky top-0 bg-[hsl(207,90%,54%)] text-white text-center border-l-2 border-white" colSpan={3}>
                <span className="text-xs font-semibold">DESIGN</span>
              </TableHead>
              
              {/* Drawings Section */}
              <TableHead className="sticky top-0 bg-[hsl(207,90%,54%)] text-white text-center border-l-2 border-white" colSpan={3}>
                <span className="text-xs font-semibold">DRAWINGS</span>
              </TableHead>
              
              {/* WAE Section */}
              <TableHead className="sticky top-0 bg-[hsl(207,90%,54%)] text-white text-center border-l-2 border-white" colSpan={3}>
                <span className="text-xs font-semibold">WORKS AS EXECUTED</span>
              </TableHead>
              
              <TableHead className="sticky top-0 bg-[hsl(207,90%,54%)] text-white text-center w-24">
                Actions
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="h-0 p-0"></TableHead>
              <TableHead className="h-0 p-0"></TableHead>
              <TableHead className="h-0 p-0"></TableHead>
              <TableHead className="h-0 p-0"></TableHead>
              <TableHead className="h-0 p-0"></TableHead>
              <TableHead className="h-0 p-0"></TableHead>
              
              <SortableHeader field="surveyBy" className="w-16">By</SortableHeader>
              <SortableHeader field="surveyPercentCompleted" className="w-16">%</SortableHeader>
              <SortableHeader field="surveyStatus" className="w-20">Status</SortableHeader>
              
              <SortableHeader field="designBy" className="w-16">By</SortableHeader>
              <SortableHeader field="designPercentCompleted" className="w-16">%</SortableHeader>
              <SortableHeader field="designStatus" className="w-20">Status</SortableHeader>
              
              <SortableHeader field="drawingsBy" className="w-16">By</SortableHeader>
              <SortableHeader field="drawingsPercentCompleted" className="w-16">%</SortableHeader>
              <SortableHeader field="drawingsStatus" className="w-20">Status</SortableHeader>
              
              <SortableHeader field="waeBy" className="w-16">By</SortableHeader>
              <SortableHeader field="waePercentCompleted" className="w-16">%</SortableHeader>
              <SortableHeader field="waeStatus" className="w-20">Status</SortableHeader>
              
              <TableHead className="h-0 p-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => (
              <TableRow key={project.id} className="hover:bg-gray-50 transition-colors duration-200">
                <TableCell className="text-center text-sm font-medium">{project.priority || ""}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getConstructionProgressColor(project.constructionProgress)}`}>
                    {project.constructionProgress || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(project.designStage)} className="text-xs">
                    {project.designStage || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-sm max-w-48">
                  <div className="truncate" title={project.name}>{project.name}</div>
                  <div className="text-xs text-gray-500 truncate" title={project.briefScope || ""}>
                    {project.briefScope || ""}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{project.designProjectNumber}</TableCell>
                <TableCell className="text-sm">{project.designProjectLeader || ""}</TableCell>
                
                {/* Survey Columns */}
                <TableCell className="text-center text-sm border-l border-gray-200">{project.surveyBy || ""}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center space-x-1">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(project.surveyStatus, project.surveyPercentCompleted || 0)}`}
                        style={{ width: `${project.surveyPercentCompleted || 0}%` }}
                      />
                    </div>
                    <span className="text-xs w-8">{project.surveyPercentCompleted || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(project.surveyStatus)} className="text-xs">
                    {project.surveyStatus || "N/A"}
                  </Badge>
                </TableCell>
                
                {/* Design Columns */}
                <TableCell className="text-center text-sm border-l border-gray-200">{project.designBy || ""}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center space-x-1">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(project.designStatus, project.designPercentCompleted || 0)}`}
                        style={{ width: `${project.designPercentCompleted || 0}%` }}
                      />
                    </div>
                    <span className="text-xs w-8">{project.designPercentCompleted || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(project.designStatus)} className="text-xs">
                    {project.designStatus || "N/A"}
                  </Badge>
                </TableCell>
                
                {/* Drawings Columns */}
                <TableCell className="text-center text-sm border-l border-gray-200">{project.drawingsBy || ""}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center space-x-1">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(project.drawingsStatus, project.drawingsPercentCompleted || 0)}`}
                        style={{ width: `${project.drawingsPercentCompleted || 0}%` }}
                      />
                    </div>
                    <span className="text-xs w-8">{project.drawingsPercentCompleted || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(project.drawingsStatus)} className="text-xs">
                    {project.drawingsStatus || "N/A"}
                  </Badge>
                </TableCell>
                
                {/* WAE Columns */}
                <TableCell className="text-center text-sm border-l border-gray-200">{project.waeBy || ""}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center space-x-1">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(project.waeStatus, project.waePercentCompleted || 0)}`}
                        style={{ width: `${project.waePercentCompleted || 0}%` }}
                      />
                    </div>
                    <span className="text-xs w-8">{project.waePercentCompleted || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(project.waeStatus)} className="text-xs">
                    {project.waeStatus || "N/A"}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditProject(project)}
                      className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,48%)] hover:bg-blue-50 h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[hsl(0,68%,62%)] hover:text-[hsl(0,68%,56%)] hover:bg-red-50 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProjectMutation.mutate(project.id)}
                            className="bg-[hsl(0,68%,62%)] hover:bg-[hsl(0,68%,56%)]"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}