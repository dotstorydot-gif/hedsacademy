import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Subscription Trigger Function Initialized")

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record, type } = await req.json()

    if (type === 'INSERT' || type === 'UPDATE') {
      const { user_id, plan_id, status } = record

      if (status === 'active') {
        // Update user role if necessary or just log
        // For HEDS Academy, active subscription might unlock 'academy_admin' dashboard
        console.log(`User ${user_id} now has active subscription ${plan_id}`)
        
        // Add a notification for the user
        await supabaseClient
          .from('notifications')
          .insert({
            user_id: user_id,
            title: 'Subscription Activated',
            content: `Welcome to HEDS Academy! Your access to the chosen plan is now active.`,
            type: 'system'
          })
      }
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
