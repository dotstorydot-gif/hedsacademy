'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role || 'student'
      const redirectMap: Record<string, string> = {
        'super_admin': '/super-admin',
        'academy_admin': '/academy-admin',
        'instructor': '/instructor',
        'student': '/student',
        'support': '/support'
      }

      router.push(redirectMap[role] || '/student')
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
     await supabase.auth.signInWithOAuth({
        provider,
        options: {
           redirectTo: `${window.location.origin}/auth/callback`
        }
     })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#050505] overflow-hidden relative font-sans">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-yellow blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-yellow blur-[150px]" />
      </div>

      <div className="w-full max-w-md z-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Logo size="lg" variant="white" />
          <p className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-black">Secure Terminal Access</p>
        </div>

        <Card className="shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2 border-white/5 bg-black/60 backdrop-blur-3xl overflow-hidden rounded-3xl">
          <CardHeader className="pt-8 pb-4">
            <h2 className="text-2xl font-heading font-black text-center uppercase tracking-tighter text-white">Sign In</h2>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Identity UID</label>
                <Input 
                  type="email" 
                  placeholder="name@heds.academy" 
                  className="h-14 bg-white/5 border-2 border-white/5 focus:border-brand-yellow transition-all rounded-2xl text-white placeholder:text-white/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Credential Pass</label>
                  <Button variant="link" className="h-auto p-0 text-[10px] uppercase font-black tracking-widest text-brand-yellow hover:text-white transition-colors">Recovery</Button>
                </div>
                <Input 
                  type="password" 
                  className="h-14 bg-white/5 border-2 border-white/5 focus:border-brand-yellow transition-all rounded-2xl text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              {error && (
                <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-[11px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-left-2">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-14 text-xs font-black uppercase tracking-[0.3em] bg-white text-black hover:bg-brand-yellow transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] rounded-2xl active:scale-[0.98]" disabled={loading}>
                {loading ? 'INITIALIZING...' : 'Establish Connection'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.4em]">
                <span className="bg-black/20 px-4 text-white/20 backdrop-blur-md">External Handshake</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-14 border-2 border-white/5 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/10 hover:border-brand-yellow/50 transition-all flex items-center justify-center gap-3"
                onClick={() => handleSocialLogin('google')}
              >
                 <svg className="size-4" viewBox="0 0 24 24">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.28.81-.56z" fill="#FBBC05" />
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                 </svg>
                 Google
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-2 border-white/5 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/10 hover:border-brand-yellow/50 transition-all flex items-center justify-center gap-3"
                onClick={() => handleSocialLogin('apple')}
              >
                 <svg className="size-4 fill-current" viewBox="0 0 24 24">
                   <path d="M17.05 20.28c-.96.95-2.44 1.78-3.99 1.77-1.55-.01-2.09-.44-3.59-.44-1.51 0-2.23.44-3.59.44-1.53.01-3.02-.83-3.99-1.77-1.99-1.93-1.99-5.04 0-6.97.96-.95 2.44-1.78 3.99-1.77 1.55.01 2.09.43 3.59.43 1.51 0 2.23-.43 3.59-.43 1.53-.01 3.02.83 3.99 1.77 1.99 1.93 1.99 5.04 0 6.97zM12 2c1.1-.01 2.5.4 3.3 1.3.8.9 1.2 2.2 1.1 3.3-1.1.01-2.5-.4-3.3-1.3-.8-.9-1.2-2.2-1.1-3.3z" />
                 </svg>
                 Apple
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-12 pt-0">
            <p className="text-[10px] text-center text-white/30 uppercase font-black tracking-[0.2em] px-10">
              No academy association? <Button variant="link" className="h-auto p-0 text-[10px] uppercase font-black tracking-widest text-brand-yellow hover:text-white" onClick={() => router.push('/auth/register')}>Apply for Credentials</Button>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20" />
    </div>
  )
}
