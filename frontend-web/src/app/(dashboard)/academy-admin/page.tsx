import { StatCard } from "@/components/dashboard/StatCard"
import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AcademyAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Academy Overview</h2>
        <p className="text-muted-foreground">Manage your academy's growth and performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value="1,284" 
          description="+12% from last month"
          icon={<Users className="size-4" />}
          className="border-2 border-primary/10 shadow-sm"
        />
        <StatCard 
          title="Active Instructors" 
          value="24" 
          description="3 pending approval"
          icon={<GraduationCap className="size-4" />}
          className="border-2 shadow-sm"
        />
        <StatCard 
          title="Live Courses" 
          value="48" 
          description="128 lessons total"
          icon={<BookOpen className="size-4" />}
          className="border-2 shadow-sm"
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$12,450" 
          description="+8% vs last month"
          icon={<DollarSign className="size-4" />}
          className="border-2 shadow-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-2 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Courses</CardTitle>
            <Badge variant="outline">This Month</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Fullstack Web Development", students: 450, growth: "+15%" },
                { name: "Mobile App Design with Figma", students: 320, growth: "+10%" },
                { name: "Advanced Python for Data Science", students: 280, growth: "+5%" },
              ].map((course, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.students} active students</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <TrendingUp className="size-3" />
                    {course.growth}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-2 shadow-md">
          <CardHeader>
            <CardTitle>Recent Instructor Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {[
                 { name: "Sarah Johnson", action: "Uploaded new lesson", time: "2h ago" },
                 { name: "Michael Chen", action: "Scheduled live session", time: "5h ago" },
                 { name: "Emily Davis", action: "Graded 12 assignments", time: "1d ago" },
               ].map((act, i) => (
                 <div key={i} className="flex gap-4 items-start">
                   <div className="size-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                     {act.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div className="space-y-1">
                     <p className="text-xs font-semibold">{act.name}</p>
                     <p className="text-[10px] text-muted-foreground">{act.action}</p>
                     <p className="text-[8px] uppercase tracking-tighter text-muted-foreground/50">{act.time}</p>
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
