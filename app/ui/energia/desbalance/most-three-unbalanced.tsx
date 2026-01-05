import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"


interface MonitoringCardProps {
  title: string
  frequency: number
  cup: number
  vup: number
}

export default function MostThreeUnbalanced({ title, frequency, cup, vup }: MonitoringCardProps) {

  const cufPercentage = frequency > 0 ? ((cup / frequency) * 100).toFixed(0) : '0'
  const vufPercentage = frequency > 0 ? ((vup / frequency) * 100).toFixed(0) : '0'

  return (
    <Card className="w-full bg-card border border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Corriente(CUF)</p>
              <p className="text-sm text-card-foreground">{cup} Veces</p>
              <p className="text-sm font-medium text-card-foreground">{cufPercentage}%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Voltaje (VUF)</p>
              <p className="text-sm text-card-foreground">{vup} Veces</p>
              <p className="text-sm font-medium text-card-foreground">{vufPercentage}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
