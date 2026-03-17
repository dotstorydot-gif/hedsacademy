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
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function InstructorManagementPage() {
  const instructors = [
    { name: "Sarah Johnson", email: "sarah@academy.com", courses: 5, joined: "Jan 12, 2026", status: "active" },
    { name: "Michael Chen", email: "michael@academy.com", courses: 3, joined: "Feb 05, 2026", status: "active" },
    { name: "Emily Davis", email: "emily@academy.com", courses: 8, joined: "Dec 20, 2025", status: "active" },
    { name: "David Wilson", email: "david@academy.com", courses: 2, joined: "Mar 10, 2026", status: "pending" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Instructors</h2>
          <p className="text-muted-foreground">Manage and overview your academy&apos;s instructors.</p>
        </div>
        <Button className="shadow-lg">
          <Plus className="mr-2 size-4" /> Add Instructor
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border-2 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search instructors..." className="pl-10" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="rounded-xl border-2 overflow-hidden bg-card shadow-md">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Instructor</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border">
                      {instructor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{instructor.name}</p>
                      <p className="text-[10px] text-muted-foreground">{instructor.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-sm">{instructor.courses}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{instructor.joined}</TableCell>
                <TableCell>
                  <Badge variant={instructor.status === 'active' ? 'success' as any : 'secondary'}>
                    {instructor.status}
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
