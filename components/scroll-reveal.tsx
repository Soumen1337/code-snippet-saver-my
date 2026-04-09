'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { cn } from '@/lib/utils'
import type { ReactNode, CSSProperties } from 'react'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  threshold?: number
  rootMargin?: string
  as?: 'div' | 'section' | 'span' | 'h2' | 'h3' | 'p'
}

const directionMap: Record<RevealDirection, (distance: number) => CSSProperties> = {
  up: (d) => ({ transform: `translateY(${d}px)` }),
  down: (d) => ({ transform: `translateY(-${d}px)` }),
  left: (d) => ({ transform: `translateX(${d}px)` }),
  right: (d) => ({ transform: `translateX(-${d}px)` }),
  scale: () => ({ transform: 'scale(0.92)' }),
  none: () => ({}),
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 700,
  distance = 40,
  threshold = 0.15,
  rootMargin,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
  })

  const hiddenStyle = directionMap[direction](distance)

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : hiddenStyle.transform,
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  }

  return (
    // @ts-ignore -- dynamic tag type
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Staggered card grid — each card reveals with increasing delay      */
/* ------------------------------------------------------------------ */

interface StaggeredCardsProps {
  children: ReactNode[]
  className?: string
  cardClassName?: string
  baseDelay?: number
  staggerDelay?: number
  direction?: RevealDirection
  duration?: number
}

export function StaggeredCards({
  children,
  className,
  cardClassName,
  baseDelay = 0,
  staggerDelay = 120,
  direction = 'up',
  duration = 650,
}: StaggeredCardsProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  })

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => {
        const delay = baseDelay + i * staggerDelay
        const hiddenStyle = directionMap[direction](35)

        const style: CSSProperties = {
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? 'translateY(0) translateX(0) scale(1)'
            : hiddenStyle.transform,
          transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          willChange: 'opacity, transform',
        }

        return (
          <div key={i} className={cn(cardClassName)} style={style}>
            {child}
          </div>
        )
      })}
    </div>
  )
}
