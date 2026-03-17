"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Info, ListTree, Settings, Eye, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CourseEditorLayoutProps {
  children: React.ReactNode
  params: { id: string }
}

export default function CourseEditorLayout({ children, params }: CourseEditorLayoutProps) {
  const pathname = usePathname()
  const courseId = params.id

  const tabs = [
    { label: "Basic Info", icon: Info, href: `/instructor/courses/${courseId}/info` },
    { label: "Curriculum", icon: ListTree, href: `/instructor/courses/${courseId}/curriculum` },
    { label: "Settings", icon: Settings, href: `/instructor/courses/${courseId}/settings` },
  ]

  return (
    <div className="flex flex-col h-full -m-6 lg:-m-10">
      <header className="border-b bg-card px-6 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/instructor/courses">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-bold">Course Editor</h2>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">Introduction to React Hooks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 size-4" /> Preview
          </Button>
          <Button size="sm">Publish Changes</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-muted/10 p-4 space-y-2 hidden md:block">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname.includes(tab.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </Link>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
