"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { Shield, Zap, Globe, Cpu, Search, Star, Clock, Users, ChevronRight, BookOpen, Filter, Loader2 } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

interface Course {
  id: string
  title: string
  category: string | null
  level: string | null
  price: number | null
  thumbnail_url: string | null
  benefits: string[] | null
  duration_hours: number | null
  sessions_count: number | null
}

const CATEGORIES = ["All", "Development", "Design", "Engineering", "Business", "Marketing"]
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"]

export default function Home() {
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeLevel, setActiveLevel] = useState("All Levels")
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all")

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, title, category, level, price, thumbnail_url, benefits, duration_hours, sessions_count")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCourses(data ?? [])
        setCoursesLoading(false)
      })
  }, [supabase])

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || (c.category ?? "").toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === "All" || c.category === activeCategory
      const matchesLevel = activeLevel === "All Levels" || c.level === activeLevel
      const price = c.price ?? 0
      const matchesPrice = priceFilter === "all" || (priceFilter === "free" && price === 0) || (priceFilter === "paid" && price > 0)
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice
    })
  }, [courses, search, activeCategory, activeLevel, priceFilter])

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-brand-yellow selection:text-black font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 h-20 flex items-center justify-between">
        <Logo variant="white" size="md" />
        <div className="flex items-center gap-6">
          <a href="#courses" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Courses</a>
          <Link href="/pricing" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-brand-yellow transition-colors">Pricing</Link>
          <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 border-2 border-white/10 hover:border-brand-yellow transition-all rounded-xl">
            Terminal Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-36 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,rgba(5,5,5,0)_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="size-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_10px_#ffd700]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">System v2.0 — Active Deployment</span>
          </div>

          <h1 className="font-heading font-black text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            ENGINEERING <br />
            <span className="text-brand-yellow">ACADEMIC</span> <br />
            EXCELLENCE.
          </h1>

          <p className="max-w-xl text-white/40 text-sm font-medium leading-relaxed mb-12 uppercase tracking-widest">
            The elite learning platform for high-performance academies.<br />
            Industrial grade security. Premium execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              className="h-16 px-14 bg-brand-yellow text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white transition-all shadow-[0_20px_60px_rgba(255,215,0,0.25)] hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="/auth/login">⚡ Access Terminal</Link>
            </Button>
            <a href="#courses" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
              Browse Courses <ChevronRight className="size-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white/2 border-y border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "12,000+", label: "Active Students" },
            { value: "340+", label: "Expert Courses" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "45+", label: "Partner Academies" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-black font-heading text-brand-yellow italic">{s.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Catalog */}
      <section id="courses" className="py-24 px-6 bg-[#070707]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-yellow mb-3">Course Registry</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter italic">Available Missions</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-4 max-w-lg mx-auto">Enroll in any course — sign in to begin.</p>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, topics, skills..."
              className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow/50 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <Filter className="size-4 text-white/30 shrink-0" />
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                  activeCategory === cat ? "bg-brand-yellow text-black border-brand-yellow shadow-[0_0_20px_rgba(255,215,0,0.3)]" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white bg-transparent"
                )}>
                {cat}
              </button>
            ))}
            <div className="w-px h-5 bg-white/10 hidden sm:block" />
            {LEVELS.map(lvl => (
              <button key={lvl} onClick={() => setActiveLevel(lvl)}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                  activeLevel === lvl ? "bg-white text-black border-white" : "border-white/10 text-white/50 hover:border-white/30 bg-transparent"
                )}>
                {lvl}
              </button>
            ))}
            <div className="w-px h-5 bg-white/10 hidden sm:block" />
            {(["all", "free", "paid"] as const).map(p => (
              <button key={p} onClick={() => setPriceFilter(p)}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                  priceFilter === p ? "bg-white/10 text-white border-white/20" : "border-white/10 text-white/40 bg-transparent"
                )}>
                {p === "all" ? "All Prices" : p}
              </button>
            ))}
          </div>

          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-6">{filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found</p>

          {coursesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-10 animate-spin text-brand-yellow/40" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <BookOpen className="size-12 mx-auto mb-4 opacity-20" />
              <p className="font-black uppercase tracking-widest text-xs">No courses match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-[#080808] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-yellow mb-3">Platform Infrastructure</p>
            <h2 className="font-heading font-black text-4xl uppercase tracking-tighter italic">Built for Excellence</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Secure Core", desc: "Military grade data isolation and RLS security protocols.", icon: Shield },
              { title: "Edge Performance", desc: "Global CDN delivery with zero-latency streaming.", icon: Zap },
              { title: "Real-time Hub", desc: "Instant notifications and live chat synchronization.", icon: Globe },
              { title: "AI Analytics", desc: "Deep performance tracking for cadre optimization.", icon: Cpu },
            ].map((f, i) => (
              <div key={i} className="group p-7 rounded-3xl border-2 border-white/5 bg-black/40 hover:border-brand-yellow/50 transition-all">
                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-brand-yellow/10 transition-colors">
                  <f.icon className="size-6 text-brand-yellow" />
                </div>
                <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-2">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-brand-yellow">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter italic text-black mb-5">Ready to Begin?</h2>
          <p className="text-black/60 text-sm font-bold uppercase tracking-widest mb-8">Choose a subscription plan or enroll in individual courses.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="h-14 px-10 bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl" asChild>
              <Link href="/pricing">View Subscription Plans</Link>
            </Button>
            <Button variant="outline" className="h-14 px-10 border-2 border-black/30 bg-transparent text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black hover:text-white transition-all" asChild>
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
          <Logo variant="white" size="sm" />
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
            <Link href="/pricing" className="hover:text-brand-yellow transition-colors">Pricing</Link>
            <Link href="/legal/privacy" className="hover:text-brand-yellow transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-brand-yellow transition-colors">Terms</Link>
            <span>© 2026 HEDS Academy</span>
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-50 mix-blend-overlay" />
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  const levelColors: Record<string, string> = {
    Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
    Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
  }
  const price = course.price ?? 0

  return (
    <div className="group rounded-3xl border-2 border-white/5 hover:border-brand-yellow/30 transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <BookOpen className="size-12 text-white/10 group-hover:scale-110 transition-transform duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {course.level && (
            <span className={cn("text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border", levelColors[course.level] ?? "bg-white/10 text-white/60 border-white/10")}>
              {course.level}
            </span>
          )}
          {price === 0 && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">Free</span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          {course.category && <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1.5">{course.category}</p>}
          <h3 className="font-heading font-black text-sm uppercase tracking-tight leading-tight group-hover:text-brand-yellow transition-colors">{course.title}</h3>
        </div>

        <div className="flex items-center gap-4 text-[9px] text-white/40 font-black uppercase tracking-widest">
          {course.duration_hours && <span className="flex items-center gap-1.5"><Clock className="size-3" />{course.duration_hours}h</span>}
          {course.sessions_count && <span className="flex items-center gap-1.5"><Users className="size-3" />{course.sessions_count} sessions</span>}
        </div>

        {Array.isArray(course.benefits) && course.benefits.length > 0 && (
          <ul className="space-y-1">
            {course.benefits.slice(0, 2).map((b: string, i: number) => (
              <li key={i} className="text-[9px] text-white/40 font-bold flex items-center gap-2">
                <Star className="size-2.5 text-brand-yellow fill-brand-yellow shrink-0" /> {b}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            {price === 0
              ? <span className="text-brand-yellow font-black text-sm italic">Free</span>
              : <><span className="text-xl font-black font-heading">${price}</span><span className="text-white/30 text-[10px] ml-1">USD</span></>
            }
          </div>
          <Link
            href={`/courses/${course.id}/enroll`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-yellow text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Enroll <ChevronRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
