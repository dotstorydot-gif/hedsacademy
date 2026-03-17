"use client"

import { VideoPlayer } from "@/components/course/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  FileQuestion,
  Trophy,
  Upload,
  Zap,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCourse } from "../CourseContext"

export default function StudentLessonPage() {
  const params = useParams()
  const lessonId = params.lessonId as string

  const { curriculum, completeLesson, instructor } = useCourse()

  // Get lesson data from real curriculum context
  const lessonData = useMemo(
    () => curriculum.flatMap(m => m.lessons).find(l => l.id === lessonId),
    [curriculum, lessonId]
  )

  // Derive lesson type from real data, fall back to ID prefix heuristic
  const lessonType = useMemo(() => {
    if (lessonData?.type) return lessonData.type
    if (lessonId.startsWith("q")) return "quiz"
    if (lessonId.startsWith("a")) return "assignment"
    if (lessonId.startsWith("e")) return "exam"
    if (lessonId.startsWith("m")) return "meeting"
    if (lessonId.startsWith("p")) return "in_person"
    return "video"
  }, [lessonId, lessonData])

  const lessonLocation = useMemo(() => {
    const l = lessonData as { location_name?: string; location_address?: string } | undefined
    if (!l?.location_name && !l?.location_address) return null
    return { name: l.location_name ?? "", address: l.location_address ?? "" }
  }, [lessonData])

  const lessonMeetUrl: string | null =
    (lessonData as { meeting_url?: string } | undefined)?.meeting_url ?? null

  const isLessonCompletedInSidebar = useMemo(
    () => curriculum.flatMap(m => m.lessons).find(l => l.id === lessonId)?.completed ?? false,
    [curriculum, lessonId]
  )

  const [isCompleted, setIsCompleted] = useState(false)
  const [comment, setComment] = useState("")
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})

  const [discussions, setDiscussions] = useState([
    { id: 1, user: "Alex Chen", role: "Student", content: "Does this prop pattern work with React 19 forwardRef?", time: "2h ago" },
    { id: 2, user: "Sarah Johnson", role: "Instructor", content: "Yes Alex! In React 19, you don't even need forwardRef anymore for standard props.", time: "1h ago" },
  ])

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setDiscussions([
      { id: Date.now(), user: "You", role: "Student", content: comment, time: "Just now" },
      ...discussions,
    ])
    setComment("")
  }

  const renderContent = () => {
    switch (lessonType) {
      case "quiz":
        return (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="bg-brand-yellow/5 border-2 border-brand-yellow/20 rounded-3xl p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                <FileQuestion className="size-40" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-3">Technical Proficiency Audit</h2>
              <p className="text-muted-foreground text-xs font-black uppercase tracking-widest max-w-md mx-auto">Validate your knowledge via HEDS assessment protocols.</p>
            </div>
            <div className="space-y-5">
              {[
                { q: "What is the primary purpose of 'props' in React?", options: ["Local state storage", "Data transfer between components", "Direct DOM manipulation", "Styles management"] },
                { q: "Can a child component modify props received from a parent?", options: ["Yes, directly", "No, props are read-only", "Only if it's a functional component", "Only via CSS variables"] }
              ].map((item, i) => (
                <Card key={i} className="border-2 border-black/5 dark:border-white/5 rounded-3xl">
                  <CardContent className="p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark-yellow mb-4">Question 0{i + 1}</p>
                    <p className="text-lg font-black tracking-tight mb-6 italic uppercase">{item.q}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [i]: optIdx })}
                          className={cn(
                            "h-14 px-5 rounded-2xl border-2 text-[11px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between",
                            selectedAnswers[i] === optIdx
                              ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xl"
                              : "hover:border-brand-yellow/40 hover:bg-muted/20"
                          )}
                        >
                          {opt}
                          {selectedAnswers[i] === optIdx && <Zap className="size-4 text-brand-yellow animate-pulse" />}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              disabled={Object.keys(selectedAnswers).length < 2 || quizSubmitted}
              onClick={() => setQuizSubmitted(true)}
              className="w-full h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-sm tracking-widest italic shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
            >
              {quizSubmitted ? "✓ Assessment Submitted" : "Submit Assessment"}
            </Button>
          </div>
        )

      case "assignment":
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <Card className="border-2 border-black/5 dark:border-white/5 rounded-3xl">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-brand-yellow text-black size-12 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Mission Objective: Counter App</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Development Assignment</p>
                  </div>
                </div>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-8">
                  Implement a fully reactive Counter Component using React State and Props. Ensure your code follows HEDS atomic design principles. Submit your repository link or a zipped build below.
                </p>
                <div className="bg-muted/10 rounded-2xl p-8 border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-muted/20 transition-all group">
                  <Upload className="size-8 text-muted-foreground/40 group-hover:text-brand-yellow transition-colors" />
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest italic">Drop Deployment Archive</p>
                    <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">MAX 50MB • ZIP, PDF, JS, TS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center gap-3 p-5 rounded-2xl bg-muted/20 border border-black/5 dark:border-white/5">
              <Clock className="size-5 text-muted-foreground/40 shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Submission Deadline</p>
                <p className="text-sm font-black italic">MAR 24, 2026</p>
              </div>
              <span className="ml-auto bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-red-500/20">Urgent</span>
              <Button className="ml-2 h-9 px-5 bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:bg-brand-yellow hover:text-black transition-all">Submit</Button>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-muted/10 border border-black/5 dark:border-white/5 text-center">
              {[["Architecture", "40%"], ["Responsiveness", "30%"], ["Logic", "30%"]].map(([k, v], i) => (
                <div key={i}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-center gap-1 mb-1"><ShieldCheck className="size-3" /> {k}</p>
                  <p className="text-lg font-black text-brand-dark-yellow italic">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "exam":
        return (
          <div className="h-[55vh] flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-90 duration-700">
            <div className="size-28 rounded-3xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-2xl ring-8 ring-brand-yellow/10">
              <Trophy className="size-14" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-tight">Master Certification Exam</h2>
              <p className="text-muted-foreground text-xs font-black uppercase tracking-widest max-w-lg mx-auto leading-loose">
                Proctored environment. Time Limit: 180 Minutes.
              </p>
            </div>
            <Button className="h-16 px-14 bg-brand-yellow text-black rounded-2xl font-black uppercase text-sm tracking-widest italic shadow-2xl hover:scale-105 active:scale-95 transition-all">
              Commence Final Audit
            </Button>
          </div>
        )

      case "in_person":
        return (
          <div className="space-y-5 animate-in zoom-in-95 duration-500">
            <Card className="border-2 border-orange-500/20 bg-orange-500/5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <MapPin className="size-40 text-orange-500" />
              </div>
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-5 relative z-10">
                  <div className="size-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xl shrink-0">
                    <MapPin className="size-7" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">In-Person Session — HEDS Academy</p>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">{lessonLocation?.name || "HEDS Academy Campus"}</h2>
                    <p className="text-sm font-bold text-muted-foreground">{lessonLocation?.address || "Location details provided by your instructor."}</p>
                    {lessonLocation?.address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lessonLocation.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg"
                      >
                        <ExternalLink className="size-3.5" /> View on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {[["Type", "In-Person"], ["Attendance", "Mandatory"], ["Location", "HEDS Campus"]].map(([l, v], i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-muted/20 border border-black/5 dark:border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{l}</p>
                  <p className="text-sm font-black uppercase tracking-tight">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "meeting":
        return (
          <div className="space-y-5 animate-in zoom-in-95 duration-500">
            <Card className="border-2 border-green-500/20 bg-green-500/5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Users className="size-40 text-green-500" />
              </div>
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-5 relative z-10">
                  <div className="size-14 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-xl shrink-0">
                    <Users className="size-7" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Live Online Session</p>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Join Your Live Class</h2>
                    <p className="text-sm font-bold text-muted-foreground">Click below to join the live session with your instructor.</p>
                    {lessonMeetUrl ? (
                      <a
                        href={lessonMeetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-6 py-3 rounded-xl bg-green-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg hover:scale-105"
                      >
                        <ExternalLink className="size-4" /> Join Session Now
                      </a>
                    ) : (
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-3 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl inline-block">
                        Link appears when session starts
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default: // video
        return (
          <div className="animate-in fade-in duration-500">
            <VideoPlayer
              src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
              poster="https://peach.blender.org/wp-content/uploads/title_anotate.jpg"
              className="rounded-3xl border-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-7 pb-20 animate-in fade-in duration-500 font-sans">

      {/* Dynamic Lesson Content */}
      {renderContent()}

      {/* Lesson Title + Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pt-1">
        <div className="space-y-2.5 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-brand-yellow text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md shrink-0">Unit 04: Reactor Core</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight">Understanding React Props</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">HEDS Academic Dispatch • Module 02</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button
            variant="outline"
            className="h-11 border-2 font-black uppercase text-[10px] tracking-widest px-5 rounded-xl hover:bg-muted/50 transition-all"
          >
            <ChevronLeft className="mr-2 size-4" /> Previous
          </Button>
          <Button className="h-11 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-5 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all hover:bg-brand-yellow hover:text-black">
            Next Lesson <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Stats Bar + Mark Complete */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/20 border border-black/5 dark:border-white/5 text-sm">
          <Clock className="size-4 text-muted-foreground/50 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Duration</span>
          <span className="font-black italic text-sm">{lessonType === "video" ? "15:42" : lessonType === "quiz" ? "20 min" : "—"}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/20 border border-black/5 dark:border-white/5">
          <div className="size-2 bg-brand-yellow rounded-full shadow-[0_0_8px_rgba(255,215,0,0.8)] shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Type</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark-yellow italic">{lessonType.replace("_", " ")}</span>
        </div>
        <div className="ml-auto">
          <Button
            onClick={() => {
              setIsCompleted(!isCompleted)
              if (!isCompleted) completeLesson(lessonId)
            }}
            className={cn(
              "h-11 px-7 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg transition-all active:scale-95 italic",
              isCompleted || isLessonCompletedInSidebar
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-brand-yellow hover:text-black"
            )}
          >
            {isCompleted || isLessonCompletedInSidebar
              ? <><CheckCircle className="size-4 mr-2 inline" /> Completed</>
              : "Mark Complete"
            }
          </Button>
        </div>
      </div>

      {/* Full-width Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/10 p-1.5 h-14 rounded-2xl border border-black/5 dark:border-white/5 w-full overflow-x-auto flex-nowrap justify-start gap-1">
          {[
            { value: "overview", label: "Overview" },
            { value: "resources", label: "Resources" },
            { value: "discussions", label: `Discussions (${discussions.length})` },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="shrink-0 px-6 sm:px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-xl transition-all h-full"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-5 animate-in fade-in duration-300">
          <Card className="border-2 border-black/5 dark:border-white/5 shadow-lg bg-card/20 rounded-3xl">
            <CardContent className="p-7 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-2.5 bg-brand-yellow rounded-full shadow-[0_0_10px_rgba(255,215,0,0.8)] shrink-0" />
                <h3 className="text-[11px] font-black uppercase tracking-widest leading-none italic">Intelligence Briefing</h3>
              </div>
              <p className="text-foreground/70 font-bold leading-loose text-sm mb-8 uppercase tracking-tight">
                In this mission, we go deep into how components communicate with each other using Props. Understanding this data flow is crucial for building scalable React applications. We will cover prop-types, default props, and the power of the children prop.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/10 p-7 rounded-2xl border border-black/5 dark:border-white/5">
                {["Passing data from Parent to Child", "Handling functional props (callbacks)", "The 'children' prop pattern", "Modern Destructuring in Props"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs group cursor-default">
                    <CheckCircle className="size-4 text-brand-dark-yellow shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructor Transmission — below overview card, not in a separate column */}
          {instructor && (
            <Card className="border-2 border-black/5 dark:border-white/5 bg-card/10 rounded-3xl">
              <CardContent className="p-7 md:p-9">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-5 italic">Instructor Transmission</p>
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="flex items-center gap-4 shrink-0">
                    <Avatar className="size-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xl skew-x-[-8deg] overflow-hidden">
                      <AvatarImage src={instructor.avatar_url} />
                      <AvatarFallback className="text-[11px] font-black">{instructor.full_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest italic leading-none">{instructor.full_name}</p>
                      <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1.5">{instructor.title}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black leading-loose italic text-foreground/70 uppercase border-l-2 border-brand-yellow/30 pl-5 flex-1">
                    &quot;{instructor.bio}&quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="mt-6 space-y-4 animate-in fade-in duration-300">
          {[
            { name: "Prop Transfer Protocol v2", type: "PDF", size: "2.4 MB" },
            { name: "Mission Assets Bundle", type: "ZIP", size: "15.0 MB" },
          ].map((res, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl border-2 border-black/5 dark:border-white/5 hover:border-brand-yellow/30 bg-card/20 transition-all group cursor-pointer hover:shadow-lg">
              <div className="flex items-center gap-5">
                <div className="size-12 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg group-hover:bg-brand-yellow group-hover:text-black transition-all">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wider group-hover:text-brand-dark-yellow transition-colors">{res.name}</p>
                  <p className="text-[9px] text-muted-foreground/60 uppercase font-black tracking-widest mt-1 italic">{res.type} • {res.size} • Decrypted</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="size-11 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <Download className="size-4" />
              </Button>
            </div>
          ))}
        </TabsContent>

        {/* Discussions */}
        <TabsContent value="discussions" className="mt-6 space-y-5 animate-in fade-in duration-300">
          <form onSubmit={handlePostComment} className="flex gap-3 bg-muted/5 p-5 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10">
            <MessageSquare className="size-5 text-brand-dark-yellow shrink-0 mt-3" />
            <Input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Signal the network..."
              className="h-11 bg-background border-2 border-transparent focus:border-brand-yellow/30 rounded-xl px-5 font-bold text-sm"
            />
            <Button type="submit" className="size-11 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-brand-yellow hover:text-black transition-all shadow-lg shrink-0">
              <Send className="size-4" />
            </Button>
          </form>
          <div className="space-y-4">
            {discussions.map(disc => (
              <div key={disc.id} className="flex gap-4 p-5 rounded-2xl border-2 border-black/5 dark:border-white/5 bg-card/10 group hover:border-brand-yellow/20 transition-all">
                <div className="size-10 rounded-xl bg-muted border-2 border-transparent group-hover:border-brand-yellow/40 flex items-center justify-center text-[10px] font-black shadow-sm transition-all shrink-0 italic">
                  {disc.user.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black uppercase tracking-tight italic">{disc.user}</span>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded italic",
                        disc.role === "Instructor" ? "bg-brand-yellow text-black" : "bg-black/5 dark:bg-white/5 text-muted-foreground"
                      )}>{disc.role}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">{disc.time}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground/80 leading-relaxed">{disc.content}</p>
                  <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-wider text-brand-dark-yellow/40 hover:text-brand-dark-yellow italic">Reply</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
