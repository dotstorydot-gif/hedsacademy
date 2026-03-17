import { Button } from "@/components/ui/button"
import { Plus, Search, BookOpen, Users, Star, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CourseManagementPage() {
  const courses = [
    { id: "1", title: "Introduction to React Hooks", students: 120, rating: 4.8, price: "$49", status: "published" },
    { id: "2", title: "Advanced CSS Layouts", students: 85, rating: 4.5, price: "$59", status: "draft" },
    { id: "3", title: "Web Accessibility Masterclass", students: 210, rating: 4.9, price: "$79", status: "published" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Course Management</h2>
          <p className="text-muted-foreground">Create, edit, and track your educational content.</p>
        </div>
        <Button className="shadow-lg" asChild>
          <Link href="/instructor/courses/new">
            <Plus className="mr-2 size-4" /> Create New Course
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border-2 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search your courses..." className="pl-10 text-sm" />
        </div>
        <Button variant="outline" size="sm">Filter</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id} className="border-2 hover:border-primary/50 transition-all shadow-sm group overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
               <div className="space-y-1">
                 <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                   {course.title}
                 </CardTitle>
                 <div className="flex items-center gap-2">
                    <Badge variant={course.status === 'published' ? 'success' as any : 'secondary'}>
                      {course.status}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground">{course.price}</span>
                 </div>
               </div>
               <Button variant="ghost" size="icon">
                 <MoreVertical className="size-4" />
               </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  <span className="text-xs font-medium">{course.students}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <BookOpen className="size-4" />
                   <span className="text-xs font-medium">12 Lessons</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Button className="flex-1" variant="outline" asChild>
                  <Link href={`/instructor/courses/${course.id}/info`}>Edit Course</Link>
                </Button>
                <Button className="flex-1">Analytics</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
