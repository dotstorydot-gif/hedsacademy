"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, ShieldCheck, Share2, Copy, Check, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

interface Certificate {
  id: string
  title: string
  issuedBy: string
  date: string
  grade: string
  id_hash: string
}

export default function StudentCertificatesPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("Academic Cadet")
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  
  useEffect(() => {
    setIsMounted(true)
    const client = createClient()
    
    client.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Academic Cadet")
        
        client.from('users').select('full_name').eq('id', user.id).single()
          .then(({ data }) => {
             if (data?.full_name) setUserName(data.full_name)
          })
      }
    })
  }, [])

  const certificates: Certificate[] = [
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

  const generateCertificateSVG = (cert: Certificate, studentName: string) => {
    const width = 1400
    const height = 1000
    
    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0a0a0a" />
        
        <!-- Premium Industrial Textures -->
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.05"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <!-- Outer Frame -->
        <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="#FFD700" stroke-width="1" stroke-opacity="0.1" />
        <rect x="60" y="60" width="${width - 120}" height="${height - 120}" fill="none" stroke="#FFD700" stroke-width="4" stroke-opacity="0.05" />
        
        <!-- Corner Bolts -->
        <circle cx="60" cy="60" r="8" fill="#FFD700" fill-opacity="0.2" />
        <circle cx="${width - 60}" cy="60" r="8" fill="#FFD700" fill-opacity="0.2" />
        <circle cx="60" cy="${height - 60}" r="8" fill="#FFD700" fill-opacity="0.2" />
        <circle cx="${width - 60}" cy="${height - 60}" r="8" fill="#FFD700" fill-opacity="0.2" />

        <!-- Accent Lines -->
        <line x1="0" y1="150" x2="${width}" y2="150" stroke="#FFD700" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="10 10" />
        <line x1="0" y1="${height - 150}" x2="${width}" y2="${height - 150}" stroke="#FFD700" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="10 10" />

        <!-- Radial Center Glow -->
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.08" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#centerGlow)" />

        <!-- Text Content -->
        <g transform="translate(${width/2}, 250)">
          <text text-anchor="middle" fill="#FFD700" font-family="monospace" font-weight="900" font-size="14" letter-spacing="15" opacity="0.6">ACADEMIC EXCELLENCE DISPATCH</text>
        </g>

        <g transform="translate(${width/2}, 340)">
          <text text-anchor="middle" fill="#FFFFFF" font-family="Arial Black, sans-serif" font-weight="900" font-size="24" letter-spacing="4" opacity="0.3">UPON VERIFICATION OF ALL MISSION OBJECTIVES</text>
        </g>

        <g transform="translate(${width/2}, 480)">
          <text text-anchor="middle" fill="#FFFFFF" font-family="Arial Black, Helvetica, sans-serif" font-weight="950" font-size="110" letter-spacing="-4">${studentName.toUpperCase()}</text>
        </g>

        <g transform="translate(${width/2}, 580)">
          <text text-anchor="middle" fill="#FFD700" font-family="Arial, sans-serif" font-weight="900" font-size="18" letter-spacing="8" opacity="0.5">HAS BEEN CONFERRED THE CERTIFICATION OF</text>
        </g>

        <g transform="translate(${width/2}, 680)">
          <text text-anchor="middle" fill="#FFFFFF" font-family="Times New Roman, serif" font-weight="900" font-size="72" font-style="italic" letter-spacing="2">${cert.title.toUpperCase()}</text>
        </g>

        <!-- Footer Grid -->
        <g transform="translate(150, 850)">
          <text fill="#FFD700" font-family="monospace" font-weight="900" font-size="12" letter-spacing="4" opacity="0.4">COMMANDING_AUTHORITY</text>
          <text y="40" fill="#FFFFFF" font-family="Arial Black, sans-serif" font-weight="900" font-size="22">${cert.issuedBy.toUpperCase()}</text>
        </g>

        <g transform="translate(${width/2}, 850)" text-anchor="middle">
          <text fill="#FFD700" font-family="monospace" font-weight="900" font-size="12" letter-spacing="4" opacity="0.4">DISPATCH_ID</text>
          <text y="40" fill="#FFFFFF" font-family="monospace" font-weight="900" font-size="22">${cert.id}</text>
        </g>

        <g transform="translate(${width - 400}, 850)">
          <text fill="#FFD700" font-family="monospace" font-weight="900" font-size="12" letter-spacing="4" opacity="0.4">VALIDATION_PULSE</text>
          <text y="40" fill="#FFFFFF" font-family="Arial Black, sans-serif" font-weight="900" font-size="22">${cert.date.toUpperCase()}</text>
        </g>

        <!-- Security Seal -->
        <g transform="translate(${width - 150}, 150)">
          <path d="M 0,-80 L 20,-20 L 80,0 L 20,20 L 0,80 L -20,20 L -80,0 L -20,-20 Z" fill="none" stroke="#FFD700" stroke-width="1" stroke-opacity="0.2" />
          <circle r="40" fill="none" stroke="#FFD700" stroke-width="2" stroke-opacity="0.3" />
          <text text-anchor="middle" y="5" fill="#FFD700" font-family="Arial Black, sans-serif" font-size="10" font-weight="900" opacity="0.5">HEDS</text>
        </g>

        <!-- Micro Text -->
        <text x="60" y="${height - 60}" fill="#FFFFFF" font-family="monospace" font-size="8" opacity="0.1">VERIFY: https://heds.academy/v/${cert.id_hash.substring(0, 12)}</text>
      </svg>
    `
  }

  const handleDownload = async (cert: Certificate) => {
    setIsDownloading(cert.id)
    const svgString = generateCertificateSVG(cert, userName)
    
    const canvas = document.createElement('canvas')
    canvas.width = 1400 * 2 
    canvas.height = 1000 * 2
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `HEDS_CREDENTIAL_${cert.id}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
      setIsDownloading(null)
    }
    img.src = url
  }

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/verify/${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  if (!isMounted) return null

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
                    onClick={() => handleDownload(cert)}
                    disabled={isDownloading === cert.id}
                    className="flex-1 h-16 bg-white text-black font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl hover:bg-brand-yellow hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 shadow-2xl disabled:opacity-50"
                  >
                     {isDownloading === cert.id ? (
                       <Loader2 className="size-5 animate-spin" />
                     ) : (
                       <Download className="size-5" />
                     )} 
                     Download
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
