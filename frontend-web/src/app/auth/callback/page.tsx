'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const code = window.location.search.split('code=')[1]?.split('&')[0] || ''
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Error exchanging code for session:', error.message)
        router.push('/auth/login?error=Authentication failed')
        return
      }

      if (data?.user) {
        const metadata = data.user.user_metadata
        const role = metadata?.role
        const plan = metadata?.plan
        const billing = metadata?.billing
        const redirect = metadata?.redirect

        // If a plan was selected during registration, set up the subscription
        if (role === 'student' && plan) {
          // Check if subscription already exists to avoid duplicates
          const { data: existingSub } = await supabase
            .from('student_subscriptions')
            .select('id')
            .eq('student_id', data.user.id)
            .maybeSingle()

          if (!existingSub) {
            await supabase.from('student_subscriptions').insert({
              student_id: data.user.id,
              plan_id: plan,
              status: 'active',
              billing_cycle: billing || 'monthly',
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
          }
        }

        // Redirect to intended destination or role-based dashboard
        if (redirect) {
          router.push(redirect)
        } else {
          router.push(role === 'instructor' ? '/instructor' : '/student')
        }
      }
    }

    handleCallback()
  }, [router, supabase.auth])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
