import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit, Calendar, User, MapPin, FileText, Settings, Pencil, Hammer, CheckCircle } from "lucide-react";
import type { Project } from "../../../shared/schema";
import { getPriorityColor, getPriorityLabel, getStatusColor, getStatusLabel, getStageLabel, getConstructionProgressColor, getConstructionProgressLabel } from "@/lib/utils";

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  project: Project | null;
}

export function ProjectDetailsModal({ isOpen, onClose, onEdit, project }: ProjectDetailsModalProps) {
  if (!project) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl text-blue-900">{project.name}</DialogTitle>
              <DialogDescription className="mt-2 text-gray-600">
                Project #{project.designProjectNumber} - Comprehensive project overview and progress tracking
              </DialogDescription>
            </div>
            <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <FileText className="h-5 w-5 mr-2" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <Badge className={`${getPriorityColor(project.priority || "")} text-white mt-1`}>
                    {getPriorityLabel(project.priority || "")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Construction Progress</p>
                  <Badge className={`${getConstructionProgressColor(project.constructionProgress || "")} text-white mt-1`}>
                    {getConstructionProgressLabel(project.constructionProgress || "")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Design Stage</p>
                  <Badge variant="outline" className="mt-1">
                    {getStageLabel(project.designStage || "")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Project Leader</p>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm">{project.designProjectLeader || "Not assigned"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Work Order Number</p>
                  <p className="text-sm mt-1">{project.workOrderNumber || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Project Dates</p>
                  <div className="flex items-center mt-1 text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span>Start: {formatDate(project.projectStartDate)}</span>
                    <span className="mx-2">•</span>
                    <span>Finish: {formatDate(project.projectFinishDate)}</span>
                  </div>
                </div>
              </div>

              {project.briefScope && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Project Scope</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{project.briefScope}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Phase Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Settings className="h-5 w-5 mr-2" />
                Phase Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Survey Progress */}
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-blue-900">Survey</h4>
                  <Progress value={project.surveyPercentCompleted || 0} className="mt-2 mb-1" />
                  <p className="text-sm text-gray-600">{project.surveyPercentCompleted || 0}% Complete</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {getStatusLabel(project.surveyStatus || "not-started")}
                  </Badge>
                </div>

                {/* Design Progress */}
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                    <Pencil className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-green-900">Design</h4>
                  <Progress value={project.designPercentCompleted || 0} className="mt-2 mb-1" />
                  <p className="text-sm text-gray-600">{project.designPercentCompleted || 0}% Complete</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {getStatusLabel(project.designStatus || "not-started")}
                  </Badge>
                </div>

                {/* Drawings Progress */}
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-purple-900">Drawings</h4>
                  <Progress value={project.drawingsPercentCompleted || 0} className="mt-2 mb-1" />
                  <p className="text-sm text-gray-600">{project.drawingsPercentCompleted || 0}% Complete</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {getStatusLabel(project.drawingsStatus || "not-started")}
                  </Badge>
                </div>

                {/* WAE Progress */}
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium text-orange-900">WAE</h4>
                  <Progress value={project.waePercentCompleted || 0} className="mt-2 mb-1" />
                  <p className="text-sm text-gray-600">{project.waePercentCompleted || 0}% Complete</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {getStatusLabel(project.waeStatus || "not-started")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Phase Information */}
          <div className="grid gap-6">
            {/* Survey Details */}
            <Card className="border-l-4 border-blue-400">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center text-blue-900">
                  <MapPin className="h-5 w-5 mr-2" />
                  Survey Phase Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Responsible Person</p>
                    <p className="text-sm mt-1">{project.surveyBy || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Survey Method</p>
                    <p className="text-sm mt-1">{project.surveyMethod || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Status</p>
                    <Badge className={`${getStatusColor(project.surveyStatus || "")} text-white mt-1`}>
                      {getStatusLabel(project.surveyStatus || "not-started")}
                    </Badge>
                  </div>
                </div>
                {project.surveyComments && (
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-2">Survey Comments</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{project.surveyComments}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Design Details */}
            <Card className="border-l-4 border-green-400">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center text-green-900">
                  <Pencil className="h-5 w-5 mr-2" />
                  Design Phase Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-800">Responsible Person</p>
                    <p className="text-sm mt-1">{project.designBy || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Status</p>
                    <Badge className={`${getStatusColor(project.designStatus || "")} text-white mt-1`}>
                      {getStatusLabel(project.designStatus || "not-started")}
                    </Badge>
                  </div>
                </div>
                {project.designComments && (
                  <div>
                    <p className="text-sm font-medium text-green-800 mb-2">Design Comments</p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{project.designComments}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drawings Details */}
            <Card className="border-l-4 border-purple-400">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center text-purple-900">
                  <FileText className="h-5 w-5 mr-2" />
                  Drawings Phase Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Responsible Person</p>
                    <p className="text-sm mt-1">{project.drawingsBy || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Status</p>
                    <Badge className={`${getStatusColor(project.drawingsStatus || "")} text-white mt-1`}>
                      {getStatusLabel(project.drawingsStatus || "not-started")}
                    </Badge>
                  </div>
                </div>
                {project.drawingsComments && (
                  <div>
                    <p className="text-sm font-medium text-purple-800 mb-2">Drawings Comments</p>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{project.drawingsComments}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WAE Details */}
            <Card className="border-l-4 border-orange-400">
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center text-orange-900">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Works As Executed (WAE) Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-orange-800">Responsible Person</p>
                    <p className="text-sm mt-1">{project.waeBy || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">Status</p>
                    <Badge className={`${getStatusColor(project.waeStatus || "")} text-white mt-1`}>
                      {getStatusLabel(project.waeStatus || "not-started")}
                    </Badge>
                  </div>
                </div>
                {project.waeComments && (
                  <div>
                    <p className="text-sm font-medium text-orange-800 mb-2">WAE Comments</p>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{project.waeComments}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}