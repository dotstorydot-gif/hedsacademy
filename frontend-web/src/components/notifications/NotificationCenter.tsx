"use client"

import { useState, useEffect, useCallback } from 'react'
import { Bell, UserPlus, ShoppingCart, Info } from 'lucide-react'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  title: string
  content: string
  type: string
  read_at: string | null
  created_at: string
  link?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  const fetchNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read_at).length)
    }
  }, [supabase])

  useEffect(() => {
    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchNotifications])

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <UserPlus className="size-4 text-blue-500" />
      case 'payment': return <ShoppingCart className="size-4 text-green-500" />
      case 'chat': return <Bell className="size-4 text-purple-500" />
      case 'system': return <Info className="size-4 text-brand-yellow" />
      default: return <Bell className="size-4" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full border-2 border-black/5 dark:border-white/10 hover:bg-brand-yellow/10 transition-colors">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-brand-yellow text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden border-2 shadow-2xl bg-background/95 backdrop-blur-xl" align="end">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-heading font-black text-xs uppercase tracking-widest">Notifications</h3>
          {unreadCount > 0 && (
             <Badge variant="outline" className="text-[10px] font-bold border-brand-yellow/50 text-brand-dark-yellow">
                {unreadCount} New
             </Badge>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 hover:bg-muted/30 transition-colors cursor-pointer relative group",
                    !n.read_at && "bg-brand-yellow/5"
                  )}
                  onClick={() => !n.read_at && markAsRead(n.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 size-8 rounded-full bg-background border shadow-sm flex items-center justify-center">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-xs font-bold leading-none", !n.read_at ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {n.content}
                      </p>
                      <p className="text-[9px] text-muted-foreground/60 font-medium">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  {!n.read_at && (
                    <div className="absolute top-4 right-4 h-2 w-2 bg-brand-yellow rounded-full shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 rounded-full bg-muted/20 opacity-20">
                <Bell className="size-10" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                All caught up!<br />Check back later.
              </p>
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t bg-muted/10">
          <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest h-8 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
            See All Alerts
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
