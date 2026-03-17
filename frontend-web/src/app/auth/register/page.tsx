'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

function RegisterContent() {
  const [role, setRole] = useState<'student' | 'academy_admin'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [academyName, setAcademyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams?.get('plan')
  const billing = searchParams?.get('billing')
  const redirect = searchParams?.get('redirect')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          role: role,
          full_name: email.split('@')[0], // Placeholder for full name
          plan: plan,
          billing: billing,
          redirect: redirect,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. If Academy Admin, create the academy
    if (role === 'academy_admin' && authData.user) {
       const { error: academyError } = await supabase
         .from('academies')
         .insert({
           name: academyName,
           admin_id: authData.user.id,
           slug: academyName.toLowerCase().replace(/\s+/g, '-'),
         })

       if (academyError) {
         setError(`Account created, but failed to create academy: ${academyError.message}`)
         setLoading(false)
         return
       }
    }

    setLoading(false)
    router.push('/auth/login?message=Check your email to confirm your account')
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Join HEDS Academy and start your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="academy_admin">Academy Admin</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {role === 'academy_admin' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Academy Name</label>
                <Input 
                  placeholder="My Expert Academy" 
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  required 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleSocialLogin('google')}>
               Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialLogin('apple')}>
               Apple
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-muted-foreground">
            Already have an account? <Button variant="link" className="h-auto p-0 text-xs text-primary" onClick={() => router.push('/auth/login')}>Login</Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
