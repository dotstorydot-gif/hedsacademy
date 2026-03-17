'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, Check, Info, AlertTriangle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuHeader,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Notification {
  id: string
  title: string
  content: string
  type: 'system' | 'course' | 'chat' | 'billing'
  read: boolean
  created_at: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  const fetchNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      setNotifications(data as Notification[])
      setUnreadCount(data.filter(n => !n.read).length)
    }
  }, [supabase])

  useEffect(() => {
    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchNotifications()
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
      .update({ read: true })
      .eq('id', id)

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <Info className="size-4 text-blue-500" />
      case 'billing': return <AlertTriangle className="size-4 text-brand-yellow" />
      case 'chat': return <Bell className="size-4 text-green-500" />
      default: return <Bell className="size-4 text-white/40" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
          <Bell className="size-5 text-white/60" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-brand-yellow text-black font-black text-[10px] border-2 border-black animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] bg-black/90 border-white/10 backdrop-blur-2xl p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DropdownMenuHeader className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Security Notifications</span>
          {unreadCount > 0 && (
            <Button variant="link" onClick={markAllAsRead} className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-brand-yellow hover:text-white transition-colors">
              Dismiss All
            </Button>
          )}
        </DropdownMenuHeader>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Frequency Quiet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={`flex flex-col items-start gap-1 p-4 cursor-default focus:bg-white/5 transition-colors ${!n.read ? 'bg-white/[0.02]' : ''}`}
                  onSelect={(e) => {
                    e.preventDefault()
                    if (!n.read) markAsRead(n.id)
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black uppercase tracking-widest truncate ${!n.read ? 'text-white' : 'text-white/40'}`}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-white/40 font-medium leading-relaxed mt-0.5 line-clamp-2">
                        {n.content}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="size-2 rounded-full bg-brand-yellow shrink-0 shadow-[0_0_8px_#ffd700]" />
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full mt-2 pl-11">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!n.read && (
                      <Button variant="link" className="h-auto p-0 text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white" onClick={() => markAsRead(n.id)}>
                        <Check className="size-2.5 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
