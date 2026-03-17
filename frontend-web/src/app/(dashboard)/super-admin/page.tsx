import { StatCard } from "@/components/dashboard/StatCard"
import { Building2, Users, CreditCard, LayoutDashboard, TrendingUp, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Platform Overview</h2>
        <p className="text-muted-foreground">Global monitoring and management of all academies and subscriptions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Academies" 
          value="142" 
          description="+5 this week"
          icon={<Building2 className="size-4" />}
          className="border-2 border-primary/20 bg-primary/5 shadow-md"
        />
        <StatCard 
          title="Total Students" 
          value="42.5k" 
          description="Active across all platforms"
          icon={<Users className="size-4" />}
          className="border-2 shadow-sm"
        />
        <StatCard 
          title="Platform MRR" 
          value="$82,450" 
          description="+15% from last month"
          icon={<CreditCard className="size-4" />}
          className="border-2 shadow-sm border-green-500/20"
        />
        <StatCard 
          title="Active Instructors" 
          value="1,420" 
          description="Across 142 academies"
          icon={<Users className="size-4" />}
          className="border-2 shadow-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-2 shadow-md">
          <CardHeader>
            <CardTitle>Recent Academy Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Code Masters Academy", admin: "Alex Rivera", plan: "Pro", status: "Active" },
                { name: "Design Peak Studio", admin: "Samantha Lee", plan: "Starter", status: "Pending" },
                { name: "Global Language Center", admin: "Hiroshi Tanaka", plan: "Enterprise", status: "Active" },
              ].map((academy, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{academy.name}</p>
                    <p className="text-xs text-muted-foreground">Admin: {academy.admin}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{academy.plan}</Badge>
                    <Badge variant={academy.status === 'Active' ? 'success' as any : 'secondary'}>
                      {academy.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-2 shadow-md">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center gap-3">
                     <LayoutDashboard className="size-4 text-green-600" />
                     <span className="text-sm font-medium text-green-700">Database</span>
                  </div>
                  <Badge className="bg-green-200 text-green-800 hover:bg-green-200">99.9% Online</Badge>
               </div>
               <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center gap-3">
                     <TrendingUp className="size-4 text-green-600" />
                     <span className="text-sm font-medium text-green-700">API Gateway</span>
                  </div>
                  <Badge className="bg-green-200 text-green-800 hover:bg-green-200">Faster (42ms)</Badge>
               </div>
               <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-3">
                     <Settings className="size-4 text-blue-600" />
                     <span className="text-sm font-medium text-blue-700">Cron Jobs</span>
                  </div>
                  <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">6 Tasks Pending</Badge>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
