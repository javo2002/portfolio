"use client"

import { useState, useEffect } from "react"

interface Options {
  threshold?: number
  triggerOnce?: boolean
}

export const useInView = (options: Options = {}): [(node: Element | null) => void, boolean] => {
  const { threshold = 0.1, triggerOnce = true } = options
  const [inView, setInView] = useState(false)
  const [node, setNode] = useState<Element | null>(null)

  useEffect(() => {
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) {
            observer.unobserve(entry.target)
          }
        } else {
          if (!triggerOnce) {
            setInView(false)
          }
        }
      },
      {
        threshold,
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [node, threshold, triggerOnce])

  return [setNode, inView]
}
