import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CourseInfoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Basic Information</h3>
      </div>

      <div className="grid gap-6">
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">General Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
               <label className="text-sm font-semibold">Course Title</label>
               <Input placeholder="e.g. Master React Hooks" defaultValue="Introduction to React Hooks" />
               <p className="text-[10px] text-muted-foreground">Title should be catchy and descriptive.</p>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-semibold">Description</label>
               <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe what your students will learn..."
                  defaultValue="In this course, we will explore the core hooks in React and how to build efficient functional components."
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <Input placeholder="Development" defaultValue="Programming" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Level</label>
                  <Input placeholder="Beginner" defaultValue="Intermediate" />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
           <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Media & Pricing</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <label className="text-sm font-semibold">Thumbnail</label>
                    <div className="aspect-video bg-muted rounded-lg border-2 border-dashed flex items-center justify-center text-xs text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                       Click to upload thumbnail
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-sm font-semibold">Price (USD)</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                       <Input type="number" className="pl-7" defaultValue="49" />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                       <Badge variant="outline" className="cursor-pointer hover:bg-muted font-bold">Free</Badge>
                       <Badge variant="outline" className="cursor-pointer hover:bg-muted font-bold">Standard</Badge>
                       <Badge variant="outline" className="cursor-pointer hover:bg-muted font-bold">Premium</Badge>
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-4">
           <Button variant="outline">Discard</Button>
           <Button size="lg" className="px-8 shadow-md font-bold">Save Progress</Button>
        </div>
      </div>
    </div>
  )
}
