"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, User, Bell, Lock, Globe, Camera } from "lucide-react"

export default function StudentSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">System Configuration</h1>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Personal Registry & Security</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-6">
                 <div className="size-32 rounded-full bg-muted border-4 border-brand-yellow/20 flex items-center justify-center overflow-hidden">
                    <User className="size-16 text-muted-foreground/40" />
                 </div>
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="size-6 text-white" />
                 </div>
              </div>
              <h2 className="font-black text-xl tracking-tight leading-tight mb-1 italic">Cadre: Sameh Ali</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Student ID: #HEDS-2026-X81</p>
              
              <div className="w-full space-y-2">
                 <Button variant="outline" className="w-full h-11 border-2 font-black uppercase text-[10px] tracking-widest gap-2">
                    Update Avatar
                 </Button>
                 <Button variant="ghost" className="w-full h-11 font-black uppercase text-[10px] tracking-widest text-red-400 hover:bg-red-400/10">
                    Deactivate Identity
                 </Button>
              </div>
           </Card>

           <Card className="border-2 border-black/5 dark:border-white/5 bg-black text-white rounded-3xl p-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Shield className="size-32" />
              </div>
              <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-6 relative z-10">Security Status</h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Two-Factor Active</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40">
                    <div className="size-2 rounded-full bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Last Access: 2H Ago</span>
                 </div>
                 <Button className="w-full h-11 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brand-yellow transition-all mt-4">
                    Rotate Credentials
                 </Button>
              </div>
           </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden">
              <div className="p-8 border-b border-black/5 dark:border-white/5">
                 <h3 className="font-heading font-black text-xs uppercase tracking-widest flex items-center gap-3">
                    <User className="size-4 text-brand-dark-yellow" /> Profile Information
                 </h3>
              </div>
              <CardContent className="p-8 space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                       <Input defaultValue="Sameh Ali" className="h-12 bg-muted/20 border-2 border-transparent focus:border-brand-yellow/30 rounded-xl px-4 font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Terminal</label>
                       <Input defaultValue="sameh@example.com" className="h-12 bg-muted/20 border-2 border-transparent focus:border-brand-yellow/30 rounded-xl px-4 font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Academic Title</label>
                       <Input defaultValue="Web Engineering Associate" className="h-12 bg-muted/20 border-2 border-transparent focus:border-brand-yellow/30 rounded-xl px-4 font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location / Timezone</label>
                       <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input defaultValue="Cairo, Egypt (GMT +2)" className="h-12 bg-muted/20 border-2 border-transparent focus:border-brand-yellow/30 rounded-xl pl-12 pr-4 font-bold text-sm" />
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Academic Biography</label>
                    <textarea 
                       className="w-full min-h-[120px] bg-muted/20 border-2 border-transparent focus:border-brand-yellow/30 rounded-2xl px-4 py-3 font-bold text-sm outline-none transition-all"
                       defaultValue="Engineering high-performance web systems and mastering React architecture within the HEDS ecosystem."
                    />
                 </div>

                 <div className="flex justify-end pt-4">
                    <Button className="h-12 px-10 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-brand-yellow hover:text-black transition-all shadow-xl shadow-black/10">
                       Commit Changes
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden">
              <div className="p-8 border-b border-black/5 dark:border-white/5">
                 <h3 className="font-heading font-black text-xs uppercase tracking-widest flex items-center gap-3">
                    <Bell className="size-4 text-brand-dark-yellow" /> Transmission Preferences
                 </h3>
              </div>
              <CardContent className="p-8 space-y-6">
                 {[
                    { label: "Course Updates", desc: "Get notified when new lessons are deployed." },
                    { label: "Live Broadcasts", desc: "Receive alerts 15 minutes before sessions start." },
                    { label: "Academic Ratings", desc: "Feedback transmissions on your mission progress." }
                 ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-tight">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
                       </div>
                       <div className="w-10 h-5 bg-black/10 dark:bg-white/10 rounded-full relative cursor-pointer border border-transparent hover:border-brand-yellow/30 transition-all">
                          <div className="absolute right-1 top-1 size-3 bg-brand-yellow rounded-full" />
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
