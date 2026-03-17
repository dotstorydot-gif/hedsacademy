"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Circle, 
  Maximize2, 
  Minimize2,
  Paperclip
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export function ChatManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeRoom, setActiveRoom] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const fetchMessages = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
  }, [supabase])

  useEffect(() => {
    if (activeRoom) {
      fetchMessages(activeRoom)

      const channel = supabase
        .channel(`room_${activeRoom}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${activeRoom}`,
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [activeRoom, supabase, fetchMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight)
    }
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeRoom) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: activeRoom,
        sender_id: user.id,
        content: newMessage.trim()
      })

    if (!error) setNewMessage('')
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 size-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-2xl border-4 border-brand-yellow/20 hover:scale-110 transition-all z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="size-6" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand-yellow rounded-full animate-pulse border-2 border-background" />
      </Button>
    )
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 shadow-2xl border-4 border-black/5 dark:border-white/5 bg-background/95 backdrop-blur-2xl z-50 flex flex-col transition-all duration-300",
      isMaximized ? "w-[450px] h-[600px]" : "w-80 h-[450px]"
    )}>
      <CardHeader className="p-4 border-b bg-black text-white flex flex-row items-center justify-between space-y-0 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <MessageSquare className="size-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-black" />
          </div>
          <div>
            <h3 className="font-heading font-black text-[10px] uppercase tracking-widest">HEDS Terminal</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
               <Circle className="size-1.5 fill-green-500 text-green-500" />
               <p className="text-[9px] font-bold text-white/60 tracking-wider">SECURE CONNECTION</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8 text-white/60 hover:text-white" onClick={() => setIsMaximized(!isMaximized)}>
            {isMaximized ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-white/60 hover:text-white" onClick={() => setIsOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col min-h-0 bg-muted/5">
        {!activeRoom ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="size-16 rounded-3xl bg-brand-yellow/10 flex items-center justify-center border-2 border-brand-yellow/20">
                 <User className="size-8 text-brand-dark-yellow" />
              </div>
              <div>
                <h4 className="font-heading font-black text-[11px] uppercase tracking-widest mb-1">Select Channel</h4>
                <p className="text-[10px] text-muted-foreground font-medium px-4">Initialize a connection with an instructor or admin.</p>
              </div>
              <Button 
                variant="outline" 
                className="text-[10px] font-black uppercase tracking-widest border-2"
                onClick={() => setActiveRoom('mock-room-id')} // Mock for now
              >
                 New Dispatch
              </Button>
           </div>
        ) : (
          <ScrollArea className="flex-1 p-4">
            <div ref={scrollRef} className="space-y-4">
              {messages.map((m) => {
                const isMe = m.sender_id === 'my-id' // Replace with actual user ID check
                return (
                  <div key={m.id} className={cn(
                    "flex flex-col",
                    isMe ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl max-w-[85%] text-xs font-medium shadow-sm leading-relaxed",
                      isMe 
                        ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none border-2 border-black/5"
                    )}>
                      {m.content}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-1.5 mx-1 opacity-50">
                      {format(new Date(m.created_at), 'HH:mm')} • {isMe ? 'DELIVERED' : 'RECEIVED'}
                    </span>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="p-4 border-t bg-muted/20">
        <form onSubmit={sendMessage} className="flex w-full gap-2 relative">
          <Button type="button" variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 shrink-0">
             <Paperclip className="size-5 text-muted-foreground" />
          </Button>
          <Input 
            placeholder="Type your transmission..."
            className="h-10 border-2 focus-visible:ring-brand-yellow focus-visible:border-brand-yellow transition-all rounded-xl text-xs pr-12 font-medium"
            value={newMessage}
            disabled={!activeRoom}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button 
            size="icon" 
            className="size-8 rounded-lg bg-black text-white dark:bg-white dark:text-black absolute right-1 top-1"
            disabled={!newMessage.trim() || !activeRoom}
          >
            <Send className="size-3" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
