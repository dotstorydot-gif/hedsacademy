"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, BookOpen, Clock, Star } from "lucide-react"
import Link from "next/link"

export default function StudentCoursesPage() {
  const courses = [
    {
      id: "react-101",
      title: "Mastering React Hooks",
      instructor: "Dr. Sarah Johnson",
      progress: 65,
      lessons: 24,
      duration: "12h 30m",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "flutter-adv",
      title: "Advanced Flutter UI Patterns",
      instructor: "Eng. Ahmed Rayan",
      progress: 10,
      lessons: 45,
      duration: "20h 15m",
      image: "https://images.unsplash.com/photo-1617042375876-a13e36734a04?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "fullstack-next",
      title: "Next.js 15 Masterclass",
      instructor: "HEDS Core Faculty",
      progress: 0,
      lessons: 32,
      duration: "15h 45m",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60"
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Academic Curriculum</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">HEDS Learning Hub</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search missions..." 
              className="pl-10 w-[240px] h-11 bg-muted/30 border-2 border-transparent focus:border-brand-yellow/30 rounded-xl transition-all font-bold text-xs"
            />
          </div>
          <Button variant="outline" className="h-11 border-2 font-black uppercase text-[10px] tracking-widest gap-2">
            <Filter className="size-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="group overflow-hidden border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm transition-all hover:border-brand-yellow/40 hover:shadow-2xl hover:shadow-brand-yellow/10 rounded-3xl">
            <div className="aspect-video relative overflow-hidden">
               <img 
                 src={course.image} 
                 alt={course.title}
                 className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                 <div className="bg-brand-yellow text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                   {course.progress > 0 ? `${course.progress}% Completed` : 'Not Started'}
                 </div>
               </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-1 bg-brand-yellow rounded-full" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{course.instructor}</span>
              </div>
              <CardTitle className="text-lg font-black tracking-tight leading-tight group-hover:text-brand-dark-yellow transition-colors">
                {course.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
               <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-6">
                 <div className="flex items-center gap-2">
                   <BookOpen className="size-3 text-brand-dark-yellow" />
                   {course.lessons} Lessons
                 </div>
                 <div className="flex items-center gap-2">
                   <Clock className="size-3 text-brand-dark-yellow" />
                   {course.duration}
                 </div>
               </div>
               
               <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mb-6">
                 <div 
                   className="h-full bg-brand-yellow transition-all duration-1000" 
                   style={{ width: `${course.progress}%` }}
                 />
               </div>
               
               <Button className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl group-hover:bg-brand-yellow group-hover:text-black transition-all" asChild>
                 <Link href={`/student/courses/${course.id}/lessons/intro`}>
                   Initialize Mission
                 </Link>
               </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
