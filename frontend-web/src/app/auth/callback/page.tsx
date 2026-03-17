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
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.search.split('code=')[1]?.split('&')[0] || ''
      )

      if (error) {
        console.error('Error exchanging code for session:', error.message)
        router.push('/auth/login?error=Authentication failed')
      } else {
        router.push('/student') // Or check role and redirect
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
