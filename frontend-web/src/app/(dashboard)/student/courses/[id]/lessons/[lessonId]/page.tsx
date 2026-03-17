"use client"

import { VideoPlayer } from "@/components/course/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Download,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  MessageSquare,
  Send,
  Clock,
  PlayCircle
} from "lucide-react"
import { useState } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

export default function StudentLessonPage() {
  const params = useParams()
  const courseId = params.id as string
  const lessonId = params.lessonId as string

  const [isCompleted, setIsCompleted] = useState(false)
  const [comment, setComment] = useState('')
  const [discussions, setDiscussions] = useState([
    { id: 1, user: "Alex Chen", role: "Student", content: "Does this prop pattern work with React 19 forwardRef?", time: "2h ago" },
    { id: 2, user: "Sarah Johnson", role: "Instructor", content: "Yes Alex! In React 19, you don't even need forwardRef anymore for standard props.", time: "1h ago" },
  ])

  const handlePostComment = (e: React.FormEvent) => {
     e.preventDefault()
     if (!comment.trim()) return
     setDiscussions([
        { id: Date.now(), user: "Sameh Ali", role: "Student", content: comment, time: "Just now" },
        ...discussions
     ])
     setComment('')
  }

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans">
      {/* Video Player Section */}
      <VideoPlayer
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
        poster="https://peach.blender.org/wp-content/uploads/title_anotate.jpg"
        className="rounded-3xl border-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
      />

      {/* Lesson Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
         <div className="space-y-3">
            <div className="flex items-center gap-3">
               <span className="bg-brand-yellow text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Unit 04: Reactor Core</span>
               <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-none">• L3-PROPS</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Understanding React Props</h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em]">HEDS Academic Dispatch • Module 02</p>
         </div>
         <div className="flex gap-3">
            <Button variant="outline" className="h-14 border-2 font-black uppercase text-[11px] tracking-widest px-8 rounded-2xl hover:bg-muted/50 transition-all">
               <ChevronLeft className="mr-2 size-4" /> Previous
            </Button>
            <Button className="h-14 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[11px] tracking-widest px-8 rounded-2xl shadow-2xl hover:scale-105 active:scale-[0.98] transition-all">
               Next Lesson <ChevronRight className="ml-2 size-4" />
            </Button>
         </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-10">
            <Tabs defaultValue="overview" className="w-full">
               <TabsList className="bg-muted/20 p-1.5 w-full justify-start h-14 rounded-2xl border-2 border-transparent">
                  <TabsTrigger value="overview" className="px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-xl transition-all h-full">Overview</TabsTrigger>
                  <TabsTrigger value="resources" className="px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-xl transition-all h-full">Resources</TabsTrigger>
                  <TabsTrigger value="discussions" className="px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-xl transition-all h-full flex gap-2">Discussions <span className="opacity-40">{discussions.length}</span></TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="mt-10 animate-in fade-in slide-in-from-left-4 duration-500">
                  <Card className="border-2 border-black/5 dark:border-white/5 shadow-xl bg-card/30 backdrop-blur-md rounded-3xl overflow-hidden">
                     <CardContent className="p-10 prose dark:prose-invert max-w-none">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="size-2 bg-brand-yellow rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                           <h3 className="text-xs font-black uppercase tracking-widest m-0 leading-none">Intelligence Briefing</h3>
                        </div>
                        <p className="text-muted-foreground font-medium leading-relaxed text-sm mb-10">
                           In this mission, we go deep into how components communicate with each other using Props.
                           Understanding this data flow is crucial for building scalable React applications.
                           We will cover prop-types, default props, and the power of the children prop.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-8 rounded-2xl border-2 border-transparent">
                           {[
                              "Passing data from Parent to Child",
                              "Handling functional props (callbacks)",
                              "The 'children' prop pattern",
                              "Modern Destructuring in Props"
                           ].map((item, i) => (
                              <div key={i} className="flex items-center gap-4 text-xs group">
                                 <CheckCircle className="size-4 text-brand-dark-yellow group-hover:scale-125 transition-transform" />
                                 <span className="font-black uppercase tracking-tight text-muted-foreground/80">{item}</span>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="resources" className="mt-10 space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                  {[
                     { name: "React Components Deep Dive PDF", type: "PDF", size: "2.4 MB" },
                     { name: "Demo Project Source Code", type: "ZIP", size: "15.0 MB" },
                  ].map((res, i) => (
                     <div key={i} className="flex items-center justify-between p-6 rounded-3xl border-2 border-black/5 dark:border-white/5 hover:border-brand-yellow/30 bg-card/30 backdrop-blur-sm transition-all group cursor-pointer hover:shadow-2xl hover:shadow-brand-yellow/5">
                        <div className="flex items-center gap-6">
                           <div className="size-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xl group-hover:bg-brand-yellow group-hover:text-black transition-all">
                              <FileText className="size-6" />
                           </div>
                           <div>
                              <p className="font-black text-xs uppercase tracking-widest group-hover:text-brand-dark-yellow transition-colors">{res.name}</p>
                              <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest mt-1">{res.type} • {res.size}</p>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" className="size-12 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                           <Download className="size-5" />
                        </Button>
                     </div>
                  ))}
               </TabsContent>

               <TabsContent value="discussions" className="mt-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <form onSubmit={handlePostComment} className="flex flex-col gap-4 bg-muted/20 p-8 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10">
                     <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="size-4 text-brand-dark-yellow" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Post Transmission</span>
                     </div>
                     <div className="flex gap-4">
                        <Input
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           placeholder="Enter technical query or observation..."
                           className="h-14 bg-background border-2 border-transparent focus:border-brand-yellow/30 rounded-2xl px-6 font-bold text-sm shadow-xl"
                        />
                        <Button type="submit" className="size-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-brand-yellow hover:text-black transition-all shadow-2xl active:scale-90">
                           <Send className="size-5" />
                        </Button>
                     </div>
                  </form>

                  <div className="space-y-6">
                     {discussions.map((disc) => (
                        <div key={disc.id} className="flex gap-6 p-8 rounded-3xl border-2 border-black/5 dark:border-white/5 bg-card/20 group hover:border-brand-yellow/10 transition-all">
                           <div className="size-12 rounded-2xl bg-muted border-2 border-transparent group-hover:border-brand-yellow/20 flex items-center justify-center text-[10px] font-black shadow-lg transition-all">
                              {disc.user.split(' ').map(n => n[0]).join('')}
                           </div>
                           <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-brand-dark-yellow transition-colors">{disc.user}</span>
                                    <span className={cn(
                                       "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm",
                                       disc.role === "Instructor" ? "bg-brand-yellow text-black" : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                                    )}>{disc.role}</span>
                                 </div>
                                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{disc.time}</span>
                              </div>
                              <p className="text-[13px] font-medium leading-relaxed text-foreground/80">{disc.content}</p>
                              <div className="pt-2">
                                 <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-brand-dark-yellow/60 hover:text-brand-dark-yellow">Signal Reply</Button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </TabsContent>
            </Tabs>
         </div>

         <div className="space-y-8">
            <Card className="border-2 border-black/5 dark:border-white/5 shadow-2xl bg-black text-white rounded-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <PlayCircle className="size-48" />
                </div>
                <CardHeader className="p-8 border-b border-white/5">
                   <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow leading-none">Mission Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6 relative z-10">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <Clock className="size-4 text-white/40" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/60 text-right">Duration</span>
                      </div>
                      <span className="text-xs font-black italic">15:42</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="size-2 bg-brand-yellow rounded-full shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Dispatch Protocol</span>
                      </div>
                      <span className="bg-white/10 text-brand-yellow border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">VIDEO DATA</span>
                   </div>
                   <div className="pt-6 border-t border-white/5">
                      <Button
                         onClick={() => setIsCompleted(!isCompleted)}
                         className={cn(
                           "w-full h-14 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl transition-all active:scale-95",
                           isCompleted
                             ? "bg-green-500 text-white hover:bg-green-600"
                             : "bg-white text-black hover:bg-brand-yellow"
                         )}
                      >
                         {isCompleted ? (
                            <span className="flex items-center gap-2 italic"><CheckCircle className="size-4" /> Finalized</span>
                         ) : (
                            "Verify Completion"
                         )}
                      </Button>
                   </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden relative group p-8">
               <h3 className="font-heading font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-6">Instructor Transmission</h3>
               <div className="space-y-6 relative z-10">
                  <p className="text-sm font-bold leading-relaxed italic text-foreground/80">
                     &quot;Make sure to follow along with the source code provided in the resources tab.
                     Try to build the simple counter again by yourself after watching this video.&quot;
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                     <div className="size-11 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black shadow-lg">SJ</div>
                     <div>
                        <p className="text-[11px] font-black uppercase tracking-widest">Sarah Johnson</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">HEDS Senior Reactor</p>
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  )
}
