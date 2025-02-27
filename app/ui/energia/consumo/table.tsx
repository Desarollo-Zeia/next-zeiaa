"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import PaginationNumberComponent from "../../pagination-number"

interface Values {
  P: number
  Q: number
  Ia: number
  Ib: number
  Ic: number
  In: number
  Ua: number
  Ub: number
  Uc: number
  Uab: number
  Uac: number
  Ubc: number
  EPneg: number
  EPpos: number
  EQneg: number
  EQpos: number
}

interface Reading {
  created_at: string
  indicators: Array<{
    values_per_channel: Array<{
      values: Values
    }>
  }>
}

interface TableComponentProps {
  readings?: Reading[],
  count: number
}

const ELECTRIC_PARAMETERS = {
  Ua: { parameter: "Voltaje de fase A", unit: "V" },
  Ub: { parameter: "Voltaje de fase B", unit: "V" },
  Uc: { parameter: "Voltaje de fase C", unit: "V" },
  Uab: { parameter: "Voltaje entre AB", unit: "V" },
  Ubc: { parameter: "Voltaje entre BC", unit: "V" },
  Uac: { parameter: "Voltaje entre AC", unit: "V" },
  Ia: { parameter: "Corriente de la fase A", unit: "A" },
  Ib: { parameter: "Corriente de la fase B", unit: "A" },
  Ic: { parameter: "Corriente de la fase C", unit: "A" },
  In: { parameter: "Vector suma de las fases", unit: "A" },
  P: { parameter: "Potencia activa total", unit: "KW" },
  Q: { parameter: "Potencia reactiva total", unit: "KVar" },
  EPpos: { parameter: "Consumo de energía activa hacia adelante", unit: "KWh" },
  EPneg: { parameter: "Consumo de energía activa hacia atrás", unit: "KWh" },
  EQpos: { parameter: "Consumo de energía reactiva hacia adelante", unit: "KVarh" },
  EQneg: { parameter: "Consumo de energía reactiva hacia atrás", unit: "KVarh" },
} as const

type ParameterKey = keyof typeof ELECTRIC_PARAMETERS

const HeaderWithTooltip = ({ shortName, parameter, unit }: { shortName: string; parameter: string; unit: string }) => (
  <TooltipProvider>
    <TooltipUI>
      <TooltipTrigger asChild>
        <TableHead className="text-center">
          {shortName} ({unit})
        </TableHead>
      </TooltipTrigger>
      <TooltipContent>
        <p>{parameter}</p>
      </TooltipContent>
    </TooltipUI>
  </TooltipProvider>
)

// Mock data basada en el JSON proporcionado
// const mockReadings: Reading[] = [
//   {
//     created_at: "2025-02-21T16:59:15.329353-05:00",
//     indicators: [
//       {
//         values_per_channel: [
//           {
//             values: {
//               P: 257.95,
//               Q: 0,
//               Ia: 1.73,
//               Ib: 1.73,
//               Ic: 0,
//               In: 0,
//               Ua: 223.56,
//               Ub: 0,
//               Uc: 228.54,
//               Uab: 223.56,
//               Uac: 226.04,
//               Ubc: 228.54,
//               EPneg: 1.85,
//               EPpos: 4.3,
//               EQneg: 3.53,
//               EQpos: 7.15,
//             },
//           },
//         ],
//       },
//     ],
//   },
//   {
//     created_at: "2025-02-21T16:58:15.215850-05:00",
//     indicators: [
//       {
//         values_per_channel: [
//           {
//             values: {
//               P: 247.12,
//               Q: 0,
//               Ia: 1.67,
//               Ib: 1.67,
//               Ic: 0,
//               In: 0,
//               Ua: 222.25,
//               Ub: 0,
//               Uc: 227.46,
//               Uab: 222.12,
//               Uac: 224.73,
//               Ubc: 227.26,
//               EPneg: 1.85,
//               EPpos: 4.3,
//               EQneg: 3.53,
//               EQpos: 7.15,
//             },
//           },
//         ],
//       },
//     ],
//   },
// ]

