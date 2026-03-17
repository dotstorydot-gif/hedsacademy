import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Users, Clock, Calendar, ExternalLink } from "lucide-react"

export default function LiveSessionsPage() {
  const sessions = [
    { title: "React Performance Optimization", instructor: "Sarah Johnson", date: "Today", time: "2:00 PM", status: "upcoming", link: "https://meet.jit.si/heds-react-perf" },
    { title: "Introduction to Figma Auto-Layout", instructor: "Michael Chen", date: "Tomorrow", time: "11:00 AM", status: "upcoming", link: "https://meet.jit.si/heds-figma-layout" },
    { title: "Advanced Node.js Patterns", instructor: "Sarah Johnson", date: "Mar 20, 2026", time: "4:00 PM", status: "scheduled", link: "https://meet.jit.si/heds-node-patterns" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Live Sessions</h2>
          <p className="text-muted-foreground">Schedule and manage your live interactive classes.</p>
        </div>
        <Button className="shadow-lg">
          <Video className="mr-2 size-4" /> Schedule Session
        </Button>
      </div>

      <div className="grid gap-6">
        {sessions.map((session, i) => (
          <Card key={i} className="border-2 shadow-sm overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-48 bg-muted/30 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r gap-2">
                 <Calendar className="size-8 text-primary/40" />
                 <p className="text-sm font-bold text-center">{session.date}</p>
                 <Badge variant={session.status === 'upcoming' ? 'success' as any : 'secondary'}>
                    {session.status}
                 </Badge>
              </div>
              <CardContent className="flex-1 p-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{session.title}</h3>
                       <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                             <Users className="size-3" />
                             {session.instructor}
                          </div>
                          <div className="flex items-center gap-1">
                             <Clock className="size-3" />
                             {session.time} (60 mins)
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" asChild>
                          <a href={session.link} target="_blank" rel="noreferrer">
                             <ExternalLink className="mr-2 size-3" /> Join Link
                          </a>
                       </Button>
                       <Button size="sm">Edit Session</Button>
                    </div>
                 </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
