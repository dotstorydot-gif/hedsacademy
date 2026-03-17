"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight, PlayCircle, History } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function StudentSchedulePage() {
  const [view, setView] = useState<'upcoming' | 'archives'>('upcoming')
  
  const schedule = [
    {
      id: "session-101",
      courseId: "react-eng-01",
      title: "React Performance Audit",
      type: "Live Workshop",
      time: "14:00 - 15:30",
      date: "Today",
      platform: "HEDS Live Terminal",
      instructor: "Dr. Sarah Johnson",
      status: "Starting soon"
    },
    {
      id: "session-102",
      courseId: "flutter-sm-02",
      title: "Flutter State Management Q&A",
      type: "Group Mentorship",
      time: "10:00 - 11:00",
      date: "Tomorrow",
      platform: "Google Meet",
      instructor: "Eng. Ahmed Rayan",
      status: "Upcoming"
    }
  ]

  const archives = [
    {
      id: "rec-001",
      courseId: "industrial-ux-03",
      title: "Industrial Design Systems 101",
      type: "Recorded Workshop",
      time: "2h 15m",
      date: "Mar 15, 2026",
      platform: "HEDS Archive",
      instructor: "HEDS Faculty",
      status: "Recorded"
    },
    {
      id: "rec-002",
      courseId: "backend-sec-04",
      title: "Zero Trust Architecture",
      type: "Recorded Session",
      time: "1h 45m",
      date: "Mar 12, 2026",
      platform: "HEDS Archive",
      instructor: "Security Team",
      status: "Recorded"
    }
  ]

  const currentItems = view === 'upcoming' ? schedule : archives

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter italic">Mission Schedule</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time Deployment Log</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/10 p-1.5 rounded-2xl border border-black/5 dark:border-white/5">
          <Button 
            variant={view === 'upcoming' ? 'default' : 'ghost'} 
            onClick={() => setView('upcoming')}
            className={cn(
              "h-10 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
              view === 'upcoming' ? "bg-black text-white dark:bg-white dark:text-black shadow-xl" : "hover:bg-white/10"
            )}
          >
            Upcoming
          </Button>
          <Button 
            variant={view === 'archives' ? 'default' : 'ghost'} 
            onClick={() => setView('archives')}
            className={cn(
              "h-10 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
              view === 'archives' ? "bg-black text-white dark:bg-white dark:text-black shadow-xl" : "hover:bg-white/10"
            )}
          >
            Archives
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {currentItems.map((item) => (
            <Card key={item.id} className="group border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm hover:border-brand-yellow/30 transition-all rounded-[2rem] overflow-hidden shadow-sm">
               <div className="flex flex-col md:flex-row">
                 <div className="md:w-44 bg-muted/20 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 opacity-50">{item.date}</span>
                    <span className="text-3xl font-black font-heading text-brand-dark-yellow italic">{view === 'archives' ? "REC" : item.time.split(' ')[0]}</span>
                    <span className="text-[9px] font-black text-muted-foreground mt-2 uppercase tracking-[0.2em]">
                      {view === 'archives' ? item.time : "GMT +2"}
                    </span>
                 </div>
                 
                 <div className="flex-1 p-8 relative">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "size-2 rounded-full shadow-[0_0_8px_currentColor]",
                            item.status === "Starting soon" ? "text-red-500 bg-red-500 animate-pulse" : 
                            view === 'archives' ? "text-white/20 bg-white/20" : "text-brand-yellow bg-brand-yellow"
                          )} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{item.type}</span>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full border border-black/5 dark:border-white/5 opacity-50">
                         {item.platform}
                       </span>
                    </div>
                    
                    <h3 className="text-2xl font-black tracking-tighter mb-6 group-hover:text-brand-dark-yellow transition-colors italic uppercase leading-none">{item.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-8">
                       <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-muted border-2 flex items-center justify-center shadow-lg">
                             <span className="text-[10px] font-black uppercase">{item.instructor[0]}</span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tight">{item.instructor}</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                          {view === 'archives' ? <History className="size-4" /> : <Clock className="size-4" />}
                          <span className="text-[10px] font-black uppercase tracking-tight">{item.time}</span>
                       </div>
                    </div>

                    <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
                       <Button 
                         asChild
                         className="h-12 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl hover:bg-brand-yellow hover:text-black transition-all gap-3 px-8"
                       >
                         <Link href={`/student/courses/${item.courseId}/live/${item.id}`}>
                           {view === 'archives' ? <PlayCircle className="size-5" /> : <Video className="size-5" />}
                           {view === 'archives' ? "Watch Recording" : "Access Session"}
                         </Link>
                       </Button>
                    </div>
                 </div>
               </div>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
           <Card className="border-0 bg-black text-white rounded-[2.5rem] overflow-hidden relative group p-10 shadow-2xl transition-all hover:shadow-brand-yellow/5 ring-1 ring-white/5">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <CalendarIcon className="size-48" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-brand-yellow">Timezone Protocol</h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-center group/item cursor-default">
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-40 group-hover/item:opacity-100 transition-opacity">Cairo (Local)</span>
                    <span className="text-lg font-black font-heading italic tracking-tight">17:45</span>
                 </div>
                 <div className="flex justify-between items-center group/item cursor-default">
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-40 group-hover/item:opacity-100 transition-opacity">London (GMT)</span>
                    <span className="text-lg font-black font-heading italic tracking-tight opacity-60">15:45</span>
                 </div>
                 <div className="flex justify-between items-center group/item cursor-default border-t border-white/5 pt-6">
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-40 group-hover/item:opacity-100 transition-opacity">Dubai (+4)</span>
                    <span className="text-lg font-black font-heading italic tracking-tight opacity-60">19:45</span>
                 </div>
              </div>
              <p className="mt-10 text-[9px] font-bold text-white/20 leading-loose uppercase tracking-[0.2em]">
                 All global mission schedules are synchronized to your hardware terminal clock via HEDS-UTC protocols.
              </p>
           </Card>

           <Card className="border-2 border-black/5 dark:border-white/5 bg-muted/5 rounded-[2.5rem] p-10 border-dashed flex flex-col items-center justify-center text-center gap-6 group hover:bg-muted/10 transition-all">
              <div className="size-16 rounded-[1.25rem] bg-muted flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                 <Video className="size-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-2">
                 <p className="font-heading font-black text-sm uppercase tracking-tighter italic">Missed a session?</p>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight leading-relaxed">Archives available within 24H of deployment.</p>
              </div>
              <Button 
                onClick={() => setView('archives')}
                variant="outline" 
                className="h-12 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 hover:bg-black hover:text-white transition-all shadow-xl"
              >
                 View Archives
              </Button>
           </Card>
        </div>
      </div>
    </div>
  )
}
