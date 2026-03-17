import { StatCard } from "@/components/dashboard/StatCard"
import { Users, DollarSign, Star, Calendar, MessageSquare, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InstructorDashboard() {
  const stats = [
    { title: "Active Students", value: "842", description: "+45 this week", icon: <Users className="size-4" /> },
    { title: "Avg. Rating", value: "4.8", description: "Top 5% in Academy", icon: <Star className="size-4 text-brand-yellow fill-brand-yellow" /> },
    { title: "Monthly Earnings", value: "$4,250", description: "Payout in 3 days", icon: <DollarSign className="size-4 text-green-500" /> },
    { title: "Live Prep", value: "3", description: "Next: 14:00 GMT", icon: <Calendar className="size-4" /> },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-3xl uppercase tracking-tighter">Command Center</h2>
          <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mt-1">Instructor Performance Dispatch</p>
        </div>
        <Button className="h-12 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-8 shadow-2xl hover:scale-105 transition-all" asChild>
          <Link href="/instructor/courses/new">
            <Plus className="mr-2 h-4 w-4" /> Deploy New Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2 border-black/5 dark:border-white/5 bg-background shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-heading mt-1">{stat.value}</div>
              <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 border-2 shadow-xl bg-card/30 backdrop-blur-sm overflow-hidden">
           <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between py-4">
              <h3 className="font-heading font-black text-xs uppercase tracking-widest text-muted-foreground">Active Modules</h3>
              <Button variant="ghost" className="h-6 text-[9px] font-black uppercase tracking-widest" asChild>
                <Link href="/instructor/my-courses">View All</Link>
              </Button>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-border">
                 {[
                   { title: "Introduction to React Hooks", progress: "85%", students: 120 },
                   { title: "Advanced CSS Layouts", progress: "40%", students: 85 },
                   { title: "Web Accessibility Masterclass", progress: "100%", students: 210 },
                 ].map((course, i) => (
                   <div key={i} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
                      <div className="space-y-1">
                         <p className="text-xs font-black uppercase tracking-wider group-hover:text-brand-dark-yellow transition-colors">{course.title}</p>
                         <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5"><Users className="size-3" /> {course.students} Cadets</span>
                            <span>•</span>
                            <span className="bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-foreground font-black tracking-widest">{course.progress}</span>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 border-2 font-black uppercase text-[9px] tracking-widest" asChild>
                         <Link href={`/instructor/courses/${i}/info`}>Analyze</Link>
                      </Button>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 border-2 border-black/5 dark:border-white/5 bg-background shadow-xl">
           <CardHeader className="border-b bg-muted/10 p-4">
              <h3 className="font-heading font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="size-3.5 text-brand-dark-yellow" />
                Unread Signals
              </h3>
           </CardHeader>
           <CardContent className="p-4">
              <div className="space-y-3">
                 {[
                   { user: "Adam Smith", msg: "Can you clarify the last assignment?", time: "10m ago" },
                   { user: "Elena Rodriguez", msg: "Thank you for the session!", time: "1h ago" },
                   { user: "Kevin Park", msg: "When is the next live class?", time: "3h ago" },
                 ].map((msg, i) => (
                   <div key={i} className="flex gap-4 items-center p-3 rounded-xl border-2 border-transparent hover:border-black/5 dark:hover:border-white/10 hover:bg-muted/30 transition-all cursor-pointer group">
                      <div className="size-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black shadow-lg">
                        {msg.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-0.5 flex-1 overflow-hidden">
                         <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black uppercase tracking-widest">{msg.user}</p>
                            <span className="text-[9px] font-bold text-muted-foreground/60">{msg.time}</span>
                         </div>
                         <p className="text-[11px] text-muted-foreground font-medium truncate group-hover:text-foreground transition-colors">{msg.msg}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <Button variant="outline" className="w-full mt-6 text-[10px] font-black uppercase tracking-widest h-10 border-2" asChild>
                 <Link href="/instructor/messages">Signal Hub</Link>
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
