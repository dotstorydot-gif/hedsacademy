"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MoreVertical, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableLesson } from "./SortableLesson"

interface ModuleProps {
  module: {
    id: string
    title: string
    isOpen?: boolean
    lessons: any[]
  }
  onToggle: (id: string) => void
}

export function SortableModule({ module, onToggle }: ModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : 'auto',
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className="border-2 shadow-sm overflow-hidden bg-card"
    >
      <CardHeader className="flex flex-row items-center gap-2 p-4 bg-muted/20">
        <div {...attributes} {...listeners} className="cursor-grab p-1">
          <GripVertical className="size-4 text-muted-foreground" />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-6 rounded-full"
          onClick={() => onToggle(module.id)}
        >
          {module.isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
        <CardTitle className="text-sm font-bold flex-1">{module.title}</CardTitle>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreVertical className="size-4" />
        </Button>
      </CardHeader>
      
      {module.isOpen && (
        <CardContent className="p-0 border-t bg-card">
          <SortableContext items={module.lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y">
              {module.lessons.map((lesson) => (
                <SortableLesson key={lesson.id} lesson={lesson} />
              ))}
              <div className="p-3 pl-10">
                <Button variant="outline" size="sm" className="w-full justify-start border-dashed group">
                  <Plus className="mr-2 size-4 group-hover:scale-110 transition-transform" /> 
                  Add Lesson
                </Button>
              </div>
            </div>
          </SortableContext>
        </CardContent>
      )}
    </Card>
  )
}
