"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, ShieldCheck, Share2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function StudentCertificatesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const certificates = [
    {
      id: "CERT-2026-001",
      title: "Full-Stack React Engineering",
      issuedBy: "HEDS Academy Global",
      date: "Feb 12, 2026",
      grade: "Distinction",
      id_hash: "88806bd71d20e2bcf073..."
    },
    {
      id: "CERT-2026-002",
      title: "Industrial UI/UX Design Protocols",
      issuedBy: "HEDS Design Lab",
      date: "Jan 28, 2026",
      grade: "A+",
      id_hash: "378eedf683e75351cc47..."
    }
  ]

  const handleDownload = (title: string) => {
    // In a real app, this would trigger a PDF generation or download from storage
    const msg = `Downloading Certificate: ${title}`
    console.log(msg)
    // Create a dummy blob to trigger a download
    const blob = new Blob([msg], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '_')}_Certificate.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/verify/${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="font-heading font-black text-4xl uppercase tracking-tighter italic leading-none">Academic Credentials</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] mt-3">Verified Achievement Registry</p>
        </div>
        
        <Button variant="outline" className="h-14 border-2 border-black/10 dark:border-white/10 font-black uppercase text-[11px] tracking-widest gap-3 px-8 rounded-2xl hover:bg-muted/50 transition-all">
          <ShieldCheck className="size-5" /> Verify Protocol
        </Button>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {certificates.map((cert) => (
          <Card key={cert.id} className="group border-0 bg-black text-white rounded-[2.5rem] overflow-hidden relative transition-all shadow-2xl hover:shadow-brand-yellow/10 ring-1 ring-white/5 hover:ring-brand-yellow/20">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
               <Award className="size-64" />
            </div>
            
            <CardHeader className="p-10 pb-6 relative z-10">
               <div className="flex justify-between items-start mb-10">
                  <div className="size-16 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-xl group-hover:border-brand-yellow/30 transition-colors">
                    <Award className="size-8 text-brand-yellow" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow block mb-2">Status: Verified</span>
                    <span className="text-[9px] font-black text-white/30 block uppercase tracking-tighter font-mono">{cert.id}</span>
                  </div>
               </div>
               <CardTitle className="text-3xl font-black tracking-tighter leading-none group-hover:text-brand-yellow transition-colors italic uppercase mb-2">
                  {cert.title}
               </CardTitle>
            </CardHeader>
            
            <CardContent className="px-10 pb-10 space-y-8 relative z-10">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Authority</p>
                     <p className="text-sm font-bold uppercase tracking-tight">{cert.issuedBy}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Grade</p>
                     <p className="text-sm font-black text-brand-yellow italic">{cert.grade}</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Issue Date</p>
                     <p className="text-sm font-bold uppercase tracking-tight">{cert.date}</p>
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={() => handleDownload(cert.title)}
                    className="flex-1 h-16 bg-white text-black font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl hover:bg-brand-yellow hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 shadow-2xl"
                  >
                     <Download className="size-5" /> Download
                  </Button>
                  <Button 
                    onClick={() => handleShare(cert.id)}
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "size-16 border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all active:scale-90",
                      copiedId === cert.id && "border-brand-yellow/50 bg-brand-yellow/10"
                    )}
                  >
                     {copiedId === cert.id ? <Check className="size-6 text-brand-yellow" /> : <Share2 className="size-6" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="size-16 border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-all active:scale-90"
                  >
                     <Copy className="size-6 text-white/40" />
                  </Button>
               </div>
            </CardContent>
            
            <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
               <p className="text-[9px] font-mono text-white/10 truncate tracking-widest">HASH_DISPATCH: {cert.id_hash}</p>
               <div className="size-1.5 bg-brand-yellow rounded-full shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            </div>
          </Card>
        ))}

        {certificates.length === 0 && (
           <Card className="md:col-span-2 border-2 border-dashed border-black/5 dark:border-white/5 bg-muted/5 rounded-[3rem] flex flex-col items-center justify-center p-32 text-center gap-8">
              <div className="size-24 rounded-[2rem] bg-muted/10 flex items-center justify-center border-2 border-muted/20">
                 <Award className="size-12 text-muted-foreground/20" />
              </div>
              <div className="space-y-3">
                 <h3 className="font-heading font-black text-2xl uppercase tracking-tighter italic">No Credentials Issued</h3>
                 <p className="text-xs text-muted-foreground font-medium max-w-sm mx-auto uppercase tracking-widest leading-loose">
                    Complete your active missions to earn verified HEDS Academy certificates.
                 </p>
              </div>
              <Button className="h-14 px-12 font-black uppercase text-[11px] tracking-[0.2em] bg-black text-white dark:bg-white dark:text-black rounded-2xl hover:scale-110 transition-all shadow-2xl">
                 Explore Courses
              </Button>
           </Card>
        )}
      </div>
    </div>
  )
}
