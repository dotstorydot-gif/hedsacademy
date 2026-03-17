import { Plus, Edit2, Trash2, Check, ShieldCheck, Zap, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PlanManagementPage() {
  const plans = [
    { 
      name: "Starter", 
      price: "$29", 
      instructors: 2, 
      students: 100, 
      courses: 5, 
      active: 42,
      icon: <Zap className="size-5 text-blue-500" />
    },
    { 
      name: "Pro", 
      price: "$99", 
      instructors: 10, 
      students: 1000, 
      courses: 50, 
      active: 85,
      icon: <ShieldCheck className="size-5 text-purple-500" />
    },
    { 
      name: "Enterprise", 
      price: "$299", 
      instructors: 100, 
      students: 10000, 
      courses: 500, 
      active: 15,
      icon: <Globe className="size-5 text-green-500" />
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Subscription Plans</h2>
          <p className="text-muted-foreground">Define your platform pricing and feature tiers.</p>
        </div>
        <Button className="shadow-lg">
          <Plus className="mr-2 size-4" /> Create New Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="border-2 shadow-sm hover:border-primary/50 transition-all overflow-hidden bg-card">
            <CardHeader className="text-center pb-2 bg-muted/20">
              <div className="flex justify-center mb-2">
                <div className="p-3 rounded-2xl bg-background border shadow-sm">
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="text-3xl font-black mt-2">
                {plan.price}<span className="text-sm font-medium text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="size-4 text-green-500" />
                  <span className="font-medium">{plan.instructors} Instructors</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="size-4 text-green-500" />
                  <span className="font-medium">{plan.students} Students</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="size-4 text-green-500" />
                  <span className="font-medium">{plan.courses} Live Courses</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                 <div className="flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <span>Performance</span>
                    <Badge variant="outline">{plan.active} Active</Badge>
                 </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="font-bold">
                <Edit2 className="mr-2 size-3" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 font-bold">
                <Trash2 className="mr-2 size-3" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
