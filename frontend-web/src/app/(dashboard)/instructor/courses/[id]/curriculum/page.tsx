"use client"

import { useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Trash2, ChevronDown, ChevronUp, Video, FileQuestion, FileText, Users, GripVertical,
  Loader2, Upload, Link2, CheckCircle, Edit2, Save, X, MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

type LessonType = "video" | "quiz" | "assignment" | "meeting" | "in_person"

interface Lesson {
  id: string
  title: string
  type: LessonType
  video_url?: string | null
  meeting_url?: string | null
  location_name?: string | null
  location_address?: string | null
  sequence_order: number
}

interface Module {
  id: string
  title: string
  sequence_order: number
  lessons: Lesson[]
  expanded: boolean
}

const TYPE_CONFIG: Record<LessonType, { icon: React.ReactNode; label: string; color: string }> = {
  video:     { icon: <Video className="size-4" />,       label: "Video",          color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  quiz:      { icon: <FileQuestion className="size-4" />, label: "Quiz",           color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  assignment:{ icon: <FileText className="size-4" />,    label: "Assignment",     color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  meeting:   { icon: <Users className="size-4" />,       label: "Online Meeting", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  in_person: { icon: <MapPin className="size-4" />,      label: "In-Person",      color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
}

const TYPE_DEFAULT_TITLES: Record<LessonType, string> = {
  video:      "New Video Lesson",
  quiz:       "New Quiz",
  assignment: "New Assignment",
  meeting:    "New Online Session",
  in_person:  "In-Person Class at HEDS Academy",
}

export default function CurriculumBuilderPage() {
  const params = useParams()
  const courseId = params.id as string
  const supabase = createClient()

  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [savingLesson, setSavingLesson] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<string | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState<string | null>(null)

  const loadCurriculum = useCallback(async () => {
    setLoading(true)
    const { data: mods } = await supabase
      .from("modules")
      .select("*, lessons(*)")
      .eq("course_id", courseId)
      .order("sequence_order")
    if (mods) {
      setModules(mods.map(m => ({
        ...m,
        expanded: true,
        lessons: ((m.lessons || []) as Lesson[]).sort((a, b) => a.sequence_order - b.sequence_order),
      })))
    }
    setLoading(false)
  }, [courseId, supabase])

  useEffect(() => { loadCurriculum() }, [loadCurriculum])

  const addModule = async () => {
    const order = modules.length
    const { data } = await supabase
      .from("modules")
      .insert({ course_id: courseId, title: `Module ${order + 1}: New Module`, sequence_order: order })
      .select().single()
    if (data) setModules(prev => [...prev, { ...data, lessons: [], expanded: true }])
  }

  const updateModuleTitle = async (moduleId: string, title: string) => {
    await supabase.from("modules").update({ title }).eq("id", moduleId)
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title } : m))
  }

  const deleteModule = async (moduleId: string) => {
    await supabase.from("modules").delete().eq("id", moduleId)
    setModules(prev => prev.filter(m => m.id !== moduleId))
  }

  const addLesson = async (moduleId: string, type: LessonType) => {
    const mod = modules.find(m => m.id === moduleId)
    const order = mod?.lessons.length || 0
    const { data } = await supabase
      .from("lessons")
      .insert({ module_id: moduleId, type, title: TYPE_DEFAULT_TITLES[type], sequence_order: order })
      .select().single()
    if (data) {
      setModules(prev => prev.map(m =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, data as Lesson] } : m
      ))
      setEditingLesson(data.id)
    }
  }

  const updateLesson = async (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setSavingLesson(lessonId)
    await supabase.from("lessons").update(updates).eq("id", lessonId)
    setModules(prev => prev.map(m =>
      m.id === moduleId
        ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l) }
        : m
    ))
    setSavingLesson(null)
    setEditingLesson(null)
  }

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    await supabase.from("lessons").delete().eq("id", lessonId)
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ))
  }

  const handleVideoUpload = async (moduleId: string, lessonId: string, file: File) => {
    setUploadingVideo(lessonId)
    const path = `videos/${courseId}/${lessonId}-${file.name}`
    const { data, error } = await supabase.storage.from("course-media").upload(path, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("course-media").getPublicUrl(data.path)
      await updateLesson(moduleId, lessonId, { video_url: urlData.publicUrl })
    }
    setUploadingVideo(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight uppercase italic">Curriculum Builder</h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            {modules.length} modules • {modules.flatMap(m => m.lessons).length} lessons
          </p>
        </div>
        <Button
          onClick={addModule}
          className="h-11 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-6 shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="size-4 mr-2" /> Add Module
        </Button>
      </div>

      {modules.length === 0 && (
        <Card className="border-2 border-dashed p-16 text-center">
          <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">No modules yet.</p>
          <p className="text-muted-foreground/60 text-xs mt-2">Click &quot;Add Module&quot; to get started.</p>
        </Card>
      )}

      <div className="space-y-4">
        {modules.map((module, mi) => (
          <Card key={module.id} className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 p-4 flex flex-row items-center gap-3">
              <GripVertical className="size-4 text-muted-foreground/40 shrink-0" />
              <div className="flex-1 flex items-center gap-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
                  Module {mi + 1}
                </span>
                <input
                  className="flex-1 bg-transparent font-black text-sm uppercase tracking-tight focus:outline-none border-b-2 border-transparent focus:border-brand-yellow/50 transition-colors py-0.5"
                  defaultValue={module.title}
                  onBlur={e => updateModuleTitle(module.id, e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-8 hover:text-destructive" onClick={() => deleteModule(module.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="size-8"
                  onClick={() => setModules(prev => prev.map(m => m.id === module.id ? { ...m, expanded: !m.expanded } : m))}
                >
                  {module.expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </Button>
              </div>
            </CardHeader>

            {module.expanded && (
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="group">
                      <div className="flex items-center gap-3 p-4 hover:bg-muted/10 transition-colors">
                        <GripVertical className="size-4 text-muted-foreground/20 shrink-0" />
                        <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1", TYPE_CONFIG[lesson.type].color)}>
                          {TYPE_CONFIG[lesson.type].icon}
                          {TYPE_CONFIG[lesson.type].label}
                        </Badge>

                        {editingLesson === lesson.id ? (
                          <LessonEditor
                            lesson={lesson}
                            saving={savingLesson === lesson.id}
                            uploadingVideo={uploadingVideo === lesson.id}
                            onSave={(updates) => updateLesson(module.id, lesson.id, updates)}
                            onCancel={() => setEditingLesson(null)}
                            onVideoUpload={(file) => handleVideoUpload(module.id, lesson.id, file)}
                          />
                        ) : (
                          <>
                            <span className="flex-1 text-sm font-bold truncate uppercase tracking-tight">{lesson.title}</span>
                            <div className="flex items-center gap-2">
                              {lesson.video_url && <span className="text-[9px] text-green-500 font-black">✓ Video</span>}
                              {lesson.meeting_url && <span className="text-[9px] text-green-500 font-black">✓ Link</span>}
                              {lesson.location_name && (
                                <span className="text-[9px] text-orange-500 font-black flex items-center gap-1">
                                  <MapPin className="size-3" />{lesson.location_name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {lesson.type === "quiz" && (
                                <Button variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase tracking-wider" asChild>
                                  <a href={`/instructor/courses/${courseId}/quiz/${lesson.id}`}>Quiz Builder</a>
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="size-7" onClick={() => setEditingLesson(lesson.id)}>
                                <Edit2 className="size-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="size-7 hover:text-destructive" onClick={() => deleteLesson(module.id, lesson.id)}>
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-muted/5 border-t flex flex-wrap gap-2">
                  {(Object.keys(TYPE_CONFIG) as LessonType[]).map(type => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      className="h-8 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:border-brand-yellow/50"
                      onClick={() => addLesson(module.id, type)}
                    >
                      <Plus className="size-3" />
                      {TYPE_CONFIG[type].icon}
                      {TYPE_CONFIG[type].label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

function LessonEditor({ lesson, saving, uploadingVideo, onSave, onCancel, onVideoUpload }: {
  lesson: Lesson
  saving: boolean
  uploadingVideo: boolean
  onSave: (updates: Partial<Lesson>) => void
  onCancel: () => void
  onVideoUpload: (file: File) => void
}) {
  const [title, setTitle] = useState(lesson.title)
  const [meetingUrl, setMeetingUrl] = useState(lesson.meeting_url || "")
  const [locationName, setLocationName] = useState(lesson.location_name || "HEDS Academy")
  const [locationAddress, setLocationAddress] = useState(lesson.location_address || "")

  return (
    <div className="flex-1 space-y-3 py-1">
      <div className="flex items-center gap-2">
        <Input value={title} onChange={e => setTitle(e.target.value)} className="h-8 text-sm font-bold" placeholder="Lesson title..." />
        <Button
          size="sm"
          className="h-8 shrink-0 bg-black dark:bg-white text-white dark:text-black font-black text-[9px] uppercase"
          disabled={saving}
          onClick={() => onSave({
            title,
            meeting_url: meetingUrl || null,
            location_name: locationName || null,
            location_address: locationAddress || null,
          })}
        >
          {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3 mr-1" />}
          Save
        </Button>
        <Button size="sm" variant="ghost" className="h-8 shrink-0" onClick={onCancel}>
          <X className="size-3" />
        </Button>
      </div>

      {lesson.type === "meeting" && (
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-muted-foreground shrink-0" />
          <Input value={meetingUrl} onChange={e => setMeetingUrl(e.target.value)} className="h-8 text-xs" placeholder="Paste Google Meet or Jitsi link..." />
        </div>
      )}

      {lesson.type === "in_person" && (
        <div className="space-y-2 bg-orange-500/5 border border-orange-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-orange-500 shrink-0" />
            <Input
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              className="h-8 text-xs font-bold"
              placeholder="Location name, e.g. HEDS Academy — Room 101"
            />
          </div>
          <Input
            value={locationAddress}
            onChange={e => setLocationAddress(e.target.value)}
            className="h-8 text-xs"
            placeholder="Full address, e.g. 15 Tahrir St, Cairo, Egypt"
          />
        </div>
      )}

      {lesson.type === "video" && (
        <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed rounded-lg px-4 py-2 text-xs font-bold hover:bg-muted/30 w-fit transition-colors">
          {uploadingVideo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploadingVideo ? "Uploading..." : lesson.video_url ? "Replace Video" : "Upload Video"}
          {lesson.video_url && !uploadingVideo && <CheckCircle className="size-3.5 text-green-500 ml-1" />}
          <input type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onVideoUpload(f) }} />
        </label>
      )}
    </div>
  )
}
