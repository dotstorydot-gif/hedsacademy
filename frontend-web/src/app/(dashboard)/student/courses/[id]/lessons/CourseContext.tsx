"use client"

import React, { createContext, useContext, useState } from "react"

interface Lesson {
  id: string
  title: string
  completed: boolean
  type: string
}

interface Module {
  title: string
  lessons: Lesson[]
}

interface CourseContextType {
  curriculum: Module[]
  completeLesson: (lessonId: string) => void
  progressPercent: number
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {

  const [curriculum, setCurriculum] = useState<Module[]>([
    {
      title: "Module 1: Getting Started",
      lessons: [
        { id: "l1", title: "Introduction", completed: true, type: 'video' },
        { id: "l2", title: "Setting up the environment", completed: true, type: 'video' },
        { id: "q1", title: "Basic Setup Quiz", completed: false, type: 'quiz' },
      ]
    },
    {
      title: "Module 2: Core Concepts",
      lessons: [
        { id: "l3", title: "React Fundamentals", completed: false, type: 'video' },
        { id: "l3-props", title: "Understanding Props", completed: false, type: 'video' },
        { id: "l4", title: "Advanced State", completed: false, type: 'video' },
        { id: "a1", title: "Project: Counter App", completed: false, type: 'assignment' },
        { id: "m1", title: "Live Q&A Session", completed: false, type: 'meeting' },
      ]
    },
    {
       title: "Module 3: Final Evaluation",
       lessons: [
         { id: "e1", title: "Final Certification Exam", completed: false, type: 'exam' }
       ]
    }
  ])

  const completeLesson = (lessonId: string) => {
    setCurriculum(prev => prev.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      )
    })))
  }

  const allLessons = curriculum.flatMap(m => m.lessons)
  const completedCount = allLessons.filter(l => l.completed).length
  const progressPercent = Math.round((completedCount / allLessons.length) * 100)

  return (
    <CourseContext.Provider value={{ curriculum, completeLesson, progressPercent }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (!context) throw new Error("useCourse must be used within a CourseProvider")
  return context
}
