import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { Shield, Zap, Globe, Cpu } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-brand-yellow selection:text-black font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 h-20 flex items-center justify-between">
        <Logo variant="white" size="md" />
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-brand-yellow transition-colors">Infrastructure</Link>
          <Link href="#academies" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-brand-yellow transition-colors">Network</Link>
          <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 border-2 border-white/10 hover:border-brand-yellow transition-all rounded-xl">Terminal Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,rgba(5,5,5,0)_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="size-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_10px_#ffd700]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">System Version 2.0 Deployment Active</span>
          </div>

          <h1 className="font-heading font-black text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.8] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            ENGINEERING <br />
            <span className="text-brand-yellow">ACADEMIC</span> <br />
            EXCELLENCE.
          </h1>

          <p className="max-w-xl text-white/40 text-sm md:text-base font-medium leading-relaxed mb-12 uppercase tracking-widest px-4">
            The elite LMS framework for high-performance academies. <br />
            Zero latency. Industrial grade security. Premium execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6">
            <Button className="h-16 px-12 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-brand-yellow transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] group" asChild>
              <Link href="/auth/register">
                 Establish Academy
              </Link>
            </Button>
            <Button variant="outline" className="h-16 px-12 border-2 border-white/10 bg-transparent text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/5 transition-all" asChild>
              <Link href="/auth/login">Access Terminal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-[#080808] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Secure Core", desc: "Military grade data isolation and RLS security protocols.", icon: Shield },
              { title: "Edge Performance", desc: "Global CDN delivery with zero-latency streaming.", icon: Zap },
              { title: "Real-time Hub", desc: "Instant notifications and secure chat synchronization.", icon: Globe },
              { title: "AI Analytics", desc: "Deep performance tracking for cadre optimization.", icon: Cpu },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl border-2 border-white/5 bg-black/40 hover:border-brand-yellow/50 transition-all">
                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-yellow/10 transition-colors">
                  <f.icon className="size-6 text-brand-yellow" />
                </div>
                <h3 className="font-heading font-black text-xs uppercase tracking-widest mb-3">{f.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed font-medium uppercase tracking-[0.1em]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-50">
          <Logo variant="white" size="sm" />
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
            <Link href="/legal/privacy" className="hover:text-brand-yellow transition-colors">Privacy Protocol</Link>
            <Link href="/legal/terms" className="hover:text-brand-yellow transition-colors">Terms of Service</Link>
            <span>© 2026 HEDS ACADEMY GLOBAL</span>
          </div>
        </div>
      </footer>

      {/* Decorative Scanlines */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-50 mix-blend-overlay" />
    </div>
  )
}
