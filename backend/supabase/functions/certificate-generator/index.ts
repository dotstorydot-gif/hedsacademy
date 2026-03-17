import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Certificate Generator Initialized")

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { enrollment_id } = await req.json()

    // 1. Fetch enrollment details
    const { data: enrollment, error: enrollError } = await supabaseClient
      .from('enrollments')
      .select('*, user:users(*), course:courses(*)')
      .eq('id', enrollment_id)
      .single()

    if (enrollError || !enrollment) throw new Error("Enrollment not found")

    // 2. Mock certificate generation (in production, use a PDF library or service)
    const certificateUrl = `https://storage.hedsacademy.com/certificates/${enrollment_id}.pdf`
    
    // 3. Save to certificates table
    const { error: certError } = await supabaseClient
      .from('certificates')
      .insert({
        student_id: enrollment.user_id,
        course_id: enrollment.course_id,
        certificate_url: certificateUrl,
        issue_date: new Date().toISOString()
      })

    if (certError) throw certError

    // 4. Notify user
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: enrollment.user_id,
        title: 'Certification Achievement',
        content: `Outstanding work! You have completed "${enrollment.course.title}". Your certificate is ready.`,
        type: 'system'
      })

    return new Response(JSON.stringify({ success: true, url: certificateUrl }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
