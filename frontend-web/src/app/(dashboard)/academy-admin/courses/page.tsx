"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Search, Filter } from "lucide-react"

export default function AcademyAdminCoursesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Academic Assets</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Academy-wide Course Registry</p>
        </div>
        <Button className="h-11 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-xl">
          <Plus className="mr-2 h-4 w-4" /> Deploy Institutional Course
        </Button>
      </div>

      <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden p-20 text-center flex flex-col items-center gap-6">
        <div className="size-20 rounded-full bg-muted/10 flex items-center justify-center border-2 border-muted">
           <BookOpen className="size-10 text-muted-foreground/20" />
        </div>
        <div className="space-y-2">
           <h3 className="font-heading font-black text-xl uppercase tracking-tighter">Global Course Database</h3>
           <p className="text-xs text-muted-foreground font-medium max-w-sm mx-auto">
              All courses deployed across your academy will be cataloged and manageable within this protocol.
           </p>
        </div>
      </Card>
    </div>
  )
}
