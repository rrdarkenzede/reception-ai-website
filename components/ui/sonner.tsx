"use client"

import type React from "react"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(215 28% 17%)",
          "--normal-text": "hsl(210 40% 98%)",
          "--normal-border": "hsl(217 19% 27%)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
