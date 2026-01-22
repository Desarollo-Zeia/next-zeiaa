"use client"

/**
 * Dynamic Chart Components - Lazy loading wrappers para Chart.js
 * 
 * Estos componentes cargan Chart.js y sus plugins de forma diferida
 * para reducir el bundle inicial. Se recomienda usar estos en lugar
 * de importar directamente desde react-chartjs-2.
 * 
 * Uso:
 * import { DynamicLine, DynamicBar } from '@/components/charts/dynamic-charts'
 * 
 * Impacto: ~200-300KB menos en el bundle inicial
 */

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { ComponentProps } from "react"
import type { Line, Bar, Pie, Doughnut } from "react-chartjs-2"

// Skeleton de carga para los charts
function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="w-full animate-pulse" style={{ height }}>
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  )
}

// Dynamic Line Chart - Carga diferida
export const DynamicLine = dynamic(
  () => import("./chart-registry").then((mod) => mod.Line),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={350} />,
  }
) as typeof Line

// Dynamic Bar Chart - Carga diferida
export const DynamicBar = dynamic(
  () => import("./chart-registry").then((mod) => mod.Bar),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={300} />,
  }
) as typeof Bar

// Dynamic Pie Chart - Carga diferida
export const DynamicPie = dynamic(
  () => import("./chart-registry").then((mod) => mod.Pie),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={250} />,
  }
) as typeof Pie

// Dynamic Doughnut Chart - Carga diferida
export const DynamicDoughnut = dynamic(
  () => import("./chart-registry").then((mod) => mod.Doughnut),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={250} />,
  }
) as typeof Doughnut

// Type exports para conveniencia
export type LineChartProps = ComponentProps<typeof Line>
export type BarChartProps = ComponentProps<typeof Bar>
export type PieChartProps = ComponentProps<typeof Pie>
export type DoughnutChartProps = ComponentProps<typeof Doughnut>
