import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
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
import { apiRequest } from "@/lib/queryClient";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSaved: () => void;
  editingProject?: Project | null;
}

export function ProjectModal({ isOpen, onClose, onProjectSaved, editingProject }: ProjectModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

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
      constructionProgress: "on-track",
      designStage: "not-started",
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
        priority: (editingProject.priority as string) || "1",
        constructionProgress: (editingProject.constructionProgress as any) || "on-track",
        designStage: (editingProject.designStage as any) || "not-started",
        surveyBy: editingProject.surveyBy || "",
        surveyMethod: editingProject.surveyMethod || "",
        surveyPercentCompleted: editingProject.surveyPercentCompleted || 0,
        surveyStatus: (editingProject.surveyStatus as any) || "not-started",
        surveyComments: editingProject.surveyComments || "",
        designBy: editingProject.designBy || "",
        designPercentCompleted: editingProject.designPercentCompleted || 0,
        designStatus: (editingProject.designStatus as any) || "not-started",
        designComments: editingProject.designComments || "",
        drawingsBy: editingProject.drawingsBy || "",
        drawingsPercentCompleted: editingProject.drawingsPercentCompleted || 0,
        drawingsStatus: (editingProject.drawingsStatus as any) || "not-started",
        drawingsComments: editingProject.drawingsComments || "",
        waeBy: editingProject.waeBy || "",
        waePercentCompleted: editingProject.waePercentCompleted || 0,
        waeStatus: (editingProject.waeStatus as any) || "not-started",
        waeComments: editingProject.waeComments || "",
      });
    } else {
      form.reset({
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
        constructionProgress: "on-track",
        designStage: "not-started",
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
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="survey">Survey</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="drawings">Drawings & WAE</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
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
                    name="constructionProgress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Construction Progress</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select progress" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="on-track">On Track</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="monitoring">Monitoring</SelectItem>
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
                    name="designStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Stage</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="under-review">Under Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
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
                    name="estimatedStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Start Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimatedCompletionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Completion Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" value={field.value || ""} />
                        </FormControl>
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
                          <Input {...field} type="date" value={field.value || ""} />
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
                          <Input {...field} type="date" value={field.value || ""} />
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
                        <Textarea {...field} value={field.value || ""} rows={6} className="min-h-[120px] resize-vertical" />
                      </FormControl>
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
              </TabsContent>

              <TabsContent value="survey" className="space-y-6 mt-6">
                {/* Responsibility Section */}
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-900 mb-3">Survey Responsibility & Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                              {...field} 
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
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Technical Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="surveyMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Survey Method</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="e.g., GPS MGA 2020, Drone" />
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
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
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

                {/* Comments Section */}
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
                            placeholder="Enter any survey-specific comments, issues, or notes..."
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
                {/* Responsibility Section */}
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h3 className="font-semibold text-green-900 mb-3">Design Responsibility & Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                              {...field} 
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
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Design Status</h3>
                  <FormField
                    control={form.control}
                    name="designStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
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

                {/* Comments Section */}
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
                            placeholder="Enter design progress, issues, requirements, or technical notes..."
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
                {/* Drawings Section */}
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <h3 className="font-semibold text-purple-900 mb-3">Drawings Responsibility & Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                              {...field} 
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
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="drawingsStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drawings Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
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

                {/* Drawings Comments */}
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
                            placeholder="Enter drawings progress, revisions, approvals, or technical notes..."
                            className="bg-white resize-vertical"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* WAE Section */}
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <h3 className="font-semibold text-orange-900 mb-3">Works As Executed (WAE) Responsibility & Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                              {...field} 
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
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="waeStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WAE Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
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

                {/* WAE Comments */}
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
                            placeholder="Enter WAE progress, field modifications, final documentation notes..."
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