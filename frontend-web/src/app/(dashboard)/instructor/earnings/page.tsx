"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TrendingUp, DollarSign } from "lucide-react"

export default function InstructorEarningsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="font-heading font-black text-3xl uppercase tracking-tighter">Fiscal Overview</h1>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mt-1">Instructor Revenue Dispatch</p>
      </div>

      <Card className="border-2 border-black/5 dark:border-white/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden p-20 text-center flex flex-col items-center gap-6">
        <div className="size-20 rounded-full bg-muted/10 flex items-center justify-center border-2 border-muted">
           <DollarSign className="size-10 text-muted-foreground/20" />
        </div>
        <div className="space-y-2">
           <h3 className="font-heading font-black text-xl uppercase tracking-tighter">Earnings Ledger Offline</h3>
           <p className="text-xs text-muted-foreground font-medium max-w-sm mx-auto">
              Transaction data and payout schedules will be established upon first academic enrollment.
           </p>
        </div>
      </Card>
    </div>
  )
}
