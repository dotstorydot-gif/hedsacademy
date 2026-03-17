import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, UserMinus, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function StudentManagementPage() {
  const students = [
    { name: "John Doe", email: "john@example.com", courses: 12, joined: "Jan 10, 2026", progress: "85%", status: "active" },
    { name: "Alice Brown", email: "alice@example.com", courses: 5, joined: "Feb 15, 2026", progress: "40%", status: "active" },
    { name: "Bob Martin", email: "bob@example.com", courses: 2, joined: "Mar 01, 2026", progress: "10%", status: "active" },
    { name: "Charlie Wilson", email: "charlie@example.com", courses: 8, joined: "Dec 12, 2025", progress: "100%", status: "suspended" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Students</h2>
          <p className="text-muted-foreground">Monitor and manage student enrollment and progress.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <UserMinus className="mr-2 size-4" /> Bulk Suspend
          </Button>
          <Button className="shadow-lg">
            <UserPlus className="mr-2 size-4" /> Enroll Student
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border-2 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search students by name or email..." className="pl-10" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <div className="rounded-xl border-2 overflow-hidden bg-card shadow-md">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Enrolled Courses</TableHead>
              <TableHead>Avg. Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-sm">{student.courses}</TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: student.progress }} />
                      </div>
                      <span className="text-[10px] font-bold">{student.progress}</span>
                   </div>
                </TableCell>
                <TableCell>
                  <Badge variant={student.status === 'active' ? 'success' as any : 'destructive'}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
