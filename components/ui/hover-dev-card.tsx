"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface HoverDevCardProps {
  className?: string
  href?: string
  children: React.ReactNode
  onClick?: () => void
}

export function HoverDevCard({ className, href, children, onClick }: HoverDevCardProps) {
  const content = (
    <article
      className={cn(
        "companion-card group",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </article>
  )

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {content}
      </Link>
    )
  }

  return content
}


