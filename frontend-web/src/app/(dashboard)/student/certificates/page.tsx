"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, ShieldCheck, Share2, ExternalLink } from "lucide-react"

export default function StudentCertificatesPage() {
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Academic Credentials</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Verified Achievement Registry</p>
        </div>
        
        <Button variant="outline" className="h-11 border-2 font-black uppercase text-[10px] tracking-widest gap-2">
          <ShieldCheck className="size-4" /> Verify Protocol
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <Card key={cert.id} className="group border-2 border-black/5 dark:border-white/5 bg-black text-white rounded-3xl overflow-hidden relative transition-all hover:border-brand-yellow/50 hover:shadow-2xl hover:shadow-brand-yellow/10">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <Award className="size-48" />
            </div>
            
            <CardHeader className="pb-4 relative z-10">
               <div className="flex justify-between items-start mb-6">
                  <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Award className="size-6 text-brand-yellow" />
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-yellow block mb-1">Status: Verified</span>
                    <span className="text-[8px] font-bold text-white/40 block uppercase tracking-tighter font-mono">{cert.id}</span>
                  </div>
               </div>
               <CardTitle className="text-xl font-black tracking-tight leading-tight group-hover:text-brand-yellow transition-colors italic">
                  {cert.title}
               </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 relative z-10">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Authority</p>
                     <p className="text-[10px] font-bold">{cert.issuedBy}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Grade</p>
                     <p className="text-[10px] font-bold text-brand-yellow">{cert.grade}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Issue Date</p>
                     <p className="text-[10px] font-bold">{cert.date}</p>
                  </div>
               </div>

               <div className="flex gap-2 pt-2">
                  <Button className="flex-1 h-11 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brand-yellow transition-all gap-2">
                     <Download className="size-3" /> Download
                  </Button>
                  <Button variant="outline" size="icon" className="size-11 border-white/10 rounded-xl hover:bg-white/5">
                     <Share2 className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-11 border-white/10 rounded-xl hover:bg-white/5">
                     <ExternalLink className="size-4" />
                  </Button>
               </div>
            </CardContent>
            
            <div className="px-6 py-4 bg-white/5 border-t border-white/5">
               <p className="text-[8px] font-mono text-white/20 truncate">HASH_DISPATCH: {cert.id_hash}</p>
            </div>
          </Card>
        ))}

        {certificates.length === 0 && (
           <Card className="md:col-span-2 lg:col-span-3 border-2 border-dashed border-black/5 dark:border-white/5 bg-muted/5 rounded-3xl flex flex-col items-center justify-center p-20 text-center gap-6">
              <div className="size-20 rounded-full bg-muted/10 flex items-center justify-center border-2 border-muted">
                 <Award className="size-10 text-muted-foreground/20" />
              </div>
              <div className="space-y-2">
                 <h3 className="font-heading font-black text-xl uppercase tracking-tighter">No Credentials Issued</h3>
                 <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto">
                    Complete your active missions to earn verified HEDS Academy certificates.
                 </p>
              </div>
              <Button className="h-11 px-8 font-black uppercase text-[10px] tracking-widest bg-black text-white dark:bg-white dark:text-black rounded-xl">
                 Explore Courses
              </Button>
           </Card>
        )}
      </div>
    </div>
  )
}
