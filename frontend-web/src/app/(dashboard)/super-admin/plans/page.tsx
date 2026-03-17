"use client"

import { Plus, Edit2, Trash2, Check, ShieldCheck, Zap, Globe, Loader2, Save, X, Users, BookOpen, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number | null
  max_instructors: number
  max_students: number
  max_courses: number
  student_course_limit: number
  is_active: boolean
  sort_order: number
  _active_count?: number
}

const PLAN_ICONS = [
  <Zap key="z" className="size-5 text-blue-500" />,
  <ShieldCheck key="s" className="size-5 text-purple-500" />,
  <Globe key="g" className="size-5 text-green-500" />,
]

export default function PlanManagementPage() {
  const supabase = createClient()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: "", description: "", price_monthly: 29, price_yearly: null as number | null,
    max_instructors: 5, max_students: 200, max_courses: 20, student_course_limit: 5,
  })

  const loadPlans = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("subscription_plans")
      .select(`*, academy_subscriptions(count)`)
      .order("sort_order", { ascending: true })
    if (data) {
      setPlans(data.map((p: Plan & { academy_subscriptions: { count: number }[] }) => ({
        ...p,
        _active_count: p.academy_subscriptions?.[0]?.count ?? 0,
      })))
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadPlans() }, [loadPlans])

  const savePlan = async (plan: Plan) => {
    setSavingId(plan.id)
    await supabase.from("subscription_plans").update({
      name: plan.name,
      description: plan.description,
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      max_instructors: plan.max_instructors,
      max_students: plan.max_students,
      max_courses: plan.max_courses,
      student_course_limit: plan.student_course_limit,
      is_active: plan.is_active,
    }).eq("id", plan.id)
    setSavingId(null)
    setEditingPlan(null)
    loadPlans()
  }

  const createPlan = async () => {
    const { error } = await supabase.from("subscription_plans").insert({
      ...newPlan,
      sort_order: plans.length + 1,
    })
    if (!error) {
      setShowCreateForm(false)
      setNewPlan({ name: "", description: "", price_monthly: 29, price_yearly: null, max_instructors: 5, max_students: 200, max_courses: 20, student_course_limit: 5 })
      loadPlans()
    }
  }

  const toggleActive = async (plan: Plan) => {
    await supabase.from("subscription_plans").update({ is_active: !plan.is_active }).eq("id", plan.id)
    loadPlans()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Subscription Plans</h2>
          <p className="text-muted-foreground mt-1">Set pricing tiers and configure how many courses each student subscription includes.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="shadow-lg">
          <Plus className="mr-2 size-4" /> Create New Plan
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Plans", value: plans.length, icon: ShieldCheck },
          { label: "Active Plans", value: plans.filter(p => p.is_active).length, icon: Check },
          { label: "Total Academies Subscribed", value: plans.reduce((s, p) => s + (p._active_count ?? 0), 0), icon: Building2 },
        ].map((s, i) => (
          <Card key={i} className="border bg-muted/10">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Plan Form */}
      {showCreateForm && (
        <Card className="border-2 border-primary/30 shadow-xl">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              <span>Create New Plan</span>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}><X className="size-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Plan Name</label>
                <Input value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} placeholder="e.g. Professional" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Monthly Price ($)</label>
                <Input type="number" value={newPlan.price_monthly} onChange={e => setNewPlan({ ...newPlan, price_monthly: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Description</label>
              <Textarea value={newPlan.description} onChange={e => setNewPlan({ ...newPlan, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "max_instructors", label: "Max Instructors" },
                { key: "max_students", label: "Max Students" },
                { key: "max_courses", label: "Max Published Courses" },
                { key: "student_course_limit", label: "Courses Per Student Sub" },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">{field.label}</label>
                  <Input
                    type="number"
                    value={(newPlan as Record<string, number | string | null>)[field.key] as number}
                    onChange={e => setNewPlan({ ...newPlan, [field.key]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/5 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            <Button onClick={createPlan} disabled={!newPlan.name}><Save className="mr-2 size-4" />Create Plan</Button>
          </CardFooter>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => {
          const isEditing = editingPlan?.id === plan.id
          const displayPlan = isEditing ? editingPlan! : plan

          return (
            <Card key={plan.id} className={cn(
              "border-2 shadow-sm transition-all overflow-hidden",
              plan.is_active ? "hover:border-primary/50" : "opacity-60"
            )}>
              <CardHeader className="text-center pb-3 bg-muted/10">
                <div className="flex justify-between items-center mb-2">
                  <div className="p-2 rounded-xl bg-background border shadow-sm">
                    {PLAN_ICONS[i % PLAN_ICONS.length]}
                  </div>
                  <Badge variant={plan.is_active ? "default" : "secondary"} className="text-[10px] font-black uppercase tracking-widest cursor-pointer" onClick={() => toggleActive(plan)}>
                    {plan.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {isEditing ? (
                  <Input value={displayPlan.name} onChange={e => setEditingPlan({ ...editingPlan!, name: e.target.value })} className="text-center font-black text-lg" />
                ) : (
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                )}
                {isEditing ? (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-muted-foreground font-bold">$</span>
                    <Input type="number" value={displayPlan.price_monthly} onChange={e => setEditingPlan({ ...editingPlan!, price_monthly: Number(e.target.value) })} className="w-24 font-black text-2xl text-center" />
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                ) : (
                  <div className="text-3xl font-black mt-1">
                    ${plan.price_monthly}<span className="text-sm font-medium text-muted-foreground">/mo</span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-5 space-y-4">
                {isEditing ? (
                  <Textarea
                    value={displayPlan.description}
                    onChange={e => setEditingPlan({ ...editingPlan!, description: e.target.value })}
                    rows={2}
                    placeholder="Plan description..."
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                )}

                <div className="space-y-3 text-sm">
                  {[
                    { label: "Instructors", key: "max_instructors" as const, icon: Users },
                    { label: "Students", key: "max_students" as const, icon: Users },
                    { label: "Published Courses", key: "max_courses" as const, icon: BookOpen },
                    { label: "Courses Per Student Sub", key: "student_course_limit" as const, icon: BookOpen },
                  ].map(field => (
                    <div key={field.key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Check className="size-3.5 text-green-500 shrink-0" />
                        <span className="font-medium text-xs">{field.label}</span>
                      </div>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={displayPlan[field.key]}
                          onChange={e => setEditingPlan({ ...editingPlan!, [field.key]: Number(e.target.value) })}
                          className="w-20 h-7 text-xs text-right"
                        />
                      ) : (
                        <span className="font-black text-xs">{field.label === "Courses Per Student Sub" ? `${plan[field.key]} courses` : plan[field.key].toLocaleString()}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <span>Academies Subscribed</span>
                    <Badge variant="outline">{plan._active_count ?? 0} Active</Badge>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/10 grid grid-cols-2 gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setEditingPlan(null)}>
                      <X className="mr-1 size-3" /> Cancel
                    </Button>
                    <Button size="sm" onClick={() => savePlan(editingPlan!)} disabled={savingId === plan.id}>
                      {savingId === plan.id ? <Loader2 className="size-3 animate-spin mr-1" /> : <Save className="mr-1 size-3" />} Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="font-bold" onClick={() => setEditingPlan({ ...plan })}>
                      <Edit2 className="mr-2 size-3" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 font-bold" onClick={() => toggleActive(plan)}>
                      {plan.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          💡 <strong>Student Course Limit</strong> — Controls how many courses a student may enroll in using a subscription (not per-course payment). Students can always individually purchase additional courses beyond their subscription limit.
        </p>
      </div>
    </div>
  )
}
