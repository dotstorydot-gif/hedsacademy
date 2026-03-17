"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, ChevronLeft, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LessonPlayerLayoutProps {
  children: React.ReactNode
}

export default function LessonPlayerLayout({ children }: LessonPlayerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const params = useParams()
  const courseId = params.id as string

  // Mock curriculum data
  const curriculum = [
    {
      title: "Module 1: Getting Started",
      lessons: [
        { id: "l1", title: "Introduction", completed: true },
        { id: "l2", title: "Setting up the environment", completed: true },
      ]
    },
    {
      title: "Module 2: Core Concepts",
      lessons: [
        { id: "l3", title: "React Fundamentals", completed: false },
        { id: "l4", title: "Understanding Props", completed: false },
        { id: "l5", title: "Advanced State", completed: false },
      ]
    }
  ]

  // Calculate progress
  const allLessons = curriculum.flatMap(m => m.lessons)
  const completedCount = allLessons.filter(l => l.completed).length
  const progressPercent = Math.round((completedCount / allLessons.length) * 100)

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Top Header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-muted/50">
              <Menu className="size-5" />
            </Button>
            <Link href="/student/courses" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-brand-dark-yellow transition-colors">
              <ChevronLeft className="size-4" />
              Return Terminal
            </Link>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:block">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Academic Progress: {progressPercent}%</p>
                <div className="w-48 h-1 bg-black/5 dark:bg-white/5 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-brand-yellow rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,215,0,0.3)]" style={{ width: `${progressPercent}%` }} />
                </div>
             </div>
             <div className="size-9 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black shadow-lg border-2 border-transparent hover:border-brand-yellow transition-all cursor-pointer">
                S
             </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <main className={cn(
            "flex-1 overflow-y-auto p-6 lg:p-10 transition-all duration-300",
            sidebarOpen ? "mr-0" : ""
          )}>
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>

          {/* Curriculum Sidebar */}
          <aside className={cn(
            "w-80 border-l bg-card flex flex-col transition-all duration-300 fixed inset-y-0 right-0 z-40 md:relative overflow-hidden",
            sidebarOpen ? "translate-x-0" : "translate-x-full md:w-0 md:opacity-0"
          )}>
            <div className="p-6 border-b flex items-center justify-between bg-muted/20">
              <h2 className="font-heading font-black text-[10px] uppercase tracking-[0.3em]">Course Curriculum</h2>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {curriculum.map((module, i) => (
                <div key={i} className="">
                  <div className="bg-muted/50 px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {module.title}
                  </div>
                  <div className="p-3 space-y-1">
                    {module.lessons.map((lesson) => {
                      const lessonHref = `/student/courses/${courseId}/lessons/${lesson.id}`
                      const isActive = pathname === lessonHref
                      return (
                        <Link
                          key={lesson.id}
                          href={lessonHref}
                          className={cn(
                            "flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-bold transition-all group relative overflow-hidden",
                            isActive 
                              ? "bg-black text-white shadow-xl dark:bg-white dark:text-black" 
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-yellow" />}
                          {lesson.completed ? (
                            <CheckCircle2 className={cn("size-4 shrink-0 shadow-lg", isActive ? "text-brand-yellow" : "text-green-500")} />
                          ) : (
                            <Circle className={cn("size-4 shrink-0 text-muted-foreground/30 transition-colors", !isActive && "group-hover:text-brand-yellow")} />
                          )}
                          <span className="flex-1 truncate uppercase tracking-tight">{lesson.title}</span>
                          {isActive && <div className="size-1.5 bg-brand-yellow rounded-full animate-pulse" />}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
