"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface MetricSelectorProps {
  defaultMetric?: "current" | "voltage"
  alertCount?: number
  alertsPath?: string
  onMetricChange?: (metric: "current" | "voltage") => void
  className?: string
}

export function MetricSelector({
  defaultMetric = "current",
  alertCount = 0,
  alertsPath = "/energia/dashboard/desbalance/alerta",
  onMetricChange,
  className,
}: MetricSelectorProps) {
  const [selectedMetric, setSelectedMetric] = useState<"current" | "voltage">(defaultMetric)

  const handleMetricChange = (metric: "current" | "voltage") => {
    setSelectedMetric(metric)
    onMetricChange?.(metric)
  }

  return (
    <div className={cn("flex items-center justify-end gap-3 md:gap-4", className)}>
      <div className="flex h-9 overflow-hidden rounded-md border bg-muted/50">
        <button
          onClick={() => handleMetricChange("current")}
          className={cn(
            "px-3 py-1.5 text-sm font-medium transition-all relative",
            selectedMetric === "current" ? "bg-[#00b0c7] text-primary-foreground" : "hover:bg-muted/80",
          )}
          aria-pressed={selectedMetric === "current"}
        >
          Corriente
        </button>
        <button
          onClick={() => handleMetricChange("voltage")}
          className={cn(
            "px-3 py-1.5 text-sm font-medium transition-all relative",
            selectedMetric === "voltage" ? "bg-[#00b0c7] text-primary-foreground" : "hover:bg-muted/80",
          )}
          aria-pressed={selectedMetric === "voltage"}
        >
          Voltaje
        </button>
      </div>

      <Button variant="outline" size="sm" asChild className="gap-1.5 relative">
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

