import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertProjectSchema, type InsertProject, type Project } from "../../../shared/schema";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSaved: () => void;
  editingProject?: Project | null;
}

export function ProjectModal({ isOpen, onClose, onProjectSaved, editingProject }: ProjectModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      designProjectNumber: "",
      workOrderNumber: "",
      estimatedStartDate: "",
      estimatedCompletionDate: "",
      projectStartDate: "",
      projectFinishDate: "",
      briefScope: "",
      designProjectLeader: "",
      priority: "1",
      constructionProgress: "Not Started",
      designStage: "Not Started",
      surveyBy: "",
      surveyMethod: "",
      surveyPercentCompleted: 0,
      surveyStatus: "not-started",
      surveyComments: "",
      designBy: "",
      designPercentCompleted: 0,
      designStatus: "not-started",
      designComments: "",
      drawingsBy: "",
      drawingsPercentCompleted: 0,
      drawingsStatus: "not-started",
      drawingsComments: "",
      waeBy: "",
      waePercentCompleted: 0,
      waeStatus: "not-started",
      waeComments: "",
    },
  });

  // Helper function to validate schema values
  const validateConstructionProgress = (value: string | undefined): "Not Started" | "Pre-Construction" | "Site Establishment" | "Earthworks" | "Subsurface Works (e.g. drainage, utilities)" | "Pavement / Structural Works" | "Finishing Works" | "Testing and Quality Assurance" | "Practical Completion" | "Defects Liability Period / Final Handover" => {
    const validValues = ["Not Started", "Pre-Construction", "Site Establishment", "Earthworks", "Subsurface Works (e.g. drainage, utilities)", "Pavement / Structural Works", "Finishing Works", "Testing and Quality Assurance", "Practical Completion", "Defects Liability Period / Final Handover"];
    return validValues.includes(value || "") ? value as any : "Not Started";
  };

  const validateDesignStage = (value: string | undefined): "Not Started" | "Concept Design" | "Preliminary Design" | "Detailed Design" | "Review and Approval" | "Construction Phase" | "Completion and Handover" => {
    const validValues = ["Not Started", "Concept Design", "Preliminary Design", "Detailed Design", "Review and Approval", "Construction Phase", "Completion and Handover"];
    return validValues.includes(value || "") ? value as any : "Not Started";
  };

  useEffect(() => {
    if (editingProject) {
      form.reset({
        name: editingProject.name || "",
        designProjectNumber: editingProject.designProjectNumber || "",
        workOrderNumber: editingProject.workOrderNumber || "",
        estimatedStartDate: editingProject.estimatedStartDate || "",
        estimatedCompletionDate: editingProject.estimatedCompletionDate || "",
        projectStartDate: editingProject.projectStartDate || "",
        projectFinishDate: editingProject.projectFinishDate || "",
        briefScope: editingProject.briefScope || "",
        designProjectLeader: editingProject.designProjectLeader || "",
        priority: String(editingProject.priority || "1"),
        constructionProgress: validateConstructionProgress(editingProject.constructionProgress),
        designStage: validateDesignStage(editingProject.designStage),
        surveyBy: editingProject.surveyBy || "",
        surveyMethod: editingProject.surveyMethod || "",
        surveyPercentCompleted: editingProject.surveyPercentCompleted || 0,
        surveyStatus: (editingProject.surveyStatus?.toLowerCase().replace(/\s+/g, '-') || "not-started") as any,
        surveyComments: editingProject.surveyComments || "",
        designBy: editingProject.designBy || "",
        designPercentCompleted: editingProject.designPercentCompleted || 0,
        designStatus: (editingProject.designStatus?.toLowerCase().replace(/\s+/g, '-') || "not-started") as any,
        designComments: editingProject.designComments || "",
        drawingsBy: editingProject.drawingsBy || "",
        drawingsPercentCompleted: editingProject.drawingsPercentCompleted || 0,
        drawingsStatus: (editingProject.drawingsStatus?.toLowerCase().replace(/\s+/g, '-') || "not-started") as any,
        drawingsComments: editingProject.drawingsComments || "",
        waeBy: editingProject.waeBy || "",
        waePercentCompleted: editingProject.waePercentCompleted || 0,
        waeStatus: (editingProject.waeStatus?.toLowerCase().replace(/\s+/g, '-') || "not-started") as any,
        waeComments: editingProject.waeComments || "",
      });
    }
  }, [editingProject, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully" });
      onProjectSaved();
      onClose();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error creating project", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await fetch(`/api/projects/${editingProject?.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update project");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully" });
      onProjectSaved();
      onClose();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error updating project", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    if (editingProject) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProject ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {editingProject 
              ? "Update project details, progress, and team responsibilities across all phases." 
              : "Add a new Forbes Shire Council design project with team assignments and progress tracking."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="survey">Survey</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="drawings">Drawings & WAE</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-6">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designProjectNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Project Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workOrderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Order Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - High</SelectItem>
                            <SelectItem value="2">2 - Medium-High</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4 - Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designProjectLeader"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Project Leader</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="constructionProgress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Construction Progress</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select construction progress" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Not Started">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                Not Started
                              </div>
                            </SelectItem>
                            <SelectItem value="Pre-Construction">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                Pre-Construction
                              </div>
                            </SelectItem>
                            <SelectItem value="Site Establishment">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                Site Establishment
                              </div>
                            </SelectItem>
                            <SelectItem value="Earthworks">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                Earthworks
                              </div>
                            </SelectItem>
                            <SelectItem value="Subsurface Works (e.g. drainage, utilities)">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                Subsurface Works (e.g. drainage, utilities)
                              </div>
                            </SelectItem>
                            <SelectItem value="Pavement / Structural Works">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                Pavement / Structural Works
                              </div>
                            </SelectItem>
                            <SelectItem value="Finishing Works">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                                Finishing Works
                              </div>
                            </SelectItem>
                            <SelectItem value="Testing and Quality Assurance">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                Testing and Quality Assurance
                              </div>
                            </SelectItem>
                            <SelectItem value="Practical Completion">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                Practical Completion
                              </div>
                            </SelectItem>
                            <SelectItem value="Defects Liability Period / Final Handover">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-700"></div>
                                Defects Liability Period / Final Handover
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Stage</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select design stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Not Started">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                Not Started
                              </div>
                            </SelectItem>
                            <SelectItem value="Concept Design">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                Concept Design
                              </div>
                            </SelectItem>
                            <SelectItem value="Preliminary Design">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                Preliminary Design
                              </div>
                            </SelectItem>
                            <SelectItem value="Detailed Design">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                Detailed Design
                              </div>
                            </SelectItem>
                            <SelectItem value="Review and Approval">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                Review and Approval
                              </div>
                            </SelectItem>
                            <SelectItem value="Construction Phase">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                Construction Phase
                              </div>
                            </SelectItem>
                            <SelectItem value="Completion and Handover">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-700"></div>
                                Completion and Handover
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ""} 
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectFinishDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Finish Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ""} 
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="briefScope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Scope</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ""} rows={4} className="resize-vertical" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="survey" className="space-y-6 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-900 mb-3">Survey Team & Progress</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="surveyBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">Responsible Person (Initials)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="e.g., RG, JC, RO" className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="surveyPercentCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">Progress (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="surveyStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="surveyMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Survey Method</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="e.g., GPS MGA 2020, Drone Survey" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <FormField
                    control={form.control}
                    name="surveyComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-semibold">Survey Comments & Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            rows={4}
                            placeholder="Enter survey progress, field conditions, equipment used, or any issues..."
                            className="bg-white resize-vertical"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-6 mt-6">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h3 className="font-semibold text-green-900 mb-3">Design Team & Progress</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="designBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800">Responsible Person (Initials)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="e.g., RO, JC, RG" className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="designPercentCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800">Progress (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="designStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <FormField
                    control={form.control}
                    name="designComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-semibold">Design Comments & Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            rows={4}
                            placeholder="Enter design progress, technical decisions, requirements clarifications..."
                            className="bg-white resize-vertical"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="drawings" className="space-y-6 mt-6">
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <h3 className="font-semibold text-purple-900 mb-3">Drawings Team & Progress</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="drawingsBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800">Responsible Person (Initials)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="e.g., RO, JC, RG" className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="drawingsPercentCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800">Progress (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="drawingsStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <FormField
                    control={form.control}
                    name="drawingsComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-semibold">Drawings Comments & Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            rows={4}
                            placeholder="Enter drawing progress, revisions, approval status, CAD work notes..."
                            className="bg-white resize-vertical"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <h3 className="font-semibold text-orange-900 mb-3">Works As Executed (WAE) Team & Progress</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="waeBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-orange-800">Responsible Person (Initials)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="e.g., JC, RO, RG" className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="waePercentCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-orange-800">Progress (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="waeStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-orange-800">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <FormField
                    control={form.control}
                    name="waeComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-semibold">WAE Comments & Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ""}
                            rows={4}
                            placeholder="Enter field modifications, as-built documentation, final survey notes..."
                            className="bg-white resize-vertical"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Saving..."
                ) : editingProject ? (
                  "Update Project"
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}