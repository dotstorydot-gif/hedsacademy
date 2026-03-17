"use client"

import { VideoPlayer } from "@/components/course/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Download,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  MessageSquare,
  Send,
  Clock,
  FileQuestion,
  Trophy,
  Upload,
  Zap,
  ShieldCheck
} from "lucide-react"
import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCourse } from "../CourseContext"

export default function StudentLessonPage() {
  const params = useParams()
  const lessonId = params.lessonId as string

  // Mock logic to determine lesson type based on ID
  const lessonType = useMemo(() => {
    if (lessonId.startsWith('q')) return 'quiz'
    if (lessonId.startsWith('a')) return 'assignment'
    if (lessonId.startsWith('e')) return 'exam'
    return 'video'
  }, [lessonId])

  const [isCompleted, setIsCompleted] = useState(false)
  const [comment, setComment] = useState('')
  const { curriculum, completeLesson } = useCourse()

  const isLessonCompletedInSidebar = useMemo(() => {
    return curriculum.flatMap(m => m.lessons).find(l => l.id === lessonId)?.completed || false
  }, [curriculum, lessonId])

  const [discussions, setDiscussions] = useState([
    { id: 1, user: "Alex Chen", role: "Student", content: "Does this prop pattern work with React 19 forwardRef?", time: "2h ago" },
    { id: 2, user: "Sarah Johnson", role: "Instructor", content: "Yes Alex! In React 19, you don't even need forwardRef anymore for standard props.", time: "1h ago" },
  ])

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const handlePostComment = (e: React.FormEvent) => {
     e.preventDefault()
     if (!comment.trim()) return
     setDiscussions([
        { id: Date.now(), user: "Sameh Ali", role: "Student", content: comment, time: "Just now" },
        ...discussions
     ])
     setComment('')
  }

  const renderContent = () => {
    switch (lessonType) {
      case 'quiz':
        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
             <div className="bg-brand-yellow/5 border-2 border-brand-yellow/20 rounded-[2.5rem] p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                   <FileQuestion className="size-48" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Technical Proficiency Audit</h2>
                <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] max-w-md mx-auto">Validate your mission knowledge via HEDS standard assessment protocols.</p>
             </div>

             <div className="space-y-6">
                {[
                  { q: "What is the primary purpose of 'props' in React?", options: ["Local state storage", "Data transfer between components", "Direct DOM manipulation", "Styles management"] },
                  { q: "Can a child component modify props received from a parent?", options: ["Yes, directly", "No, props are read-only", "Only if it's a functional component", "Only via CSS variables"] }
                ].map((item, i) => (
                  <Card key={i} className="border-2 border-black/5 dark:border-white/5 rounded-[2rem] p-8 bg-card/40 backdrop-blur-md">
                     <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark-yellow mb-4">Question 0{i+1}</p>
                     <p className="text-lg font-black tracking-tight mb-8 italic uppercase">{item.q}</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.options.map((opt, optIdx) => (
                          <button 
                            key={optIdx}
                            onClick={() => setSelectedAnswers({...selectedAnswers, [i]: optIdx})}
                            className={cn(
                              "h-16 px-6 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between group",
                              selectedAnswers[i] === optIdx 
                                ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-2xl scale-[1.02]" 
                                : "hover:border-brand-yellow/40 hover:bg-muted/30"
                            )}
                          >
                             {opt}
                             {selectedAnswers[i] === optIdx && <Zap className="size-4 text-brand-yellow animate-pulse" />}
                          </button>
                        ))}
                     </div>
                  </Card>
                ))}
             </div>

             <Button 
               disabled={Object.keys(selectedAnswers).length < 2 || quizSubmitted}
               onClick={() => setQuizSubmitted(true)}
               className="w-full h-20 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-sm tracking-[0.4em] italic shadow-2xl hover:scale-[1.01] active:scale-95 transition-all"
             >
                {quizSubmitted ? "Assessment Transmitted" : "Submit Assessment"}
             </Button>
          </div>
        )

      case 'assignment':
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                   <Card className="border-2 border-black/5 dark:border-white/5 rounded-[2.5rem] p-12 bg-card/30 backdrop-blur-md relative overflow-hidden">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="bg-brand-yellow text-black size-12 rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText className="size-6" />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Mission Objective: {lessonId === 'a1' ? "Counter App" : "Technical Report"}</h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Development Assignment</p>
                         </div>
                      </div>
                      <div className="prose dark:prose-invert max-w-none text-muted-foreground font-medium text-sm leading-relaxed mb-10">
                         Implement a fully reactive Counter Component using React State and Props. 
                         Ensure your code follows HEDS atomic design principles. 
                         Submit your repository link or a zipped build below.
                      </div>
                      <div className="bg-muted/20 rounded-2xl p-6 border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:bg-muted/30 transition-all">
                         <Upload className="size-10 text-muted-foreground/40 group-hover:text-brand-yellow transition-colors" />
                         <div>
                            <p className="text-[11px] font-black uppercase tracking-widest italic">Drop Deployment Archive</p>
                            <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">MAX 50MB • ZIP, PDF, JS, TS</p>
                         </div>
                      </div>
                   </Card>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] ml-4 text-muted-foreground">Internal Transmission Metadata</p>
                      <Textarea 
                        placeholder="Attach technical notes or repository links for your instructor..." 
                        className="min-h-40 rounded-[2rem] border-2 border-black/5 dark:border-white/5 bg-card/40 p-10 font-bold text-sm focus:border-brand-yellow/30 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-6">
                   <Card className="bg-black text-white rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden border-0 ring-1 ring-white/5">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Clock className="size-32" />
                      </div>
                      <p className="text-brand-yellow text-[9px] font-black uppercase tracking-[0.4em] mb-8">Deadline Protocol</p>
                      <div className="space-y-6 relative z-10">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase opacity-40">Target Date</span>
                            <span className="text-sm font-black italic">MAR 24, 2026</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase opacity-40">Status</span>
                            <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-red-500/20">URGENT</span>
                         </div>
                      </div>
                      <Button className="w-full h-14 bg-white text-black mt-10 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-brand-yellow transition-all shadow-2xl">
                         Post Submission
                      </Button>
                   </Card>

                   <Card className="border-2 border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 bg-card/40 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-6">
                         <ShieldCheck className="size-4 text-brand-dark-yellow" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Grading Matrix</span>
                      </div>
                      <ul className="space-y-4">
                         {["Architecture (40%)", "Responsiveness (30%)", "Logic (30%)"].map((item, i) => (
                           <li key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                              <span className="text-muted-foreground">{item.split(' (')[0]}</span>
                              <span className="text-brand-dark-yellow">{item.split(' (')[1].replace(')', '')}</span>
                           </li>
                         ))}
                      </ul>
                   </Card>
                </div>
             </div>
          </div>
        )

      case 'exam':
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in-90 duration-1000">
             <div className="size-32 rounded-[2.5rem] bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-2xl ring-[12px] ring-brand-yellow/10">
                <Trophy className="size-16" />
             </div>
             <div className="space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-tight">Master Certification Exam</h2>
                <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.5em] max-w-lg mx-auto leading-loose">
                   This is a proctored environment. 
                   Ensure your hardware is synced. 
                   Time Limit: 180 Minutes.
                </p>
             </div>
             <Button className="h-20 px-16 bg-brand-yellow text-black rounded-[2rem] font-black uppercase text-sm tracking-[0.5em] italic shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Commence Final Audit
             </Button>
          </div>
        )

      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-700">
            <VideoPlayer
              src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
              poster="https://peach.blender.org/wp-content/uploads/title_anotate.jpg"
              className="rounded-[2.5rem] border-0 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans">
      {/* Dynamic Content Area */}
      {renderContent()}

      {/* Lesson Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 px-4">
         <div className="space-y-4">
            <div className="flex items-center gap-4">
                <span className="bg-brand-yellow text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg">Unit 04: Reactor Core</span>
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] leading-none opacity-40">• {lessonId.toUpperCase()}</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Understanding React Props</h1>
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">HEDS Academic Dispatch • Module 02</p>
          </div>
          <div className="flex gap-4">
             <Button 
               disabled={lessonId === 'l1'}
              variant="outline" 
              className="h-16 border-2 font-black uppercase text-[11px] tracking-[0.2em] px-10 rounded-2xl hover:bg-muted/50 transition-all shadow-xl disabled:opacity-20"
            >
               <ChevronLeft className="mr-3 size-5" /> Previous
            </Button>
            <Button className="h-16 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[11px] tracking-[0.2em] px-10 rounded-2xl shadow-2xl hover:scale-105 active:scale-[0.98] transition-all hover:bg-brand-yellow hover:text-black dark:hover:bg-brand-yellow dark:hover:text-black">
               Next Lesson <ChevronRight className="ml-3 size-5" />
            </Button>
         </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-12">
            <Tabs defaultValue="overview" className="w-full">
               <TabsList className="bg-muted/10 p-2 w-full justify-start h-16 rounded-[1.5rem] border border-black/5 dark:border-white/5 backdrop-blur-md">
                  <TabsTrigger value="overview" className="px-12 font-black uppercase text-[10px] tracking-[0.2em] data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-[1rem] transition-all h-full">Overview</TabsTrigger>
                  <TabsTrigger value="resources" className="px-12 font-black uppercase text-[10px] tracking-[0.2em] data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-[1rem] transition-all h-full">Resources</TabsTrigger>
                  <TabsTrigger value="discussions" className="px-12 font-black uppercase text-[10px] tracking-[0.2em] data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-[1rem] transition-all h-full flex gap-3">Discussions <span className="opacity-30">{discussions.length}</span></TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="mt-12 animate-in fade-in slide-in-from-left-8 duration-600">
                  <Card className="border-2 border-black/5 dark:border-white/5 shadow-2xl bg-card/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                     <CardContent className="p-12 prose dark:prose-invert max-w-none">
                        <div className="flex items-center gap-4 mb-10">
                           <div className="size-2.5 bg-brand-yellow rounded-full shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
                           <h3 className="text-[11px] font-black uppercase tracking-[0.3em] m-0 leading-none italic">Intelligence Briefing</h3>
                        </div>
                        <p className="text-foreground/70 font-bold leading-[2] text-sm mb-12 uppercase tracking-tight">
                           In this mission, we go deep into how components communicate with each other using Props. Understanding this data flow is crucial for building scalable React applications. We will cover prop-types, default props, and the power of the children prop.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/10 p-10 rounded-3xl border border-black/5 dark:border-white/5">
                           {[
                               "Passing data from Parent to Child",
                               "Handling functional props (callbacks)",
                               "The 'children' prop pattern",
                               "Modern Destructuring in Props"
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-5 text-xs group cursor-default">
                                 <CheckCircle className="size-5 text-brand-dark-yellow group-hover:scale-125 transition-transform shadow-sm" />
                                 <span className="font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground transition-colors">{item}</span>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="resources" className="mt-12 space-y-6 animate-in fade-in slide-in-from-left-8 duration-600">
                  {[
                     { name: "Prop Transfer Protocol v2", type: "PDF", size: "2.4 MB" },
                     { name: "Mission Assets Bundle", type: "ZIP", size: "15.0 MB" },
                  ].map((res, i) => (
                     <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] border-2 border-black/5 dark:border-white/5 hover:border-brand-yellow/30 bg-card/20 backdrop-blur-md transition-all group cursor-pointer hover:shadow-2xl">
                        <div className="flex items-center gap-8">
                           <div className="size-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xl group-hover:bg-brand-yellow group-hover:text-black transition-all">
                              <FileText className="size-7" />
                           </div>
                           <div>
                              <p className="font-black text-xs uppercase tracking-[0.2em] group-hover:text-brand-dark-yellow transition-colors">{res.name}</p>
                              <p className="text-[9px] text-muted-foreground/60 uppercase font-black tracking-[0.3em] mt-2 italic">{res.type} • {res.size} • DECRYPTED</p>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" className="size-14 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                           <Download className="size-6" />
                        </Button>
                     </div>
                  ))}
               </TabsContent>

               <TabsContent value="discussions" className="mt-12 space-y-10 animate-in fade-in slide-in-from-left-8 duration-600">
                  <form onSubmit={handlePostComment} className="flex flex-col gap-6 bg-muted/5 p-10 rounded-[2.5rem] border-2 border-dashed border-black/10 dark:border-white/10">
                     <div className="flex items-center gap-4">
                        <MessageSquare className="size-5 text-brand-dark-yellow" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Open Frequency Transmission</span>
                     </div>
                     <div className="flex gap-6">
                        <Input
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           placeholder="Signal the network..."
                           className="h-16 bg-background border-2 border-transparent focus:border-brand-yellow/30 rounded-2xl px-8 font-black text-sm shadow-2xl"
                        />
                        <Button type="submit" className="size-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-brand-yellow hover:text-black transition-all shadow-2xl active:scale-90">
                           <Send className="size-6" />
                        </Button>
                     </div>
                  </form>

                  <div className="space-y-8">
                     {discussions.map((disc) => (
                        <div key={disc.id} className="flex gap-8 p-10 rounded-[2.5rem] border-2 border-black/5 dark:border-white/5 bg-card/10 group hover:border-brand-yellow/20 transition-all shadow-sm">
                           <div className="size-14 rounded-[1.25rem] bg-muted border-2 border-transparent group-hover:border-brand-yellow/40 flex items-center justify-center text-[10px] font-black shadow-lg transition-all scale-95 group-hover:scale-100 italic">
                              {disc.user.split(' ').map(n => n[0]).join('')}
                           </div>
                           <div className="flex-1 space-y-4">
                              <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-4">
                                    <span className="text-[12px] font-black uppercase tracking-[0.1em] group-hover:text-brand-dark-yellow transition-colors italic">{disc.user}</span>
                                    <span className={cn(
                                       "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded shadow-sm italic",
                                       disc.role === "Instructor" ? "bg-brand-yellow text-black" : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                                    )}>{disc.role}</span>
                                 </div>
                                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">{disc.time}</span>
                              </div>
                              <p className="text-[14px] font-bold leading-relaxed text-foreground/80 lowercase italic">{disc.content.toUpperCase()}</p>
                              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                                 <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark-yellow/40 hover:text-brand-dark-yellow transition-colors italic">Initiate Response Loop</Button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </TabsContent>
            </Tabs>
         </div>

         <div className="space-y-10">
            <Card className="border-0 bg-black text-white rounded-[3rem] shadow-2xl overflow-hidden relative group p-1 ring-1 ring-white/5">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                   <Zap className="size-64" />
                </div>
                <CardHeader className="p-10 border-b border-white/5">
                   <CardTitle className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-yellow leading-none italic">Mission Brief</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-8 relative z-10">
                   <div className="flex justify-between items-center group/stat">
                      <div className="flex items-center gap-4">
                         <Clock className="size-5 text-white/30 group-hover/stat:text-brand-yellow transition-colors" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Operation Window</span>
                      </div>
                      <span className="text-sm font-black italic">{lessonType === 'video' ? "15:42" : lessonType === 'quiz' ? "20m" : "∞"}</span>
                   </div>
                   <div className="flex justify-between items-center group/stat">
                      <div className="flex items-center gap-4">
                         <div className="size-2.5 bg-brand-yellow rounded-full shadow-[0_0_12px_rgba(255,215,0,0.8)]" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Signal Type</span>
                      </div>
                      <span className="bg-white/5 text-brand-yellow border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic">{lessonType.toUpperCase()} DATA</span>
                   </div>
                   <div className="pt-10 border-t border-white/5">
                      <Button
                         onClick={() => {
                            setIsCompleted(!isCompleted)
                            if (!isCompleted) {
                               completeLesson(lessonId)
                            }
                         }}
                         className={cn(
                           "w-full h-16 font-black uppercase text-[11px] tracking-[0.4em] rounded-[1.5rem] shadow-2xl transition-all active:scale-95 italic",
                           isCompleted || isLessonCompletedInSidebar
                             ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20"
                             : "bg-white text-black hover:bg-brand-yellow"
                         )}
                      >
                         {isCompleted || isLessonCompletedInSidebar ? (
                            <span className="flex items-center gap-3"><CheckCircle className="size-5" /> SYNCHRONIZED</span>
                         ) : (
                            "Verify Deployment"
                         )}
                      </Button>
                   </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-black/5 dark:border-white/5 bg-card/10 backdrop-blur-xl rounded-[3rem] overflow-hidden relative group p-10 shadow-sm transition-all hover:bg-card/20">
               <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 mb-8 italic">Instructor Transmission</h3>
               <div className="space-y-8 relative z-10">
                  <p className="text-sm font-black leading-loose italic text-foreground/70 uppercase">
                     &quot;Make sure to follow along with the source code provided in the resources tab. Try to build the simple counter again by yourself after watching this video.
                  </p>
                  <div className="flex items-center gap-5 pt-8 border-t border-black/5 dark:border-white/5">
                     <div className="size-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[11px] font-black shadow-2xl skew-x-[-12deg]">SJ</div>
                     <div>
                        <p className="text-[12px] font-black uppercase tracking-widest italic leading-none">Sarah Johnson</p>
                        <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mt-2">HEDS Senior Reactor</p>
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  )
}
