import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Meeting Helper Initialized")

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { session_id, action } = await req.json()

    if (action === 'get_access_token') {
      const { data: session } = await supabaseClient
        .from('live_sessions')
        .select('*')
        .eq('id', session_id)
        .single()
      
      if (!session) throw new Error("Session not found")

      // Logic to generate Jitsi/Meeting token
      // This is a placeholder for actual JWT logic
      const token = `heds_token_${Math.random().toString(36).substring(7)}`

      return new Response(JSON.stringify({ token }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
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
