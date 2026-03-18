"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from '@/components/layout/Sidebar'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { ChatManager } from '@/components/chat/ChatManager'

interface DashboardShellProps {
  children: React.ReactNode
  role: string
  email: string
}

export function DashboardShell({ children, role, email }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Enforce role-based dashboard access
  useEffect(() => {
    if (!pathname) return

    if (role === 'instructor' && pathname.startsWith('/student')) {
      router.push('/instructor')
    } else if (role === 'student' && pathname.startsWith('/instructor')) {
      router.push('/student')
    }
  }, [role, pathname, router])

  // Lesson player has its own full-screen layout — bypass dashboard chrome
  const isLessonPage = pathname?.includes('/lessons/')

  if (isLessonPage) {
    return (
      <>
        {children}
        <ChatManager />
      </>
    )
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black font-sans">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 shadow-2xl">
        <Sidebar role={role as 'student' | 'instructor' | 'academy_admin' | 'super_admin' | 'support'} />
      </div>
      <div className="md:pl-64 flex flex-col flex-1">
        <header className="h-16 border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
           <h1 className="font-heading font-black text-xs uppercase tracking-[0.3em] text-muted-foreground">System Overview</h1>
           <div className="flex items-center gap-6">
              <NotificationCenter />
              <div className="h-8 w-[1px] bg-black/5 dark:bg-white/5 mx-2" />
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-[11px] font-bold text-muted-foreground truncate max-w-[120px]">{email}</p>
                </div>
                <div className="size-10 rounded-xl bg-black dark:bg-white text-white dark:text-black border-2 border-transparent group-hover:border-brand-yellow transition-all flex items-center justify-center text-sm font-black shadow-lg">
                   {email?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
           </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <ChatManager />
    </div>
  )
}
