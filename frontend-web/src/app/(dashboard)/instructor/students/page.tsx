"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Search, Filter } from "lucide-react"

export default function InstructorStudentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Cadet Management</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Instructor Command Console</p>
        </div>
        <Button className="h-11 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-xl">
          <UserPlus className="mr-2 h-4 w-4" /> Enroll Cadet
        </Button>
      </div>

      <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden p-12 text-center flex flex-col items-center gap-6">
        <div className="size-20 rounded-full bg-muted/10 flex items-center justify-center border-2 border-muted">
           <Users className="size-10 text-muted-foreground/20" />
        </div>
        <div className="space-y-2">
           <h3 className="font-heading font-black text-xl uppercase tracking-tighter">Student Registry Protocol</h3>
           <p className="text-xs text-muted-foreground font-medium max-w-sm mx-auto">
              Your student population and performance metrics will populate here as missions are deployed and cadets are enrolled.
           </p>
        </div>
      </Card>
    </div>
  )
}
