import { Card } from "@/components/ui/card"

interface ConsumptionData {
  date: string
  time: string
  totalConsumption: string
  excessConsumption: string
  status: {
    type: "warning" | "error" | "default"
    label: string
  }
}

const data: ConsumptionData[] = [
  {
    date: "Miércoles 17 de Julio del 2024",
    time: "11:00 am",
    totalConsumption: "35 kW",
    excessConsumption: "15 kW",
    status: {
      type: "warning",
      label: "Potencia contratada",
    },
  },
  {
    date: "Miércoles 17 de Julio del 2024",
    time: "10:00 am",
    totalConsumption: "35 kW",
    excessConsumption: "15 kW",
    status: {
      type: "error",
      label: "Potencia instalada",
    },
  },
  {
    date: "Miércoles 17 de Julio del 2024",
    time: "08:00 am",
    totalConsumption: "35 kW",
    excessConsumption: "15 kW",
    status: {
      type: "warning",
      label: "Potencia contratada",
    },
  },
  {
    date: "Martes 11 de Julio del 2024",
    time: "11:00 am",
    totalConsumption: "35 kW",
    excessConsumption: "15 kW",
    status: {
      type: "warning",
      label: "Potencia contratada",
    },
  },
  {
    date: "Martes 11 de Julio del 2024",
    time: "1:00 am",
    totalConsumption: "65 kW",
    excessConsumption: "15 kW",
    status: {
      type: "error",
      label: "Máxima demanda de potencia",
    },
  },
]

export default function PowerConsumptionTable() {
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hora</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Consumo total</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Consumo excedente</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Umbral excedido</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={`${row.date}-${row.time}`} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                <td className="p-4 text-sm">{row.date}</td>
                <td className="p-4 text-sm">{row.time}</td>
                <td className="p-4 text-sm">{row.totalConsumption}</td>
                <td className="p-4 text-sm">{row.excessConsumption}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        row.status.type === "warning"
                          ? "bg-yellow-500"
                          : row.status.type === "error"
                            ? "bg-red-500"
                            : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm">{row.status.label}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

