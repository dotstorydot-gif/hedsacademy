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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="size-5" />
            </Button>
            <Link href="/student/courses" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <ChevronLeft className="size-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Progress</p>
                <div className="w-48 h-1.5 bg-muted rounded-full mt-1">
                   <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
                </div>
             </div>
             <div className="size-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-bold text-primary">
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
            "w-80 border-l bg-card flex flex-col transition-all duration-300 fixed inset-y-0 right-0 z-40 md:relative",
            sidebarOpen ? "translate-x-0" : "translate-x-full md:w-0 md:opacity-0"
          )}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold">Course Curriculum</h2>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {curriculum.map((module, i) => (
                <div key={i} className="border-b last:border-0">
                  <div className="bg-muted/50 px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {module.title}
                  </div>
                  <div className="p-2 space-y-1">
                    {module.lessons.map((lesson) => {
                      const lessonHref = `/student/courses/${courseId}/lessons/${lesson.id}`
                      const isActive = pathname === lessonHref
                      return (
                        <Link
                          key={lesson.id}
                          href={lessonHref}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all group",
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-md" 
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className={cn("size-4 shrink-0", isActive ? "text-primary-foreground" : "text-green-500")} />
                          ) : (
                            <Circle className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                          )}
                          <span className="flex-1 font-medium truncate">{lesson.title}</span>
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
