import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Video, FileText, Save, Eye, Layout } from "lucide-react"

export default function LessonEditorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Video className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Lesson Editor</h2>
            <p className="text-sm text-muted-foreground">useState Hook deep dive</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline">
              <Eye className="mr-2 size-4" /> Preview
           </Button>
           <Button>
              <Save className="mr-2 size-4" /> Save Lesson
           </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Lesson Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-semibold">Lesson Title</label>
                 <Input defaultValue="useState Hook deep dive" />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-semibold">Video Content</label>
                 <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative group overflow-hidden border-4 border-muted">
                    <Video className="size-16 text-white/20 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="secondary" size="sm">Change Video</Button>
                    </div>
                 </div>
                 <p className="text-[10px] text-muted-foreground">Supported formats: MP4, WebM (Max 500MB)</p>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-semibold">Lesson Description (Context for students)</label>
                 <textarea 
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Provide details about what students will learn in this lesson..."
                 />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader>
               <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resources & Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-3 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
                  <FileText className="size-6 text-muted-foreground/50" />
                  <span className="text-xs font-medium text-muted-foreground">Upload reference PDF or code</span>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border">
                     <div className="flex items-center gap-2">
                        <FileText className="size-3 text-primary" />
                        <span className="text-[10px] font-bold truncate max-w-[120px]">react-hooks-cheatsheet.pdf</span>
                     </div>
                     <Button variant="ghost" size="icon" className="size-5">
                        <MoreVertical className="size-3" />
                     </Button>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm bg-primary/5">
             <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Lesson Settings</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-medium">Free Preview</span>
                   <div className="w-8 h-4 bg-muted rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 size-2 bg-white rounded-full transition-transform" />
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-medium">Downloadable</span>
                   <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 size-2 bg-white rounded-full" />
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
