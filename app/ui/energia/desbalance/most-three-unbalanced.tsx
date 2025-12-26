import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"


interface MonitoringCardProps {
  title: string
  frequency: number
  cup: number
  vup: number
}

export default function MostThreeUnbalanced({ title, frequency, cup, vup }: MonitoringCardProps) {

  const desbalancePorcentage = ((cup / frequency) * 100).toFixed(2)
  return (
    <Card className="w-full max-w-lg bg-card border border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <div>Frecuencia: {frequency}</div>
              <div>
                CUF: {cup} VUF: {vup}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-card-foreground">La red está  desbalanceada: {desbalancePorcentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
