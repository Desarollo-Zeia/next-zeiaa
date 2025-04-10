"use client"

import { useState, useEffect, useTransition } from "react"
import { Bell, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface MetricSelectorProps {
  defaultMetric?: "current" | "voltage"
  alertCount?: number
  alertsPath?: string
  onMetricChange?: (metric: "current" | "voltage") => void
  className?: string,
  dontShowIt?: string
}

export function MetricSelector({
  defaultMetric = "current",
  alertCount = 0,
  alertsPath = "/energia/dashboard/desbalance/alerta",
  onMetricChange,
  className,
  dontShowIt,
}: MetricSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Initialize from URL query parameter if available
  const [selectedMetric, setSelectedMetric] = useState<"current" | "voltage">(
    (searchParams.get("metric") as "current" | "voltage") || defaultMetric,
  )

  // Update URL when metric changes
  const handleMetricChange = (metric: "current" | "voltage") => {
    if (metric === selectedMetric) return

    setSelectedMetric(metric)
    onMetricChange?.(metric)

    // Create new URLSearchParams object with current params
    const params = new URLSearchParams(searchParams.toString())
    params.set("metric", metric)

    // Update the URL with the new search parameters using useTransition
    startTransition(() => {
      const url = window.location.pathname + "?" + params.toString()
      router.push(url)
    })
  }

  // Sync with URL if it changes externally
  useEffect(() => {
    const metricFromUrl = searchParams.get("metric") as "current" | "voltage"
    if (metricFromUrl && metricFromUrl !== selectedMetric) {
      setSelectedMetric(metricFromUrl)
      onMetricChange?.(metricFromUrl)
    }
  }, [searchParams, onMetricChange, selectedMetric])

  return (
    <div className={cn("flex items-center justify-end gap-3 md:gap-4", className)}>
      <div className="flex h-9 overflow-hidden rounded-md border bg-muted/50 relative">
        {isPending && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
        <button
          onClick={() => handleMetricChange("current")}
          className={cn(
            "px-3 py-1.5 text-sm font-medium transition-all relative",
            selectedMetric === "current" ? "bg-[#00b0c7] text-primary-foreground" : "hover:bg-muted/80",
            isPending && "opacity-50",
          )}
          disabled={isPending}
          aria-pressed={selectedMetric === "current"}
        >
          Corriente
        </button>
        <button
          onClick={() => handleMetricChange("voltage")}
          className={cn(
            "px-3 py-1.5 text-sm font-medium transition-all relative",
            selectedMetric === "voltage" ? "bg-[#00b0c7] text-primary-foreground" : "hover:bg-muted/80",
            isPending && "opacity-50",
          )}
          disabled={isPending}
          aria-pressed={selectedMetric === "voltage"}
        >
          Voltaje
        </button>
      </div>

      <Button variant="outline" size="sm" asChild className={`gap-1.5 relative ${dontShowIt}`}>
        <Link href={alertsPath}>
          <span>Ver alertas</span>
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
            >
              {alertCount > 99 ? "99+" : alertCount}
            </Badge>
          )}
        </Link>
      </Button>
    </div>
  )
}

