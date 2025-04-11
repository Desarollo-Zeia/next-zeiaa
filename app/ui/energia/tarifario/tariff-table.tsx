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

  // Se armó un arreglo de filas, donde cada objeto representa un concepto
  // y cada columna contiene el valor correspondiente de cada sección.
  // Para billing_data, en los conceptos que contienen objeto se evalúa tariffRating.
  const tableRows = [
    {
      concepto: "Tipo de Tarifa",
      billing: billing_data.billing_data_type,
      consumption: "",
      importe: "",
    },
    {
      concepto: "Ciclo de Facturación",
      billing: `${billing_data.billing_cycle_start} a ${billing_data.billing_cycle_end}`,
      consumption: "",
      importe: "",
    },
    {
      concepto: "Cargo Fijo Mensual",
      billing: billing_data.cargo_fijo_mensual,
      consumption: "",
      importe: "",
    },
    {
      concepto: "Cargo por Energía Activa",
      billing: tariffRating
        ? billing_data.cargo_por_energia_activa_en_punta
        : billing_data.cargo_por_energia_activa_fuera_de_punta,
      consumption: "",
      importe: "",
    },
    {
      concepto: "Cargo por Potencia Activa de Generación para Usuarios",
      billing: tariffRating
        ? billing_data.cargo_por_potencia_activa_de_generacion_para_usuarios.presentes_en_punta
        : billing_data.cargo_por_potencia_activa_de_generacion_para_usuarios.presentes_fuera_de_punta,
      consumption: "",
      importe: "",
    },
    {
      concepto: "Cargo por Potencia Activa de Redes de Distribución para Usuarios",
      billing: tariffRating
        ? billing_data.cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios.presentes_en_punta
        : billing_data.cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios.presentes_fuera_de_punta,
      consumption: "",
      importe: "",
    },
    {
      concepto: "Cargo por Energía Reactiva que exceda el 30%",
      billing: billing_data["cargo_por_energia_reactiva_que_exceda_el_30%_del_total_de_energia_activa"],
      consumption: "",
      importe: "",
    },
    {
      concepto: "Energy Peak",
      billing: "",
      consumption: consumption.energy_peak,
      importe: "",
    },
    {
      concepto: "Energy Off Peak",
      billing: "",
      consumption: consumption.energy_off_peak,
      importe: "",
    },
    {
      concepto: "Power Generation",
      billing: "",
      consumption: consumption.power_generation,
      importe: "",
    },
    {
      concepto: "Power Distribution",
      billing: "",
      consumption: consumption.power_distribution,
      importe: "",
    },
    {
      concepto: "Energy Reactive",
      billing: "",
      consumption: consumption.energy_reactive,
      importe: "",
    },
    {
      concepto: "Cargo Fijo",
      billing: "",
      consumption: "",
      importe: importe.cargo_fijo,
    },
    {
      concepto: "Cargo por Energía Activa en Punta",
      billing: "",
      consumption: "",
      importe: importe.cargo_por_energia_activa_en_punta,
    },
    {
      concepto: "Cargo por Energía Activa fuera de Punta",
      billing: "",
      consumption: "",
      importe: importe.cargo_por_energia_activa_fuera_de_punta,
    },
    {
      concepto: "Cargo por Potencia Activa Generación",
      billing: "",
      consumption: "",
      importe: importe.cargo_por_potencia_activa_generacion,
    },
    {
      concepto: "Cargo por Potencia Activa Distribución",
      billing: "",
      consumption: "",
      importe: importe.cargo_por_potencia_activa_distribucion,
    },
    {
      concepto: "Cargo por Energía Reactiva",
      billing: "",
      consumption: "",
      importe: importe.cargo_por_energia_reactiva,
    },
    {
      concepto: "Total",
      billing: "",
      consumption: "",
      importe: importe.total,
    },
  ]

  return (
    <Card className="w-full mx-auto overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-[#01b7ca] py-6">
        <CardTitle className="text-white text-xl font-bold tracking-tight">
          BAJA TENSIÓN : TARIFA BT4
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-[#f4f9ff]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#01b7ca]">
              <TableHead className="py-4 pl-4 text-white font-medium">Concepto</TableHead>
              <TableHead className="py-4 text-center text-white font-medium">Billing Data</TableHead>
              <TableHead className="py-4 text-center text-white font-medium">Consumption</TableHead>
              <TableHead className="py-4 text-center text-white font-medium">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index} className="bg-white hover:bg-[#f4f9ff] transition-colors">
                <TableCell className="py-3 pl-4 font-medium">{row.concepto}</TableCell>
                <TableCell className="py-3 text-center">{row.billing}</TableCell>
                <TableCell className="py-3 text-center">{row.consumption}</TableCell>
                <TableCell className="py-3 text-center">{row.importe}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
