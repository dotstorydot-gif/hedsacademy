import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Guard: Students should not be in the instructor dashboard
  if (profile?.role === 'student') {
    return redirect('/student')
  }

  return <>{children}</>
}
