"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, MapPin, Video, ChevronLeft, ChevronRight } from "lucide-react"

export default function StudentSchedulePage() {
  const schedule = [
    {
      id: 1,
      title: "React Performance Audit",
      type: "Live Workshop",
      time: "14:00 - 15:30",
      date: "Today",
      platform: "HEDS Live Terminal",
      instructor: "Dr. Sarah Johnson",
      status: "Starting soon"
    },
    {
      id: 2,
      title: "Flutter State Management Q&A",
      type: "Group Mentorship",
      time: "10:00 - 11:00",
      date: "Tomorrow",
      platform: "Google Meet",
      instructor: "Eng. Ahmed Rayan",
      status: "Upcoming"
    },
    {
      id: 3,
      title: "Backend Security Protocols",
      type: "Live Session",
      time: "16:00 - 18:00",
      date: "Thursday",
      platform: "HEDS Live Terminal",
      instructor: "HEDS Faculty",
      status: "Upcoming"
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Mission Schedule</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time Deployment Log</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border-2 border-transparent">
          <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-white/10">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-[10px] font-black uppercase tracking-widest px-4">March 2026</span>
          <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-white/10">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {schedule.map((item) => (
            <Card key={item.id} className="group border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm hover:border-brand-yellow/30 transition-all rounded-3xl overflow-hidden">
               <div className="flex flex-col md:flex-row">
                 <div className="md:w-48 bg-muted/20 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{item.date}</span>
                    <span className="text-2xl font-black font-heading text-brand-dark-yellow">{item.time.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">GMT +2</span>
                 </div>
                 
                 <div className="flex-1 p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-2 rounded-full",
                            item.status === "Starting soon" ? "bg-red-500 animate-pulse" : "bg-brand-yellow"
                          )} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{item.type}</span>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-black/5 dark:border-white/5">
                         {item.platform}
                       </span>
                    </div>
                    
                    <h3 className="text-xl font-black tracking-tight mb-4 group-hover:text-brand-dark-yellow transition-colors">{item.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-6">
                       <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-muted border" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{item.instructor}</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="size-3" />
                          <span className="text-[10px] font-bold uppercase">{item.time}</span>
                       </div>
                    </div>

                    <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                       <Button size="sm" className="bg-brand-yellow text-black font-black uppercase tracking-widest text-[9px] rounded-xl shadow-lg shadow-brand-yellow/20">
                         Access Session
                       </Button>
                    </div>
                 </div>
               </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
           <Card className="border-2 border-black/5 dark:border-white/5 bg-black text-white rounded-3xl overflow-hidden relative group p-8">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <CalendarIcon className="size-32" />
              </div>
              <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-6 relative z-10">Timezone Context</h3>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                    <span>Cairo (Local)</span>
                    <span>17:45</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                    <span>London (GMT)</span>
                    <span>15:45</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60 border-t border-white/10 pt-4">
                    <span>Dubai (+4)</span>
                    <span>19:45</span>
                 </div>
              </div>
              <p className="mt-8 text-[9px] font-medium text-white/40 leading-relaxed uppercase tracking-wider">
                 All mission schedules are synchronized to your system hardware clock automatically.
              </p>
           </Card>

           <Card className="border-2 border-black/5 dark:border-white/5 bg-muted/10 rounded-3xl p-8 border-dashed flex flex-col items-center justify-center text-center gap-4">
              <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                 <Video className="size-6 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                 <p className="font-heading font-black text-xs uppercase tracking-widest">Missed a session?</p>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Archives available within 24H of deployment.</p>
              </div>
              <Button variant="outline" size="sm" className="font-black uppercase text-[9px] tracking-widest border-2 mt-2">
                 View Archives
              </Button>
           </Card>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
