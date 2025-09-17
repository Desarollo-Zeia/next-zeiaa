"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Simulación de la data proveniente del JSON


interface BillingData {
  billing_data_type: string;
  billing_cycle_start: string; // Formato de fecha: YYYY-MM-DD
  billing_cycle_end: string;   // Formato de fecha: YYYY-MM-DD
}

interface Consumption {
  value: number;
}

interface Charge {
  description: string;
  unit: string; // O podrías usar un tipo literal de unión si sabes los valores exactos, ej: "S/" | "$"
  cargo: number;
  consumption: Consumption;
  billed: number;
}

interface TariffData {
  billing_data: BillingData;
  charges: Charge[];
  total: number

}

export default function TariffTable({ tariffData }: { tariffData: TariffData }) {
  const { billing_data, charges, total } = tariffData

  return (
    <Card className="w-full mx-auto overflow-hidden border-none shadow-lg relative">
      <CardHeader className="bg-[#01b7ca] py-6">
        <CardTitle className="text-white text-xl font-bold tracking-tight">
          BAJA TENSIÓN : TARIFA {billing_data?.billing_data_type}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-[#f4f9ff] p-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#01b7ca] hover:bg-[#01b7ca]">
              <TableHead className="text-white font-medium ">Descripción</TableHead>
              <TableHead className="text-center text-white font-medium">Unidad</TableHead>
              <TableHead className="text-center text-white font-medium">Tarifa</TableHead>
              <TableHead className="text-center text-white font-medium">Consumo</TableHead>
              <TableHead className="text-center text-white font-medium">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              charges?.map((charge, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell className="text-left">
                      {charge.description}
                    </TableCell>
                    <TableCell className="text-center">
                      {charge.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      {charge.cargo.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {charge.consumption.value.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {charge.billed.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              })
            }
            <TableRow className="bg-[#01b7ca] hover:bg-[#01b7ca]">
              <TableCell>
              </TableCell>
              <TableCell>
              </TableCell>
              <TableCell className="text-center">
              </TableCell>
              <TableCell className="text-center text-white">
                Costo total
              </TableCell>
              <TableCell className="text-center text-white font-bold">
                S/  {total.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
