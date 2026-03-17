"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Loader2, BookOpen, CheckCircle, CreditCard, ShieldCheck, Users, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  price: number
  thumbnail_url: string | null
  level: string
  duration_hours: number | null
  sessions_count: number | null
  benefits: string[]
}

interface StudentSub {
  courses_used: number
  subscription_plans: {
    name: string
    student_course_limit: number
  }
}

export default function CourseEnrollPage() {
  const { courseId } = useParams() as { courseId: string }
  const router = useRouter()
  const supabase = createClient()

  const [course, setCourse] = useState<Course | null>(null)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [subscription, setSubscription] = useState<StudentSub | null>(null)
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  const hasSubscriptionSlot = subscription
    ? subscription.courses_used < subscription.subscription_plans.student_course_limit
    : false

  const load = useCallback(async () => {
    const [{ data: courseData }, { data: { user: u } }] = await Promise.all([
      supabase.from("courses").select("id, title, description, price, thumbnail_url, level, duration_hours, sessions_count, benefits").eq("id", courseId).single(),
      supabase.auth.getUser(),
    ])

    setCourse(courseData)
    setUser(u ? { id: u.id, email: u.email ?? "" } : null)

    if (u) {
      const [subRes, enrollRes] = await Promise.all([
        supabase.from("student_subscriptions").select("courses_used, subscription_plans(name, student_course_limit)").eq("student_id", u.id).eq("status", "active").maybeSingle(),
        supabase.from("enrollments").select("id").eq("student_id", u.id).eq("course_id", courseId).maybeSingle(),
      ])
      setSubscription(subRes.data as StudentSub | null)
      setAlreadyEnrolled(!!enrollRes.data)
    }
    setLoading(false)
  }, [supabase, courseId])

  useEffect(() => { load() }, [load])

  const enrollWithSubscription = async () => {
    if (!user || !course) return
    setEnrolling(true)
    // Add to enrollments
    await supabase.from("enrollments").insert({ student_id: user.id, course_id: course.id })
    // Record subscription course access
    const { data: sub } = await supabase.from("student_subscriptions").select("id").eq("student_id", user.id).single()
    if (sub) {
      await supabase.from("subscription_course_access").insert({ student_id: user.id, course_id: course.id, subscription_id: sub.id, access_type: "subscription" })
      await supabase.from("student_subscriptions").update({ courses_used: (subscription?.courses_used ?? 0) + 1 }).eq("student_id", user.id)
    }
    router.push(`/student/courses/${course.id}`)
  }

  const enrollIndividual = async () => {
    // In production, this goes to payment gateway. For now, we enroll directly if price is 0.
    if (!user || !course) return
    if (course.price === 0) {
      setEnrolling(true)
      await supabase.from("enrollments").insert({ student_id: user.id, course_id: course.id })
      await supabase.from("subscription_course_access").insert({ student_id: user.id, course_id: course.id, access_type: "individual" })
      router.push(`/student/courses/${course.id}`)
    } else {
      // Redirect to payment (placeholder)
      router.push(`/checkout?course=${course.id}`)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="size-8 animate-spin" /></div>
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Course not found.</p></div>
  }

  // Not logged in — show auth gate
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-2 shadow-2xl">
          <CardContent className="p-10 text-center space-y-6">
            <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="size-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Sign In to Enroll</h2>
              <p className="text-muted-foreground text-sm">
                Create an account or log in to enroll in <strong>{course.title}</strong>.
              </p>
            </div>
            <div className="space-y-3">
              <Button className="w-full h-12 font-black uppercase tracking-widest text-xs" asChild>
                <Link href={`/auth/register?redirect=/courses/${courseId}/enroll`}>Create Account & Enroll</Link>
              </Button>
              <Button variant="outline" className="w-full h-12 font-black uppercase tracking-widest text-xs" asChild>
                <Link href={`/auth/login?redirect=/courses/${courseId}/enroll`}>Already have an account? Sign In</Link>
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              You&apos;ll be returned here after signing in.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Course Summary */}
        <div className="flex items-start gap-5">
          <div className="size-20 rounded-3xl bg-muted flex items-center justify-center shrink-0">
            <BookOpen className="size-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{course.level} Course</p>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-tight">{course.title}</h1>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{course.description}</p>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground font-bold">
              {course.duration_hours && <span>{course.duration_hours}h total</span>}
              {course.sessions_count && <span>{course.sessions_count} sessions</span>}
            </div>
          </div>
        </div>

        {alreadyEnrolled ? (
          <Card className="border-2 border-green-500/30 bg-green-500/5">
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle className="size-12 text-green-500 mx-auto" />
              <h3 className="text-xl font-black uppercase tracking-tight">You&apos;re Already Enrolled!</h3>
              <Button asChild className="font-black uppercase tracking-widest text-xs">
                <Link href={`/student/courses/${course.id}`}>Go to Course →</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-tighter">Choose Enrollment Method</h2>

            {/* Option 1: Use subscription slot */}
            {subscription ? (
              <Card className={cn("border-2 transition-all", hasSubscriptionSlot ? "border-primary/30 hover:border-primary/60" : "opacity-50 border-muted")}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="size-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight">Use Subscription Slot</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {subscription.subscription_plans.name} Plan — {subscription.courses_used}/{subscription.subscription_plans.student_course_limit === 999 ? "∞" : subscription.subscription_plans.student_course_limit} slots used
                        </p>
                        {!hasSubscriptionSlot && (
                          <p className="text-xs text-red-500 font-bold mt-1">No more slots available. Upgrade your plan.</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={enrollWithSubscription}
                      disabled={!hasSubscriptionSlot || enrolling}
                      className="font-black uppercase tracking-widest text-xs shrink-0"
                    >
                      {enrolling ? <Loader2 className="size-4 animate-spin" /> : "Enroll Free"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="size-5 text-muted-foreground" />
                    <div>
                      <p className="font-black text-sm">Subscribe for bulk course access</p>
                      <p className="text-xs text-muted-foreground">Get multiple courses for a flat monthly fee.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="font-black uppercase tracking-widest text-[10px] shrink-0">
                    <Link href="/pricing">View Plans</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Option 2: Individual purchase */}
            <Card className="border-2 border-muted/50 hover:border-primary/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                      <CreditCard className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">Individual Enrollment</p>
                      <p className="text-xs text-muted-foreground mt-1">One-time access to this course only.</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black">{course.price === 0 ? "Free" : `$${course.price}`}</p>
                    <Button
                      onClick={enrollIndividual}
                      disabled={enrolling}
                      variant={course.price === 0 ? "default" : "outline"}
                      size="sm"
                      className="mt-2 font-black uppercase tracking-widest text-[10px]"
                    >
                      {enrolling ? <Loader2 className="size-3 animate-spin" /> : course.price === 0 ? "Enroll Free" : "Purchase & Enroll"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
