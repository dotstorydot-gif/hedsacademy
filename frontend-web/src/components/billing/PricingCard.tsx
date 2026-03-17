import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
  buttonText?: string
  onSelect?: () => void
}

export function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  isPopular, 
  buttonText = "Get Started",
  onSelect,
}: PricingCardProps) {

  return (
    <Card className={cn(
      "relative border-2 transition-all hover:shadow-xl",
      isPopular ? "border-primary shadow-lg scale-105 z-10" : "border-muted shadow-sm"
    )}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-black">{name}</CardTitle>
        <p className="text-xs text-muted-foreground font-medium px-4">{description}</p>
        <div className="pt-4">
          <span className="text-4xl font-black">${price}</span>
          <span className="text-sm text-muted-foreground font-bold">/mo</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="mt-1 size-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="size-3 text-primary" />
              </div>
              <span className="text-muted-foreground font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className={cn("w-full h-12 font-bold text-base shadow-md", isPopular ? "shadow-primary/20" : "")} 
          variant={isPopular ? "default" : "outline"}
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
