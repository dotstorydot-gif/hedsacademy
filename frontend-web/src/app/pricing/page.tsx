"use client"

import { useState, useEffect } from "react"
import { Check, Zap, ShieldCheck, Globe, Loader2, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

interface Plan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number | null
  max_courses: number
  student_course_limit: number
  is_active: boolean
  sort_order: number
}

const PLAN_STYLES = [
  { gradient: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20", accent: "text-blue-500", icon: Zap, badge: null },
  { gradient: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/30", accent: "text-purple-500", icon: ShieldCheck, badge: "Most Popular" },
  { gradient: "from-green-500/10 to-green-500/5", border: "border-green-500/20", accent: "text-green-500", icon: Globe, badge: null },
]

export default function PricingPage() {
  const supabase = createClient()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        setPlans(data ?? [])
        setLoading(false)
      })
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand-yellow" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Header */}
      <div className="pt-24 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <span className="size-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_#ffd700]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Choose Your Mission Tier</span>
        </div>
        <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-6">
          Select Your <span className="text-brand-yellow">Plan</span>
        </h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest max-w-lg mx-auto mb-10">
          Subscribe to access multiple courses, or enroll in individual courses.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5">
          {(["monthly", "yearly"] as const).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                billing === b ? "bg-brand-yellow text-black shadow-lg" : "text-white/50 hover:text-white"
              )}
            >
              {b}
              {b === "yearly" && <span className="ml-2 text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const style = PLAN_STYLES[i % PLAN_STYLES.length]
            const price = billing === "yearly" && plan.price_yearly
              ? (plan.price_yearly / 12).toFixed(0)
              : plan.price_monthly
            const Icon = style.icon

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-3xl border-2 bg-gradient-to-b p-0.5 transition-all hover:-translate-y-1",
                  style.gradient,
                  style.border,
                  style.badge ? "ring-1 ring-brand-yellow/30 shadow-[0_0_40px_rgba(255,215,0,0.1)]" : ""
                )}
              >
                {style.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-yellow text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="size-3 fill-black" /> {style.badge}
                  </div>
                )}

                <div className="bg-[#070707] rounded-[22px] p-8 h-full flex flex-col">
                  {/* Plan header */}
                  <div className="mb-6">
                    <div className={cn("size-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5", style.badge ? "bg-brand-yellow/10" : "")}>
                      <Icon className={cn("size-6", style.accent)} />
                    </div>
                    <h3 className="font-heading font-black text-xl uppercase tracking-tighter">{plan.name}</h3>
                    <p className="text-white/40 text-xs mt-2 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-black font-heading">${price}</span>
                      <span className="text-white/40 text-sm font-bold mb-2">/mo</span>
                    </div>
                    {billing === "yearly" && plan.price_yearly && (
                      <p className="text-[10px] text-green-400 font-black uppercase tracking-widest mt-1">
                        Billed ${plan.price_yearly}/year — Save ${(plan.price_monthly * 12 - plan.price_yearly).toFixed(0)}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3.5 flex-1 mb-8">
                    {[
                      { label: `${plan.student_course_limit === 999 ? "Unlimited" : plan.student_course_limit} courses per subscription`, highlight: true },
                      { label: "Access to all enrolled courses", highlight: false },
                      { label: "Progress tracking & certificates", highlight: false },
                      { label: "Discussion boards", highlight: false },
                      { label: "Mobile access", highlight: false },
                      ...(i >= 1 ? [{ label: "Live session access", highlight: false }] : []),
                      ...(i >= 2 ? [{ label: "Priority support", highlight: false }] : []),
                    ].map((feature, fi) => (
                      <div key={fi} className="flex items-start gap-3">
                        <div className={cn(
                          "size-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          feature.highlight ? "bg-brand-yellow/20" : "bg-white/5"
                        )}>
                          <Check className={cn("size-2.5", feature.highlight ? "text-brand-yellow" : "text-white/40")} />
                        </div>
                        <span className={cn("text-xs font-bold leading-relaxed", feature.highlight ? "text-white" : "text-white/50")}>
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/auth/register?plan=${plan.id}&billing=${billing}`}
                    className={cn(
                      "w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg",
                      style.badge
                        ? "bg-brand-yellow text-black hover:bg-white"
                        : "bg-white/10 text-white hover:bg-white hover:text-black border border-white/10"
                    )}
                  >
                    Get Started <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Individual enrollment note */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white/3 border border-white/10 rounded-2xl px-8 py-5">
            <p className="text-white/60 text-sm font-bold">
              Not ready to subscribe? <span className="text-white">Enroll in individual courses</span> from our{" "}
              <a href="/#courses" className="text-brand-yellow hover:underline">course catalog</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
