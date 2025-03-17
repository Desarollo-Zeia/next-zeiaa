"use client"

import type React from "react"

import { AlertCircle, Check, Info, XCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva("flex items-center gap-3 p-4 rounded-lg border transition-all", {
  variants: {
    variant: {
      success:
        "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-300",
      error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-300",
      warning:
        "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-300",
      info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300",
    },
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "success",
    size: "default",
  },
})

const iconVariants = cva("flex items-center justify-center rounded-full p-1.5", {
  variants: {
    variant: {
      success: "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300",
      error: "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300",
      warning: "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      info: "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    size: {
      default: "size-8",
      sm: "size-6",
      lg: "size-10",
    },
  },
  defaultVariants: {
    variant: "success",
    size: "default",
  },
})

export interface StatusAlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title: string
  description?: string
  icon?: React.ReactNode
  dismissable?: boolean
  onDismiss?: () => void
}

export function StatusAlert({
  className,
  variant,
  size,
  title,
  description,
  icon,
  dismissable = false,
  onDismiss,
  ...props
}: StatusAlertProps) {
  const getIcon = () => {
    if (icon) return icon

    switch (variant) {
      case "success":
        return <Check className="size-4" />
      case "error":
        return <XCircle className="size-4" />
      case "warning":
        return <AlertCircle className="size-4" />
      case "info":
        return <Info className="size-4" />
      default:
        return <Check className="size-4" />
    }
  }

  return (
    <div
      className={cn(alertVariants({ variant, size, className }))}
      role="alert"
      {...props}
    >
      <div className={cn(iconVariants({ variant, size }))}>{getIcon()}</div>
      <div className="flex-1">
        <h4
          className={cn("font-medium", {
            "text-lg": size === "lg",
            "text-base": size === "default",
            "text-sm": size === "sm",
          })}
        >
          {title}
        </h4>
        {description && <p className="mt-1 opacity-90">{description}</p>}
      </div>
      {dismissable && (
        <button
          onClick={onDismiss}
          className={cn("opacity-70 hover:opacity-100 transition-opacity", {
            "size-5": size === "sm",
            "size-6": size === "default",
            "size-7": size === "lg",
          })}
          aria-label="Cerrar"
        >
          <XCircle />
        </button>
      )}
    </div>
  )
}

