"use client"

import { VideoPlayer } from "@/components/course/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react"

export default function StudentLessonPage() {
  return (
    <div className="space-y-8 pb-20">
      {/* Video Player Section */}
      <VideoPlayer 
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" 
        poster="https://peach.blender.org/wp-content/uploads/title_anotate.jpg"
      />

      {/* Lesson Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
         <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Understanding React Props</h1>
            <p className="text-muted-foreground font-medium">Module 2: Core Concepts</p>
         </div>
         <div className="flex gap-3">
            <Button variant="outline" size="lg">
               <ChevronLeft className="mr-2 size-4" /> Previous
            </Button>
            <Button size="lg" className="shadow-lg shadow-primary/20">
               Next Lesson <ChevronRight className="ml-2 size-4" />
            </Button>
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
               <TabsList className="bg-muted/30 p-1 w-full justify-start h-12">
                  <TabsTrigger value="overview" className="px-8 font-bold">Overview</TabsTrigger>
                  <TabsTrigger value="resources" className="px-8 font-bold">Resources</TabsTrigger>
                  <TabsTrigger value="discussions" className="px-8 font-bold">Discussions</TabsTrigger>
               </TabsList>
               
               <TabsContent value="overview" className="mt-8">
                  <Card className="border-2 shadow-sm bg-card p-2">
                     <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                        <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
                        <p className="text-muted-foreground leading-relaxed">
                           In this lesson, we go deep into how components communicate with each other using Props. 
                           Understanding this data flow is crucial for building scalable React applications. 
                           We will cover prop-types, default props, and the power of the children prop.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                           {[
                              "Passing data from Parent to Child",
                              "Handling functional props (callbacks)",
                              "The 'children' prop pattern",
                              "Modern Destructuring in Props"
                           ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                 <CheckCircle className="size-4 text-green-500" />
                                 <span className="font-medium text-muted-foreground">{item}</span>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>
               
               <TabsContent value="resources" className="mt-6 space-y-4">
                  {[
                     { name: "React Components Deep Dive PDF", type: "PDF", size: "2.4 MB" },
                     { name: "Demo Project Source Code", type: "ZIP", size: "15.0 MB" },
                  ].map((res, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-xl border-2 hover:bg-muted/30 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <FileText className="size-5" />
                           </div>
                           <div>
                              <p className="font-bold text-sm tracking-tight">{res.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">{res.type} • {res.size}</p>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                           <Download className="size-4" />
                        </Button>
                     </div>
                  ))}
               </TabsContent>
            </Tabs>
         </div>

         <div className="space-y-6">
            <Card className="border-2 shadow-sm bg-primary/5">
                <CardHeader>
                   <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Lesson Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-muted-foreground">Duration</span>
                      <span>15:42</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-muted-foreground">Type</span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">VIDEO</span>
                   </div>
                   <div className="pt-4 border-t">
                      <Button className="w-full font-bold shadow-md shadow-primary/10" variant="outline">
                         Mark as Completed
                      </Button>
                   </div>
                </CardContent>
            </Card>

            <Card className="border-2 shadow-sm">
               <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Instructor Note</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                     &quot;Make sure to follow along with the source code provided in the resources tab. 
                     Try to build the simple counter again by yourself after watching this video.&quot;
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                     <div className="size-8 rounded-full bg-muted border" />
                     <div className="text-[10px]">
                        <p className="font-bold">Sarah Johnson</p>
                        <p className="text-muted-foreground">Senior React Developer</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
