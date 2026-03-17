import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const stats = [
    { label: 'Enrolled Courses', value: '12', trend: '+2 this month', icon: BookOpen, href: '/student/courses' },
    { label: 'Lessons Done', value: '45', trend: '5 completed today', icon: TrendingUp, href: '/student/courses' },
    { label: 'Avg. Progress', value: '65%', trend: '+10% weekly', icon: TrendingUp, href: '/student/courses' },
    { label: 'Certificates', value: '3', trend: 'Ready for download', icon: GraduationCap, href: '/student/certificates' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-3xl uppercase tracking-tighter">Your Progress</h2>
          <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mt-1">HEDS Academic Dispatch</p>
        </div>
        <Button variant="outline" className="h-10 border-2 font-black uppercase text-[10px] tracking-widest" asChild>
           <Link href="/student/courses">Explore Curriculum</Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-2 border-black/5 dark:border-white/5 hover:border-brand-yellow/50 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-full -mr-8 -mt-8 group-hover:bg-brand-yellow/10 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <stat.icon className="size-4 text-brand-dark-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-heading mt-1">{stat.value}</div>
              <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mt-1">{stat.trend}</p>
              <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-brand-dark-yellow mt-4 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                <Link href={stat.href}>Access Module</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
         <Card className="col-span-full lg:col-span-4 border-2 shadow-xl bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20">
               <h3 className="font-heading font-black text-xs uppercase tracking-widest">Recent Transmission</h3>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border">
                  {[
                    "Finished \"Introduction to Web Development\" Module 2",
                    "New announcement in \"Advanced Flutter UI\" course",
                    "Certificate generated for \"Digital Marketing Basics\""
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                      <div className="size-2 bg-brand-yellow rounded-full shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                      <p className="text-xs font-bold text-foreground/80">{activity}</p>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="col-span-full lg:col-span-3 border-2 border-black/5 dark:border-white/5 bg-black text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Calendar className="size-24" />
            </div>
            <CardHeader className="border-b border-white/10">
               <h3 className="font-heading font-black text-xs uppercase tracking-widest">Upcoming Dispatches</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
               <div className="size-16 rounded-3xl bg-white/5 flex items-center justify-center border-2 border-white/10 mb-4 animate-pulse">
                  <Calendar className="size-8 text-brand-yellow" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Offline Status</p>
               <p className="text-xs font-bold text-white/80 mt-2">No missions scheduled for 24H.</p>
               <Button variant="outline" className="mt-6 border-white/20 text-white hover:bg-white hover:text-black font-black uppercase text-[10px] tracking-widest px-8">Refresh Log</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
