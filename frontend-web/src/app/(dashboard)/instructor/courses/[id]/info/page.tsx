"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Save, Loader2, CheckCircle, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type CourseStatus = "draft" | "published" | "archived"

export default function CourseInfoPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("Beginner")
  const [price, setPrice] = useState("0")
  const [status, setStatus] = useState<CourseStatus>("draft")
  const [thumbnailUrl, setThumbnailUrl] = useState("")

  useEffect(() => {
    const load = async () => {
      if (courseId === "new") { setLoading(false); return }
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single()
      if (data) {
        setTitle(data.title || "")
        setDescription(data.description || "")
        setPrice(String(data.price || 0))
        setStatus(data.status || "draft")
        setThumbnailUrl(data.thumbnail_url || "")
        setCategory(data.category || "")
        setLevel(data.level || "Beginner")
      }
      setLoading(false)
    }
    load()
  }, [courseId])

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingThumb(true)
    const fileName = `thumbnails/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from("course-media").upload(fileName, file)
    if (!error && data) {
      const { data: urlData } = supabase.storage.from("course-media").getPublicUrl(data.path)
      setThumbnailUrl(urlData.publicUrl)
    }
    setUploadingThumb(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      title,
      description,
      price: parseFloat(price),
      status,
      thumbnail_url: thumbnailUrl,
    }

    if (courseId === "new") {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from("courses")
        .insert({ ...payload, instructor_id: user?.id })
        .select()
        .single()
      if (!error && data) {
        router.push(`/instructor/courses/${data.id}/curriculum`)
      }
    } else {
      await supabase.from("courses").update(payload).eq("id", courseId)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )

  const levels = ["Beginner", "Intermediate", "Advanced"]
  const statuses: CourseStatus[] = ["draft", "published", "archived"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tight uppercase italic">Basic Information</h3>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-11 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-8 shadow-xl hover:scale-105 transition-all"
        >
          {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : saved ? <CheckCircle className="size-4 mr-2 text-green-400" /> : <Save className="size-4 mr-2" />}
          {courseId === "new" ? "Create & Continue" : saved ? "Saved!" : "Save Progress"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">General Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Course Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Master React Hooks" className="h-12 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Description</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what your students will learn..." className="min-h-[120px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Category</label>
                <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Programming" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Level</label>
                <div className="flex gap-2 flex-wrap">
                  {levels.map(l => (
                    <Badge
                      key={l}
                      variant={level === l ? "default" : "outline"}
                      className="cursor-pointer font-black uppercase tracking-wider px-4 py-2"
                      onClick={() => setLevel(l)}
                    >{l}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Media & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wider">Thumbnail</label>
                <label className={cn(
                  "aspect-video block rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-all hover:border-brand-yellow/50 hover:bg-muted/30 relative",
                  thumbnailUrl ? "border-solid border-black/10 dark:border-white/10" : "border-black/10 dark:border-white/10"
                )}>
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      {uploadingThumb ? <Loader2 className="size-6 animate-spin" /> : <ImageIcon className="size-6" />}
                      <p className="text-[10px] font-black uppercase tracking-widest">{uploadingThumb ? "Uploading..." : "Click to Upload"}</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </label>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider">Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
                  <Input type="number" className="pl-8 h-12 font-bold" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {statuses.map(s => (
                      <Badge
                        key={s}
                        variant={status === s ? "default" : "outline"}
                        className={cn("cursor-pointer font-black uppercase tracking-wider px-4 py-2",
                          s === "published" && status === s && "bg-green-500 border-green-500"
                        )}
                        onClick={() => setStatus(s)}
                      >{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
