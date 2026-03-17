"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export interface Lesson {
  id: string
  title: string
  completed: boolean
  type: string
  duration_minutes?: number
  video_url?: string
  meeting_url?: string
  location_name?: string
  location_address?: string
  pdf_url?: string
  free_preview?: boolean
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Instructor {
  full_name: string
  bio: string
  avatar_url: string
  title: string
}

interface CourseContextType {
  curriculum: Module[]
  completeLesson: (lessonId: string) => void
  progressPercent: number
  courseTitle: string
  instructor: Instructor | null
  loading: boolean
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const params = useParams()
  const courseId = params?.id as string

  const [curriculum, setCurriculum] = useState<Module[]>([])
  const [courseTitle, setCourseTitle] = useState("")
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [studentId, setStudentId] = useState<string | null>(null)

  const loadCurriculum = useCallback(async () => {
    if (!courseId) return
    setLoading(true)

    const [{ data: { user } }, { data: course }, { data: modules }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("courses")
        .select(`
          title,
          instructor:instructor_id (
            full_name,
            bio,
            avatar_url,
            title
          )
        `)
        .eq("id", courseId)
        .single(),
      supabase.from("modules")
        .select("id, title, order_index")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
    ])

    if (user) setStudentId(user.id)
    if (course) {
      setCourseTitle(course.title)
      setInstructor(course.instructor as any)
    }

    if (!modules?.length) {
      setLoading(false)
      return
    }

    // Load lessons for all modules
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, title, type, order_index, duration_minutes, video_url, meeting_url, location_name, location_address, pdf_url, free_preview, module_id")
      .in("module_id", modules.map(m => m.id))
      .order("order_index", { ascending: true })

    // Load completions if logged in
    let completionSet = new Set<string>()
    if (user) {
      const { data: completions } = await supabase
        .from("lesson_completions")
        .select("lesson_id")
        .eq("student_id", user.id)
      completionSet = new Set((completions ?? []).map((c: { lesson_id: string }) => c.lesson_id))
    }

    const mappedModules: Module[] = modules.map(m => ({
      id: m.id,
      title: m.title,
      lessons: (lessons ?? [])
        .filter((l: any) => l.module_id === m.id)
        .map((l: any) => ({
          ...l,
          completed: completionSet.has(l.id),
        })),
    }))

    setCurriculum(mappedModules)
    setLoading(false)
  }, [courseId, supabase])

  useEffect(() => { loadCurriculum() }, [loadCurriculum])

  const completeLesson = async (lessonId: string) => {
    // Optimistic UI update
    setCurriculum(prev => prev.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      )
    })))

    // Persist to Supabase if logged in
    if (studentId) {
      await supabase.from("lesson_completions").upsert({
        lesson_id: lessonId,
        student_id: studentId,
        course_id: courseId,
        completed_at: new Date().toISOString(),
      }, { onConflict: "student_id,lesson_id" })
    }
  }

  const allLessons = curriculum.flatMap(m => m.lessons)
  const completedCount = allLessons.filter(l => l.completed).length
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0

  return (
    <CourseContext.Provider value={{ curriculum, completeLesson, progressPercent, courseTitle, instructor, loading }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (!context) throw new Error("useCourse must be used within a CourseProvider")
  return context
}
