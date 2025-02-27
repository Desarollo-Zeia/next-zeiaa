"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import ExcessPower from "./excess-power"

const data = [
    { time: "07:00", value: 0 },
    { time: "07:30", value: 5 },
    { time: "08:00", value: 20 },
    { time: "08:30", value: 50 },
    { time: "09:00", value: 35 },
    { time: "09:30", value: 0 },
    { time: "10:00", value: 10 },
    { time: "10:30", value: 5 },
    { time: "11:00", value: 0 },
  ]
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-3 border rounded-lg shadow-sm">
//         <p className="text-sm font-medium mb-2">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <div key={index} className="flex items-center gap-2 text-xs">
//             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
//             <span>{entry.name}:</span>
//             <span className="font-medium">{entry.value} kW</span>
//           </div>
//         ))}
//       </div>
//     )
//   }
//   return null
// }

export default function PowerDashboard() {
  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] gap-4 bg-background p-4">
      {/* Sidebar - Potencia Contratada */}
      <Card className="w-56">
        <div className="p-4 space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm text-muted-foreground">Potencia contrada</h2>
            <p className="text-2xl font-bold">200kW</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm text-muted-foreground">Tipo</h3>
            <p className="text-base font-medium">Trifásica</p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-sm">Máxima demanda de potencia</span>
              <span className="text-sm font-medium ml-auto text-nowrap">50 kw</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-sm">Potencia contratada</span>
              <span className="text-sm font-medium ml-auto text-nowrap">45 kw</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-sm">Potencia simulada</span>
              <span className="text-sm font-medium ml-auto text-nowrap">55 kw</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full gap-2 text-sm h-8">
            <HelpCircle className="w-3.5 h-3.5" />
            ¿Qué se mide?
          </Button>
        </div>
      </Card>

      {/* Main Content - Gráfica */}
      <Card className="flex-1">
        <div className="p-6">
          <div className="flex justify-end gap-2 mb-6">
            <Button variant="outline" size="sm" className="text-sm">
              Por día
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              Por hora
            </Button>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 60]}
                  ticks={[0, 10, 20, 30, 40, 50, 60]}
                />
                <Tooltip />
                <Line type="step" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <ExcessPower/>
      </Card>
    </div>
  )
}

