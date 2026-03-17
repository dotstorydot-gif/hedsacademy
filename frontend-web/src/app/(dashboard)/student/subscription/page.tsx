"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, CreditCard, BookOpen, CheckCircle, AlertCircle, ChevronRight, Calendar, Zap, ShieldCheck, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SubscriptionData {
  id: string
  status: string
  billing_cycle: string
  courses_used: number
  current_period_end: string
  subscription_plans: {
    name: string
    description: string
    price_monthly: number
    price_yearly: number | null
    student_course_limit: number
  }
}

interface CourseAccess {
  id: string
  access_type: string
  granted_at: string
  courses: {
    id: string
    title: string
    thumbnail_url: string | null
  }
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  Starter: <Zap className="size-5 text-blue-500" />,
  Pro: <ShieldCheck className="size-5 text-purple-500" />,
  Enterprise: <Globe className="size-5 text-green-500" />,
}

export default function StudentSubscriptionPage() {
  const supabase = createClient()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [courseAccess, setCourseAccess] = useState<CourseAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const load = useCallback(async (uid: string) => {
    const [subRes, accessRes] = await Promise.all([
      supabase
        .from("student_subscriptions")
        .select("*, subscription_plans(name, description, price_monthly, price_yearly, student_course_limit)")
        .eq("student_id", uid)
        .eq("status", "active")
        .maybeSingle(),
      supabase
        .from("subscription_course_access")
        .select("id, access_type, granted_at, courses(id, title, thumbnail_url)")
        .eq("student_id", uid)
        .order("granted_at", { ascending: false })
        .limit(10),
    ])

    setSubscription(subRes.data as any)
    const formattedAccess = (accessRes.data ?? []).map((item: any) => ({
      ...item,
      courses: Array.isArray(item.courses) ? item.courses[0] : item.courses
    }))
    setCourseAccess(formattedAccess as CourseAccess[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        load(data.user.id)
      } else {
        setLoading(false)
      }
    })
  }, [supabase, load])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="size-12 text-muted-foreground" />
        <p className="font-bold text-muted-foreground">Please log in to view your subscription.</p>
        <Button asChild><Link href="/auth/login">Log In</Link></Button>
      </div>
    )
  }

  const plan = subscription?.subscription_plans

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">My Subscription</h2>
        <p className="text-muted-foreground mt-1">Manage your plan and course access.</p>
      </div>

      {subscription && plan ? (
        <>
          {/* Current Plan Card */}
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-muted/10 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="size-14 rounded-2xl bg-background border-2 shadow-md flex items-center justify-center">
                    {PLAN_ICONS[plan.name] ?? <ShieldCheck className="size-6 text-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{plan.name} Plan</h3>
                      <Badge className="bg-green-500 text-white text-[9px] font-black uppercase tracking-widest">
                        {subscription.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                      {subscription.billing_cycle === "yearly" && plan.price_yearly
                        ? `$${plan.price_yearly}/year`
                        : `$${plan.price_monthly}/month`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="p-4 rounded-2xl bg-background border">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Course Slots Used</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black">{subscription.courses_used}</span>
                      <span className="text-muted-foreground font-bold mb-1">/ {plan.student_course_limit === 999 ? "∞" : plan.student_course_limit}</span>
                    </div>
                    {plan.student_course_limit !== 999 && (
                      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", subscription.courses_used / plan.student_course_limit > 0.8 ? "bg-red-500" : "bg-primary")}
                          style={{ width: `${Math.min(100, (subscription.courses_used / plan.student_course_limit) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span className="font-bold">Renews {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
                <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
                  Upgrade Plan <ChevronRight className="size-3.5" />
                </Link>
                <Button variant="outline" size="sm" className="font-black text-[10px] uppercase tracking-widest">
                  <CreditCard className="size-3.5 mr-2" /> Billing History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Access */}
          <div>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Courses in My Plan</h3>
            {courseAccess.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="p-10 text-center">
                  <BookOpen className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="font-bold text-muted-foreground text-sm">No courses added to your plan yet.</p>
                  <Link href="/#courses" className="mt-4 inline-block text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Browse & Enroll →
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {courseAccess.map(access => (
                  <Link key={access.id} href={`/student/courses/${access.courses.id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border/50 hover:border-primary/30 bg-muted/5 transition-all group">
                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <BookOpen className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm uppercase tracking-tight truncate">{access.courses.title}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">
                        {access.access_type === "subscription" ? "Via Subscription" : "Individual Purchase"} •{" "}
                        {new Date(access.granted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={access.access_type === "subscription" ? "default" : "secondary"} className="text-[9px] font-black uppercase tracking-widest shrink-0">
                      {access.access_type === "subscription" ? <CheckCircle className="size-3 mr-1 inline" /> : <CreditCard className="size-3 mr-1 inline" />}
                      {access.access_type === "subscription" ? "Plan" : "Purchased"}
                    </Badge>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* No subscription */
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center space-y-6">
            <div className="size-16 rounded-3xl bg-muted/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Subscribe to a plan to access multiple courses, or enroll in individual courses from the catalog.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="font-black uppercase tracking-widest text-xs">
                <Link href="/pricing">View Subscription Plans</Link>
              </Button>
              <Button variant="outline" asChild className="font-black uppercase tracking-widest text-xs">
                <Link href="/#courses">Browse Individual Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
