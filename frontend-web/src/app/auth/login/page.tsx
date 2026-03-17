'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { useRouter } from 'next/navigation'
import { Github, Chrome } from 'lucide-react'

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

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-white dark:bg-black overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-yellow blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-yellow blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Logo size="lg" />
          <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-bold">Portal Access</p>
        </div>

        <Card className="shadow-2xl border-2 border-black/5 dark:border-white/5 bg-background/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <h2 className="text-xl font-heading font-black text-center uppercase tracking-wider">Sign In</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Account Email</label>
                <Input 
                  type="email" 
                  placeholder="name@academy.com" 
                  className="h-12 border-2 focus-visible:ring-brand-yellow focus-visible:border-brand-yellow transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                  <Button variant="link" className="h-auto p-0 text-[10px] uppercase font-black tracking-widest text-brand-dark-yellow">Forgot?</Button>
                </div>
                <Input 
                  type="password" 
                  className="h-12 border-2 focus-visible:ring-brand-yellow focus-visible:border-brand-yellow transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              {error && (
                <div className="p-3 bg-destructive/10 border-l-4 border-destructive text-destructive text-xs font-bold animate-in fade-in slide-in-from-left-2">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-xl transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? 'Processing...' : 'Authenticate'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/10 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                <span className="bg-background px-4 text-muted-foreground">Verified Login</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-11 border-2 font-bold text-xs" onClick={() => handleSocialLogin('google')}>
                 <Chrome className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="outline" className="h-11 border-2 font-bold text-xs" onClick={() => handleSocialLogin('apple')}>
                 <Github className="mr-2 h-4 w-4" /> Github
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-0">
            <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest">
              No account? <Button variant="link" className="h-auto p-0 text-[10px] uppercase font-black tracking-widest text-brand-dark-yellow" onClick={() => router.push('/auth/register')}>Establish Access</Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
