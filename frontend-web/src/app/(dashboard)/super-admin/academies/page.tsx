"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Search, Filter, Globe } from "lucide-react"

export default function SuperAdminAcademiesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Global Networks</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Super-Admin Academy Registry</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                className="pl-10 w-[240px] h-11 bg-muted/30 border-2 border-transparent focus:border-brand-yellow/30 rounded-xl transition-all font-bold text-xs outline-none"
                placeholder="Search Academies..."
              />
           </div>
           <Button className="h-11 bg-brand-yellow text-black font-black uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-xl shadow-brand-yellow/10">
             Audit Network
           </Button>
        </div>
      </div>

      <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden p-20 text-center flex flex-col items-center gap-6">
        <div className="size-20 rounded-full bg-muted/10 flex items-center justify-center border-2 border-muted">
           <Globe className="size-10 text-muted-foreground/20" />
        </div>
        <div className="space-y-2">
           <h3 className="font-heading font-black text-xl uppercase tracking-tighter">Global Fleet Management</h3>
           <p className="text-xs text-muted-foreground font-medium max-w-sm mx-auto">
              Institutional performance, domain mapping, and academy-wide configuration and logs will be indexed here.
           </p>
        </div>
      </Card>
    </div>
  )
}
