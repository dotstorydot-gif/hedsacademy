"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Video, FileText, HelpCircle, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LessonProps {
  lesson: {
    id: string
    title: string
    type: 'video' | 'article' | 'quiz'
  }
}

export function SortableLesson({ lesson }: LessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="flex items-center gap-3 p-3 pl-10 hover:bg-muted/30 transition-colors group bg-card"
    >
      <div {...attributes} {...listeners} className="cursor-grab p-1">
        <GripVertical className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {lesson.type === 'video' && <Video className="size-4" />}
        {lesson.type === 'article' && <FileText className="size-4" />}
        {lesson.type === 'quiz' && <HelpCircle className="size-4" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{lesson.title}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{lesson.type}</p>
      </div>
      <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreVertical className="size-4" />
      </Button>
    </div>
  )
}