export default function TableComponent({ readings, count }: TableComponentProps) {
  const [selectedParameter, setSelectedParameter] = useState<ParameterKey>("P")
  const displayData = readings?.length ? readings : []


  const formattedData = displayData.map((reading) => {
    const date = new Date(reading.created_at)
    const values = reading.indicators[0]?.values_per_channel[0]?.values
    return {
      date: format(date, "EEEE d 'de' MMMM", { locale: es }),
      time: format(date, "HH:mm:ss", { locale: es }),
      timestamp: date.getTime(),
      ...values,
    }
  })

  const config = {
    [selectedParameter]: {
      label: ELECTRIC_PARAMETERS[selectedParameter].parameter,
      color: "hsl(var(--primary))",
      unit: ELECTRIC_PARAMETERS[selectedParameter].unit,
    },
  }

  const chartData = [...formattedData]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((data) => ({
      date: format(new Date(data.timestamp), "HH:mm:ss"),
      [selectedParameter]: data[selectedParameter],
    }))

  return (
    <div className="flex flex-col w-full">
      <Card className="flex-1 overflow-hidden">
        <CardContent className="h-full p-4">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead className="text-center" colSpan={2}>
                    Potencia
                  </TableHead>
                  <TableHead className="text-center" colSpan={4}>
                    Corriente
                  </TableHead>
                  <TableHead className="text-center" colSpan={6}>
                    Voltaje
                  </TableHead>
                  <TableHead className="text-center" colSpan={4}>
                    Energía
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  {/* Potencia */}
                  <HeaderWithTooltip
                    shortName="P"
                    parameter={ELECTRIC_PARAMETERS.P.parameter}
                    unit={ELECTRIC_PARAMETERS.P.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Q"
                    parameter={ELECTRIC_PARAMETERS.Q.parameter}
                    unit={ELECTRIC_PARAMETERS.Q.unit}
                  />
                  {/* Corriente */}
                  <HeaderWithTooltip
                    shortName="Ia"
                    parameter={ELECTRIC_PARAMETERS.Ia.parameter}
                    unit={ELECTRIC_PARAMETERS.Ia.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Ib"
                    parameter={ELECTRIC_PARAMETERS.Ib.parameter}
                    unit={ELECTRIC_PARAMETERS.Ib.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Ic"
                    parameter={ELECTRIC_PARAMETERS.Ic.parameter}
                    unit={ELECTRIC_PARAMETERS.Ic.unit}
                  />
                  <HeaderWithTooltip
                    shortName="In"
                    parameter={ELECTRIC_PARAMETERS.In.parameter}
                    unit={ELECTRIC_PARAMETERS.In.unit}
                  />
                  {/* Voltaje */}
                  <HeaderWithTooltip
                    shortName="Ua"
                    parameter={ELECTRIC_PARAMETERS.Ua.parameter}
                    unit={ELECTRIC_PARAMETERS.Ua.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Ub"
                    parameter={ELECTRIC_PARAMETERS.Ub.parameter}
                    unit={ELECTRIC_PARAMETERS.Ub.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Uc"
                    parameter={ELECTRIC_PARAMETERS.Uc.parameter}
                    unit={ELECTRIC_PARAMETERS.Uc.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Uab"
                    parameter={ELECTRIC_PARAMETERS.Uab.parameter}
                    unit={ELECTRIC_PARAMETERS.Uab.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Uac"
                    parameter={ELECTRIC_PARAMETERS.Uac.parameter}
                    unit={ELECTRIC_PARAMETERS.Uac.unit}
                  />
                  <HeaderWithTooltip
                    shortName="Ubc"
                    parameter={ELECTRIC_PARAMETERS.Ubc.parameter}
                    unit={ELECTRIC_PARAMETERS.Ubc.unit}
                  />
                  {/* Energía */}
                  <HeaderWithTooltip
                    shortName="EP+"
                    parameter={ELECTRIC_PARAMETERS.EPpos.parameter}
                    unit={ELECTRIC_PARAMETERS.EPpos.unit}
                  />
                  <HeaderWithTooltip
                    shortName="EP-"
                    parameter={ELECTRIC_PARAMETERS.EPneg.parameter}
                    unit={ELECTRIC_PARAMETERS.EPneg.unit}
                  />
                  <HeaderWithTooltip
                    shortName="EQ+"
                    parameter={ELECTRIC_PARAMETERS.EQpos.parameter}
                    unit={ELECTRIC_PARAMETERS.EQpos.unit}
                  />
                  <HeaderWithTooltip
                    shortName="EQ-"
                    parameter={ELECTRIC_PARAMETERS.EQneg.parameter}
                    unit={ELECTRIC_PARAMETERS.EQneg.unit}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedData.map((reading, index) => (
                  <TableRow key={index}>
                    <TableCell className="capitalize">{reading.date}</TableCell>
                    <TableCell>{reading.time}</TableCell>
                    <TableCell>{reading.P?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Q?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Ia?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Ib?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Ic?.toFixed(2)}</TableCell>
                    <TableCell>{reading.In?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Ua?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Ub?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Uc?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Uab?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Uac?.toFixed(2)}</TableCell>
                    <TableCell>{reading.Ubc?.toFixed(2)}</TableCell>
                    <TableCell>{reading.EPpos?.toFixed(2)}</TableCell>
                    <TableCell>{reading.EPneg?.toFixed(2)}</TableCell>
                    <TableCell>{reading.EQpos?.toFixed(2)}</TableCell>
                    <TableCell>{reading.EQneg?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <PaginationNumberComponent count={count} itemsPerPage={10}/>
      </Card>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="h-full p-4">
          <div className="mb-4">
            <Select value={selectedParameter} onValueChange={(value: ParameterKey) => setSelectedParameter(value)}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Selecciona un parámetro" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ELECTRIC_PARAMETERS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.parameter} ({value.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ChartContainer config={config}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" label={{ value: "Hora", position: "bottom" }} />
              <YAxis
                label={{
                  value: `${ELECTRIC_PARAMETERS[selectedParameter].parameter} (${ELECTRIC_PARAMETERS[selectedParameter].unit})`,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={selectedParameter}
                stroke="hsl(var(--primary))"
                name={`${ELECTRIC_PARAMETERS[selectedParameter].parameter}`}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

