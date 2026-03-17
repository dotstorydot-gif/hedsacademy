"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  GraduationCap,
  MessageSquare,
  Calendar,
  CreditCard,
  LogOut
} from "lucide-react"

interface SidebarProps {
  role: 'super_admin' | 'academy_admin' | 'instructor' | 'student' | 'support'
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const routes = {
    student: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/student' },
      { label: 'My Courses', icon: BookOpen, href: '/student/courses' },
      { label: 'Subscription', icon: CreditCard, href: '/student/subscription' },
      { label: 'Schedule', icon: Calendar, href: '/student/schedule' },
      { label: 'Certificates', icon: GraduationCap, href: '/student/certificates' },
      { label: 'Settings', icon: Settings, href: '/student/settings' },
    ],
    instructor: [
      { label: 'Overview', icon: LayoutDashboard, href: '/instructor' },
      { label: 'My Courses', icon: BookOpen, href: '/instructor/my-courses' },
      { label: 'Students', icon: Users, href: '/instructor/students' },
      { label: 'Live Sessions', icon: Calendar, href: '/instructor/live-sessions' },
      { label: 'Earnings', icon: CreditCard, href: '/instructor/earnings' },
      { label: 'Messages', icon: MessageSquare, href: '/instructor/messages' },
      { label: 'My Profile', icon: Users, href: '/instructor/profile' },
    ],
    academy_admin: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/academy-admin' },
      { label: 'Instructors', icon: Users, href: '/academy-admin/instructors' },
      { label: 'Students', icon: Users, href: '/academy-admin/students' },
      { label: 'Courses', icon: BookOpen, href: '/academy-admin/courses' },
      { label: 'Analytics', icon: BarChart3, href: '/academy-admin/analytics' },
      { label: 'Settings', icon: Settings, href: '/academy-admin/settings' },
    ],
    super_admin: [
      { label: 'Global Stats', icon: LayoutDashboard, href: '/super-admin' },
      { label: 'Academies', icon: GraduationCap, href: '/super-admin/academies' },
      { label: 'Subscriptions', icon: CreditCard, href: '/super-admin/subscriptions' },
      { label: 'System Settings', icon: Settings, href: '/super-admin/settings' },
    ],
    support: [
      { label: 'Tickets', icon: MessageSquare, href: '/support/tickets' },
    ]
  }

  const currentRoutes = routes[role] || []

  return (
    <aside className="w-64 border-r bg-black text-white flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-white/10">
        <Logo variant="white" size="sm" />
        <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-3 font-black">
          {role.replace('_', ' ')} Command
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {currentRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
              pathname === route.href 
                ? "bg-white text-black shadow-lg" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <route.icon className={cn(
              "size-4 shrink-0 transition-transform group-hover:scale-110",
              pathname === route.href ? "text-black" : "text-white/40 group-hover:text-white"
            )} />
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors uppercase tracking-widest text-[10px]"
        >
          <LogOut className="size-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  )
}
