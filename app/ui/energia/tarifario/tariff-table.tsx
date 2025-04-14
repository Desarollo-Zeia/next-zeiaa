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
const tariffData = {
  billing_data: {
    tariff_rating: true,
    billing_data_type: "BT3",
    billing_cycle_start: "2025-02-25",
    billing_cycle_end: "2025-03-25",
    cargo_fijo_mensual: 4.36,
    cargo_por_energia_activa_en_punta: 35.05,
    cargo_por_energia_activa_fuera_de_punta: 29.93,
    cargo_por_potencia_activa_de_generacion_para_usuarios: { presentes_en_punta: 65.69, presentes_fuera_de_punta: 39.13 },
    cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios: { presentes_en_punta: 66.29, presentes_fuera_de_punta: 57.71 },
    "cargo_por_energia_reactiva_que_exceda_el_30%_del_total_de_energia_activa": 5.36,
  },
  consumption: {
    energy_peak: 25.58,
    energy_off_peak: 117.68,
    power_generation: 40000,
    power_distribution: 35.7,
    energy_reactive: 26.62,
  },
  importe: {
    cargo_fijo: 4.36,
    cargo_por_energia_activa_en_punta: 8.97,
    cargo_por_energia_activa_fuera_de_punta: 35.22,
    cargo_por_potencia_activa_generacion: 2627600,
    cargo_por_potencia_activa_distribucion: 2366.55,
    cargo_por_energia_reactiva: null,
    total: 2630015.1,
  },
}

export default function TariffTable() {
  const { billing_data, consumption, importe } = tariffData
  const tariffRating = billing_data.tariff_rating

  return (
    <Card className="w-full mx-auto overflow-hidden border-none shadow-lg relative">
      <CardHeader className="bg-[#01b7ca] py-6">
        <CardTitle className="text-white text-xl font-bold tracking-tight">
          BAJA TENSIÓN : TARIFA BT4
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-[#f4f9ff] p-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#01b7ca] hover:bg-[#01b7ca]">
              <TableHead className="text-white font-medium ">Tarifa con doble medición de energía activa y contratación o medición de una potencia 2E1P</TableHead>
              <TableHead className="text-center text-white font-medium">Unidad</TableHead>
              <TableHead className="text-center text-white font-medium">Tarifa</TableHead>
              <TableHead className="text-center text-white font-medium">Consumo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-white">
              <TableCell>
                 Cargo fijo mensual
              </TableCell>
              <TableCell className="text-center">
                 S//mes
              </TableCell>
              <TableCell className="text-center">
                 {tariffData.billing_data.cargo_fijo_mensual}
              </TableCell>
              <TableCell className="text-center">
                 {tariffData.importe.cargo_fijo}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Cargo por energía activa en punta
              </TableCell>
              <TableCell className="text-center">
                 ctm. S//kWh
              </TableCell>
              <TableCell className="text-center">
                 {tariffData.billing_data.cargo_por_energia_activa_en_punta}
              </TableCell>
              <TableCell className="text-center">
                 {tariffData.importe.cargo_por_energia_activa_en_punta}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Cargo por energía activa fuera de punta
              </TableCell>
              <TableCell className="text-center">
                 ctm. S//kWh
              </TableCell>
              <TableCell className="text-center">
                 {tariffData.billing_data.cargo_por_energia_activa_fuera_de_punta}
              </TableCell>
              <TableCell className="text-center">
                 {tariffData.importe.cargo_por_energia_activa_fuera_de_punta}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Cargo por potencia activa de generación para usuarios
              </TableCell>
              <TableCell className="text-center">
                 ctm. S//kWh
              </TableCell>
              <TableCell className="text-center">
                {tariffData.billing_data.tariff_rating ? tariffData.billing_data.cargo_por_potencia_activa_de_generacion_para_usuarios.presentes_en_punta : tariffData.billing_data.cargo_por_potencia_activa_de_generacion_para_usuarios.presentes_fuera_de_punta}
              </TableCell>
              <TableCell className="text-center">
                  {tariffData.importe.cargo_por_potencia_activa_generacion}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Cargo por potencia activa de redes de distribución para usuarios
              </TableCell>
              <TableCell className="text-center">
                 ctm. S//kWh
              </TableCell>
              <TableCell className="text-center">
                {tariffData.billing_data.tariff_rating ? tariffData.billing_data.cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios.presentes_en_punta : tariffData.billing_data.cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios.presentes_fuera_de_punta}
              </TableCell>
              <TableCell className="text-center">
                  {tariffData.importe.cargo_por_potencia_activa_distribucion}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Cargo por energía reactiva que exceda el 30% del total de la energía activa
              </TableCell>
              <TableCell className="text-center">
                ctm S//kVar.h
              </TableCell>
              <TableCell className="text-center">
                {tariffData.billing_data["cargo_por_energia_reactiva_que_exceda_el_30%_del_total_de_energia_activa"]}
              </TableCell>
              <TableCell className="text-center">
                  {tariffData.importe.cargo_por_energia_reactiva}
              </TableCell>
            </TableRow>
            <TableRow className="bg-[#01b7ca] hover:bg-[#01b7ca]">
              <TableCell>
              </TableCell>
              <TableCell className="text-center">
              </TableCell>
              <TableCell className="text-center text-white">
                  Costo total
              </TableCell>
              <TableCell className="text-center text-white font-bold">
                  {tariffData.importe.total}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
