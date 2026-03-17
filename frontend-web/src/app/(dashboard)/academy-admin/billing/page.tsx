import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, History, Zap, ShieldCheck, Globe } from "lucide-react"

export default function BillingPage() {
  const currentPlan = {
    name: "Starter",
    price: "$29",
    status: "Active",
    nextBilling: "April 17, 2026",
    usage: {
      instructors: { used: 1, limit: 2 },
      students: { used: 42, limit: 100 },
      courses: { used: 3, limit: 5 },
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Billing & Subscription</h2>
        <p className="text-muted-foreground">Manage your academy's plan, usage, and payments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2 border-2 border-primary/20 bg-primary/5 shadow-md">
           <CardHeader className="flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-xl font-bold">Current Plan: {currentPlan.name}</CardTitle>
                 <p className="text-sm text-muted-foreground mt-1">Next payment of {currentPlan.price} on {currentPlan.nextBilling}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30 py-1 px-3">
                 {currentPlan.status}
              </Badge>
           </CardHeader>
           <CardContent className="grid md:grid-cols-3 gap-6 pt-4">
              {Object.entries(currentPlan.usage).map(([key, value]) => (
                 <div key={key} className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{key}</p>
                    <div className="flex items-end justify-between">
                       <span className="text-2xl font-black">{value.used}</span>
                       <span className="text-sm text-muted-foreground">/ {value.limit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full">
                       <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${(value.used / value.limit) * 100}%` }} 
                       />
                    </div>
                 </div>
              ))}
           </CardContent>
           <CardFooter className="border-t pt-4">
              <Button className="w-full font-bold shadow-lg" size="lg">Upgrade Plan</Button>
           </CardFooter>
        </Card>

        <Card className="border-2 shadow-sm">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <History className="size-4" />
                 Recent Invoices
              </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              {[
                 { id: "INV-001", date: "Mar 17, 2026", amount: "$29.00" },
                 { id: "INV-002", date: "Feb 17, 2026", amount: "$29.00" },
              ].map((inv) => (
                 <div key={inv.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                    <div>
                       <p className="font-bold">{inv.id}</p>
                       <p className="text-[10px] text-muted-foreground">{inv.date}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold">{inv.amount}</p>
                       <Button variant="link" className="h-auto p-0 text-[10px]">Download</Button>
                    </div>
                 </div>
              ))}
           </CardContent>
        </Card>
      </div>

      <div>
         <h3 className="text-xl font-bold mb-6">Available Upgrades</h3>
         <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Pro", icon: ShieldCheck, price: "99", color: "purple" },
              { name: "Enterprise", icon: Globe, price: "299", color: "green" },
            ].map((p) => (
               <Card key={p.name} className="border-2 hover:border-primary/50 transition-all group cursor-pointer">
                  <CardContent className="pt-6 text-center space-y-4">
                     <div className={`mx-auto size-12 rounded-2xl bg-${p.color}-50 flex items-center justify-center text-${p.color}-600 border border-${p.color}-100`}>
                        <p.icon className="size-6" />
                     </div>
                     <div>
                        <h4 className="font-black text-xl">{p.name}</h4>
                        <div className="text-2xl font-black mt-1">${p.price}<span className="text-xs text-muted-foreground">/mo</span></div>
                     </div>
                     <Button variant="outline" className="w-full font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Choose {p.name}
                     </Button>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
    </div>
  )
}
