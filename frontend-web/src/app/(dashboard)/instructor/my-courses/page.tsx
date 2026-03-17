import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Star, Plus, MoreVertical } from "lucide-react"

export default function MyCoursesPage() {
  const courses = [
    { title: "Introduction to React Hooks", students: 120, rating: 4.8, price: "$49", status: "published" },
    { title: "Advanced CSS Layouts", students: 85, rating: 4.5, price: "$59", status: "draft" },
    { title: "Web Accessibility Masterclass", students: 210, rating: 4.9, price: "$79", status: "published" },
    { title: "Next.js 14 Enterprise Patterns", students: 45, rating: 5.0, price: "$99", status: "published" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">My Courses</h2>
          <p className="text-muted-foreground">Manage and create your learning content.</p>
        </div>
        <Button className="shadow-lg">
          <Plus className="mr-2 size-4" /> Create Course
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course, i) => (
          <Card key={i} className="border-2 hover:border-primary/50 transition-all cursor-pointer shadow-sm group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
               <div className="space-y-1">
                 <CardTitle className="group-hover:text-primary transition-colors">{course.title}</CardTitle>
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
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{course.students}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                   <BookOpen className="size-4 text-muted-foreground" />
                   <span className="text-sm font-medium">12 Lessons</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Button className="flex-1" variant="outline">Edit Course</Button>
                <Button className="flex-1">View Stats</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
