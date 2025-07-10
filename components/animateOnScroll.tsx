"use client"

import { ReactNode } from "react"
import { useInView } from "./useInView"
import { cn } from "@/lib/utils"

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  animation?: string
  threshold?: number
  triggerOnce?: boolean
}

export const AnimateOnScroll = ({
  children,
  className,
  animation = "animate-pop-in",
  threshold = 0.1,
  triggerOnce = true,
}: AnimateOnScrollProps) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  })

  return (
    <div
      ref={ref}
      className={cn(
        "transition-opacity duration-1000",
        inView ? "opacity-100" : "opacity-0",
        inView && animation,
        className
      )}
    >
      {children}
    </div>
  )
}
