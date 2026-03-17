import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Clock, TrendingUp } from "lucide-react"

export default async function InstructorStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all courses by this instructor
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .eq("instructor_id", user?.id)

  const courseIds = (courses || []).map(c => c.id)

  // Get all enrollments for those courses with student info
  const { data: enrollments } = courseIds.length > 0
    ? await supabase
        .from("enrollments")
        .select("*, users(name, email), courses(title)")
        .in("course_id", courseIds)
        .order("enrolled_at", { ascending: false })
    : { data: [] }

  const stats = {
    total: enrollments?.length || 0,
    courses: courses?.length || 0,
    avgProgress: enrollments?.length
      ? Math.round((enrollments.reduce((acc, e) => acc + (e.progress || 0), 0)) / enrollments.length)
      : 0
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tighter italic">Student Roster</h2>
        <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">All enrolled students across your courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: stats.total, icon: <Users className="size-4" /> },
          { label: "Active Courses", value: stats.courses, icon: <BookOpen className="size-4" /> },
          { label: "Avg. Progress", value: `${stats.avgProgress}%`, icon: <TrendingUp className="size-4" /> },
        ].map((s, i) => (
          <Card key={i} className="border-2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-10 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center">{s.icon}</div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-black font-heading">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student Table */}
      <Card className="border-2 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/10 py-4">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!enrollments || enrollments.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="size-10 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-sm font-bold text-muted-foreground">No students enrolled yet.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Students will appear here once they enroll in your courses.</p>
            </div>
          ) : (
            <div className="divide-y">
              {enrollments.map((enrollment: any) => (
                <div key={enrollment.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/10 transition-colors group">
                  <div className="size-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black shadow-md">
                    {enrollment.users?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black uppercase tracking-tight truncate">{enrollment.users?.name || "Unknown"}</p>
                    <p className="text-[10px] text-muted-foreground font-medium truncate">{enrollment.users?.email}</p>
                  </div>
                  <div className="hidden md:block flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate">{enrollment.courses?.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progress</p>
                      <p className="text-sm font-black">{enrollment.progress || 0}%</p>
                    </div>
                    <div className="w-24 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-yellow rounded-full transition-all"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider">
                    {new Date(enrollment.enrolled_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
