"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Shield, Globe, Bell } from "lucide-react"

export default function AcademyAdminSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Infrastructure Settings</h1>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Academy-level Configuration Control</p>
      </div>

      <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden p-20 text-center flex flex-col items-center gap-6">
        <div className="size-20 rounded-full bg-muted/10 flex items-center justify-center border-2 border-muted">
           <Settings className="size-10 text-muted-foreground/20" />
        </div>
        <div className="space-y-2">
           <h3 className="font-heading font-black text-xl uppercase tracking-tighter">Administration Terminal</h3>
           <p className="text-xs text-muted-foreground font-medium max-w-sm mx-auto">
              Academy branding, staff permissions, and global academic policies will be manageable through this interface in System Update 2.1.
           </p>
        </div>
      </Card>
    </div>
  )
}
