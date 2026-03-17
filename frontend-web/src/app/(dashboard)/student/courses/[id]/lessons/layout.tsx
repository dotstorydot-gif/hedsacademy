"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  Menu, 
  X, 
  FileQuestion, 
  FileText, 
  Users,
  Trophy
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

import { CourseProvider, useCourse } from "./CourseContext"

interface LessonPlayerLayoutProps {
  children: React.ReactNode
}

function LessonPlayerContent({ children }: LessonPlayerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const params = useParams()
  const courseId = params.id as string
  const { curriculum, progressPercent } = useCourse()

  const getIcon = (type: string, active: boolean, completed: boolean) => {
    if (completed) return <CheckCircle2 className={cn("size-5 shrink-0 transition-all", active ? "text-brand-yellow" : "text-green-500")} />
    
    switch (type) {
      case 'quiz': return <FileQuestion className={cn("size-5 shrink-0", active ? "text-brand-yellow" : "text-muted-foreground/30")} />
      case 'assignment': return <FileText className={cn("size-5 shrink-0", active ? "text-brand-yellow" : "text-muted-foreground/30")} />
      case 'meeting': return <Users className={cn("size-5 shrink-0", active ? "text-brand-yellow" : "text-muted-foreground/30")} />
      case 'exam': return <Trophy className={cn("size-5 shrink-0", active ? "text-brand-yellow" : "text-muted-foreground/30")} />
      default: return <Circle className={cn("size-5 shrink-0", active ? "text-brand-yellow" : "text-muted-foreground/20")} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-20 border-b flex items-center justify-between px-8 bg-card sticky top-0 z-50 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-muted/50 rounded-xl size-10">
              <Menu className="size-5" />
            </Button>
            <Link href="/student/courses" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:text-brand-dark-yellow transition-all group">
              <div className="bg-muted size-8 rounded-lg flex items-center justify-center group-hover:bg-brand-yellow group-hover:text-black transition-colors">
                 <ChevronLeft className="size-4" />
              </div>
              <span>Return Terminal</span>
            </Link>
          </div>
          <div className="flex items-center gap-8">
             <div className="hidden md:block">
                <div className="flex justify-between items-end mb-2">
                   <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Progress Report</p>
                   <p className="text-[10px] font-black text-brand-dark-yellow uppercase tracking-tighter italic">{progressPercent}% SYNCED</p>
                </div>
                <div className="w-56 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                   <div className="h-full bg-brand-yellow rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,215,0,0.5)]" style={{ width: `${progressPercent}%` }} />
                </div>
             </div>
             <div className="size-11 rounded-[14px] bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black shadow-xl ring-2 ring-transparent hover:ring-brand-yellow transition-all cursor-pointer">
                SA
             </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className={cn(
            "flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 transition-all duration-500",
            sidebarOpen ? "mr-0" : ""
          )}>
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>

          <aside className={cn(
            "w-[360px] border-l bg-card flex flex-col transition-all duration-500 fixed inset-y-0 right-0 z-40 md:relative overflow-hidden shadow-2xl md:shadow-none bg-card/60 backdrop-blur-xl",
            sidebarOpen ? "translate-x-0" : "translate-x-full md:w-0 md:opacity-0"
          )}>
            <div className="p-8 border-b flex items-center justify-between bg-muted/30 backdrop-blur-lg">
              <div className="space-y-1">
                 <h2 className="font-heading font-black text-[11px] uppercase tracking-[0.4em] italic">Course Curriculum</h2>
                 <p className="text-[8px] font-black text-brand-dark-yellow uppercase tracking-widest opacity-60">Phase Alpha 02 • Active Mission</p>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={() => setSidebarOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {curriculum.map((module, i) => (
                <div key={i} className="">
                  <div className="bg-muted/10 px-8 py-5 border-y border-black/5 dark:border-white/5">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{module.title.toUpperCase()}</span>
                  </div>
                  <div className="p-5 space-y-2">
                    {module.lessons.map((lesson) => {
                      const lessonHref = `/student/courses/${courseId}/lessons/${lesson.id}`
                      const isActive = pathname === lessonHref
                      return (
                        <Link
                          key={lesson.id}
                          href={lessonHref}
                          className={cn(
                            "flex items-center gap-5 px-6 py-5 rounded-[1.5rem] text-[11px] font-black transition-all group relative overflow-hidden",
                            isActive 
                              ? "bg-black text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] dark:bg-white dark:text-black scale-[1.02] z-10" 
                              : "hover:bg-muted/60 text-muted-foreground/80 hover:text-foreground"
                          )}
                        >
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-yellow shadow-[0_0_15px_rgba(255,215,0,1)]" />}
                          
                          <div className={cn(
                             "transition-all duration-300",
                             isActive ? "scale-110" : "group-hover:scale-110"
                          )}>
                             {getIcon(lesson.type, isActive, lesson.completed)}
                          </div>

                          <span className="flex-1 truncate uppercase tracking-tighter leading-none">{lesson.title}</span>
                          
                          {isActive && (
                             <div className="flex items-center gap-2">
                                <div className="size-2 bg-brand-yellow rounded-full shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                             </div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 border-t bg-muted/10">
               <Button className="w-full h-16 bg-brand-yellow text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all italic">
                  Complete Mission
               </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function LessonPlayerLayout({ children }: LessonPlayerLayoutProps) {
  return (
    <CourseProvider>
      <LessonPlayerContent>{children}</LessonPlayerContent>
    </CourseProvider>
  )
}
