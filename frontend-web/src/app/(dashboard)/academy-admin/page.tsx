import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign, Activity } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AcademyAdminDashboard() {
  const stats = [
    { title: "Total Cadets", value: "1,284", trend: "+12% monthly", icon: <Users className="size-4" /> },
    { title: "Active Officers", value: "24", trend: "3 pending review", icon: <GraduationCap className="size-4" /> },
    { title: "Deployed Courses", value: "48", trend: "128 modules active", icon: <BookOpen className="size-4" /> },
    { title: "Monthly Revenue", value: "$12,450", trend: "+8.2% growth", icon: <DollarSign className="size-4 text-brand-dark-yellow" /> },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-3xl uppercase tracking-tighter">Academy Pulse</h2>
          <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mt-1">Global Infrastructure Command</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 border-2 font-black uppercase text-[10px] tracking-widest" asChild>
             <Link href="/academy-admin/billing">System Billing</Link>
          </Button>
          <Button className="h-10 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-6 shadow-xl" asChild>
             <Link href="/academy-admin/instructors">Manage Staff</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-2 border-black/5 dark:border-white/5 bg-background shadow-md group hover:border-brand-yellow/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
              <div className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-heading mt-1">{stat.value}</div>
              <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 border-2 shadow-xl bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between py-4">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Activity className="size-3.5 text-brand-dark-yellow" />
              Efficiency Spectrum
            </h3>
            <Badge variant="outline" className="text-[9px] font-bold py-0.5 border-black/10 dark:border-white/10">30D Analysis</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                { name: "Fullstack Web Development", students: 450, growth: "+15%", color: "bg-green-500" },
                { name: "Mobile App Design with Figma", students: 320, growth: "+10%", color: "bg-blue-500" },
                { name: "Advanced Python for Data Science", students: 280, growth: "+5%", color: "bg-brand-yellow" },
              ].map((course, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn("size-2 rounded-full", course.color)} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-black uppercase tracking-widest">{course.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{course.students} Active Units</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-green-600 font-black text-[10px] tracking-widest">
                      <TrendingUp className="size-3" />
                      {course.growth}
                    </div>
                    <Button variant="link" className="h-auto p-0 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Full Intelligence</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 border-2 border-black/5 dark:border-white/5 bg-[#0a0a0a] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
            <GraduationCap className="size-32" />
          </div>
          <CardHeader className="border-b border-white/10 p-4">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest">Recent Staff Broadcasts</h3>
          </CardHeader>
          <CardContent className="p-4">
             <div className="space-y-4">
               {[
                 { name: "Sarah Johnson", action: "Pushed curriculum update", time: "2H AGO" },
                 { name: "Michael Chen", action: "Initialized live transmission", time: "5H AGO" },
                 { name: "Emily Davis", action: "Validated 12 assessments", time: "1D AGO" },
               ].map((act, i) => (
                 <div key={i} className="flex gap-4 items-start p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                   <div className="size-10 rounded-xl bg-white text-black flex items-center justify-center text-[10px] font-black shadow-lg">
                     {act.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest">{act.name}</p>
                     <p className="text-[11px] text-white/60 font-medium">{act.action}</p>
                     <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-black">{act.time}</p>
                   </div>
                 </div>
               ))}
             </div>
             <Button variant="outline" className="w-full mt-8 border-white/20 text-white hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest h-12" asChild>
                <Link href="/academy-admin/instructors">Establish Connection</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
