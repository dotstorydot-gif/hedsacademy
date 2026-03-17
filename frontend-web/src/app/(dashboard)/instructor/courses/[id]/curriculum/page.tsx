"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ListTree, Save } from "lucide-react"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableModule } from "@/components/dashboard/course-builder/SortableModule"

export default function CurriculumBuilderPage() {
  const [modules, setModules] = useState([
    {
      id: "m1",
      title: "Module 1: Introduction to React",
      isOpen: true,
      lessons: [
        { id: "l1", title: "What is React?", type: 'video' },
        { id: "l2", title: "Setting up your environment", type: 'video' },
        { id: "l3", title: "First component basics", type: 'article' },
      ]
    },
    {
      id: "m2",
      title: "Module 2: Handling State",
      isOpen: false,
      lessons: [
        { id: "l4", title: "useState Hook deep dive", type: 'video' },
        { id: "l5", title: "Quiz: State Management", type: 'quiz' },
      ]
    }
  ])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const activeId = active.id.toString()
      const overId = over.id.toString()

      // Handle module reordering
      if (activeId.startsWith('m') && overId.startsWith('m')) {
        setModules((items) => {
          const oldIndex = items.findIndex((i) => i.id === activeId)
          const newIndex = items.findIndex((i) => i.id === overId)
          return arrayMove(items, oldIndex, newIndex)
        })
      } 
      // Handle lesson reordering (within same module for simplicity now)
      else {
        setModules((items) => {
          return items.map(module => {
            const activeIndex = module.lessons.findIndex(l => l.id === activeId)
            const overIndex = module.lessons.findIndex(l => l.id === overId)
            
            if (activeIndex !== -1 && overIndex !== -1) {
              return {
                ...module,
                lessons: arrayMove(module.lessons, activeIndex, overIndex)
              }
            }
            return module
          })
        })
      }
    }
  }

  const toggleModule = (id: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, isOpen: !m.isOpen } : m))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Curriculum Builder</h3>
          <p className="text-sm text-muted-foreground">Drag and drop to structure your course curriculum.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
             <Save className="mr-2 size-4" /> Save Curriculum
          </Button>
          <Button>
            <Plus className="mr-2 size-4" /> Add Module
          </Button>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {modules.map((module) => (
              <SortableModule 
                key={module.id} 
                module={module} 
                onToggle={toggleModule} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {modules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/5 gap-4">
           <ListTree className="size-10 text-muted-foreground/40" />
           <div className="text-center">
              <p className="font-bold text-muted-foreground">Add more modules to structure your course</p>
              <p className="text-xs text-muted-foreground/60">Drag and drop to reorder modules and lessons</p>
           </div>
           <Button variant="outline" size="sm">
              <Plus className="mr-2 size-4" /> New Module
           </Button>
        </div>
      )}
    </div>
  )
}
