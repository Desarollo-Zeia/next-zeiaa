/**
 * Charts Module - Exportaciones centralizadas
 * 
 * Usar estos exports para lazy loading automático de Chart.js:
 * 
 * import { DynamicLine, DynamicBar } from '@/components/charts'
 * 
 * Para casos donde necesitas el Chart.js registrado síncronamente
 * (no recomendado para componentes de página):
 * 
 * import { Line, Bar, ChartJS } from '@/components/charts/chart-registry'
 */

export {
  DynamicLine,
  DynamicBar,
  DynamicPie,
  DynamicDoughnut,
  type LineChartProps,
  type BarChartProps,
  type PieChartProps,
  type DoughnutChartProps,
} from "./dynamic-charts"
