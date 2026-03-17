"use client"

import { JitsiEmbed } from "@/components/live/JitsiEmbed"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Info, MessageSquare, Users, VideoOff } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import React from "react"

export default function LiveRoomPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const sessionId = params.sessionId as string

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={`/student/courses/${courseId}/lessons`}>
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold">Live Session: Advanced React Patterns</h2>
            <p className="text-xs text-muted-foreground">Instructor: Sarah Johnson</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="success" className="animate-pulse">LIVE</Badge>
           <Button variant="destructive" size="sm" onClick={() => router.back()}>
             <VideoOff className="mr-2 size-4" /> Leave Room
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 h-full">
          <JitsiEmbed 
            roomName={`heds-academy-${sessionId}`} 
            userName="Student User" 
            onLeave={() => router.back()}
          />
        </div>

        <div className="flex flex-col gap-4 h-full">
          <Card className="flex-1 border-2 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Participants (14)
              </h3>
            </div>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                { name: "Sarah Johnson", role: "Instructor", isMe: false },
                { name: "Student User", role: "Student", isMe: true },
                { name: "Alex Rivera", role: "Student", isMe: false },
                { name: "Samantha Lee", role: "Student", isMe: false },
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className="size-8 rounded-full bg-muted border flex items-center justify-center text-[10px] font-bold">
                     {user.name.charAt(0)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {user.name} {user.isMe && "(You)"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{user.role}</p>
                   </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm bg-primary/5">
             <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                   <Info className="size-4" />
                   <p className="text-[10px] font-bold uppercase tracking-widest">Meeting Note</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   &quot;Please stay muted while the instructor is speaking. Use the chat for questions.&quot;
                </p>
                <Button variant="ghost" className="w-full text-xs h-8 font-bold justify-start px-2">
                   <MessageSquare className="mr-2 size-3" /> System Chat
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className, variant = "secondary" }: any) {
   const variants: any = {
      success: "bg-green-500 text-white",
      secondary: "bg-muted text-muted-foreground"
   }
   return (
      <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest", variants[variant], className)}>
         {children}
      </span>
   )
}
