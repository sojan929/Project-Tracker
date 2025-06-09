import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { Project } from "@/../../shared/schema";
import { calculateKPIs } from "@/lib/utils";

interface KPICardsProps {
  projects: Project[];
  isLoading: boolean;
}

export function KPICards({ projects, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white shadow-sm border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = calculateKPIs(projects);

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.total}</div>
            <p className="text-xs text-gray-600 mt-1">All projects in system</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Construction</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.activeConstructionProjects}</div>
            <p className="text-xs text-gray-600 mt-1">Projects in construction phases</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Construction Complete</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.constructionComplete}</div>
            <p className="text-xs text-gray-600 mt-1">Practical completion reached</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Design</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.activeDesignProjects}</div>
            <p className="text-xs text-gray-600 mt-1">Projects in design phases</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Design Complete</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis.designComplete}</div>
            <p className="text-xs text-gray-600 mt-1">Ready for construction</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Average Progress</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Survey</span>
              <span className="font-medium">{kpis.avgSurveyProgress}%</span>
            </div>
            <Progress value={kpis.avgSurveyProgress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Design</span>
              <span className="font-medium">{kpis.avgDesignProgress}%</span>
            </div>
            <Progress value={kpis.avgDesignProgress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Drawings</span>
              <span className="font-medium">{kpis.avgDrawingsProgress}%</span>
            </div>
            <Progress value={kpis.avgDrawingsProgress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">WAE</span>
              <span className="font-medium">{kpis.avgWaeProgress}%</span>
            </div>
            <Progress value={kpis.avgWaeProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}