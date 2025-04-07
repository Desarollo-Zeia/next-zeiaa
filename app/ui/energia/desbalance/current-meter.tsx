"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

const meterVariants = cva("flex justify-between p-4 rounded-lg border transition-all shadow-sm", {
  variants: {
    status: {
      normal: "bg-white border-blue-200 text-[#00b0c7] dark:bg-blue-950 dark:border-[#00b0c7] dark:text-blue-100",
      warning:
        "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-100",
      critical: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-900 dark:text-red-100",
    },
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    status: "normal",
    size: "default",
  },
})

export interface CurrentMeterProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof meterVariants> {
  label: string
  minValue: number
  currentValue: number
  unit?: string
  warningThreshold?: number
  criticalThreshold?: number
  animate?: boolean
}

export function CurrentMeter({
  className,
  status,
  size,
  label,
  minValue,
  currentValue,
  unit = "A",
  warningThreshold = 300,
  criticalThreshold = 400,
  ...props
}: CurrentMeterProps) {
  const [determinedStatus, setDeterminedStatus] = useState(status)

  useEffect(() => {
    if (status) return

    if (currentValue >= criticalThreshold) {
      setDeterminedStatus("critical")
    } else if (currentValue >= warningThreshold) {
      setDeterminedStatus("warning")
    } else {
      setDeterminedStatus("normal")
    }
  }, [currentValue, warningThreshold, criticalThreshold, status])

  // Calculate percentage for the progress indicator
  // const percentage = Math.min(100, (currentValue / criticalThreshold) * 100)

  return (
    <div className={cn(meterVariants({ status: determinedStatus, size, className }))} {...props}>
      <div className="flex flex-col justify-start gap-1">
        <div className="flex items-center gap-1.5">
          <Zap
            className={cn("size-4", {
              "text-[#00b0c7] dark:text-[#00b0c7]": determinedStatus === "normal",
              "text-amber-600 dark:text-amber-400": determinedStatus === "warning",
              "text-red-600 dark:text-red-400": determinedStatus === "critical",
            })}
          />
          <p className="font-medium">{label}</p>
        </div>
        <p className="text-sm opacity-80">
          Min {minValue.toFixed(1)}
          {unit}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p
          className={cn("font-semibold tracking-tight", {
            "text-xl": size === "sm",
            "text-2xl": size === "default",
            "text-3xl": size === "lg",
          })}
        >
          {currentValue?.toFixed(2)} {unit}
        </p>

        {/* <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", {
              "bg-blue-500": determinedStatus === "normal",
              "bg-amber-500": determinedStatus === "warning",
              "bg-red-500": determinedStatus === "critical",
              "animate-pulse": animate && determinedStatus === "critical",
            })}
            style={{ width: `${percentage}%` }}
          />
        </div> */}
      </div>
    </div>
  )
}

