import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  variant?: "default" | "white" | "black"
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ 
  className, 
  variant = "default", 
  showText = true,
  size = "md" 
}: LogoProps) {
  const sizes = {
    sm: "h-6",
    md: "h-10",
    lg: "h-16"
  }

  const colorClass = {
    default: "text-foreground",
    white: "text-white",
    black: "text-black"
  }

  const wingColor = variant === "white" ? "fill-white" : variant === "black" ? "fill-black" : "fill-foreground"

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div className={cn("relative flex items-center justify-center", sizes[size])}>
        {/* Synthetic "Wing-A" Logo SVG */}
        <svg 
          viewBox="0 0 100 60" 
          className={cn("h-full w-auto", colorClass[variant])}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central A shape (Industrial/Geometric) */}
          <path 
            d="M35 50L45 10H55L65 50H55L52 35H48L45 50H35ZM48.5 28H51.5L50 18L48.5 28Z" 
            fill="currentColor" 
          />
          {/* Left Wing */}
          <g className={wingColor}>
            <path d="M5 15H30L25 25H5L5 15Z" opacity="1" />
            <path d="M15 30H30L27 38H15L15 30Z" opacity="0.8" />
            <path d="M25 42H30L29 46H25L25 42Z" opacity="0.6" />
          </g>
          {/* Right Wing */}
          <g className={wingColor}>
            <path d="M95 15H70L75 25H95L95 15Z" opacity="1" />
            <path d="M85 30H70L73 38H85L85 30Z" opacity="0.8" />
            <path d="M75 42H70L71 46H75L75 42Z" opacity="0.6" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-heading font-black tracking-[0.2em] uppercase leading-none",
            size === "sm" ? "text-xs" : size === "md" ? "text-lg" : "text-3xl",
            colorClass[variant]
          )}>
            Heds Academy
          </span>
          <div className="h-0.5 w-full bg-brand-yellow mt-1 opacity-80" />
        </div>
      )}
    </div>
  )
}
