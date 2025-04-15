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
interface TariffData {
  billing_data: BillingData;
  consumption: Consumption;
  importe: Importe;
}

interface BillingData {
  tariff_rating: boolean;
  billing_data_type: string;
  billing_cycle_start: string; // Formato de fecha: YYYY-MM-DD
  billing_cycle_end: string;   // Formato de fecha: YYYY-MM-DD
  cargo_fijo_mensual: number;
  cargo_por_energia_activa_en_punta: number;
  cargo_por_energia_activa_fuera_de_punta: number;
  cargo_por_potencia_activa_de_generacion_para_usuarios: {
    presentes_en_punta: number;
    presentes_fuera_de_punta: number;
  };
  cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios: {
    presentes_en_punta: number;
    presentes_fuera_de_punta: number;
  };
  "cargo_por_energia_reactiva_que_exceda_el_30%_del_total_de_energia_activa": number;
}

interface Consumption {
  energy_peak: number;
  energy_off_peak: number;
  power_generation: number;
  power_distribution: number;
  energy_reactive: number;
}

interface Importe {
  cargo_fijo: number;
  cargo_por_energia_activa_en_punta: number;
  cargo_por_energia_activa_fuera_de_punta: number;
  cargo_por_potencia_activa_generacion: number;
  cargo_por_potencia_activa_distribucion: number;
  cargo_por_energia_reactiva: number | null;
  total: number;
}

export default function TariffTable( { tariffData }: { tariffData: TariffData } ) {
  const { billing_data, importe } = tariffData

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
                 {billing_data.cargo_fijo_mensual}
              </TableCell>
              <TableCell className="text-center">
                 {importe.cargo_fijo}
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
                 {billing_data.cargo_por_energia_activa_en_punta}
              </TableCell>
              <TableCell className="text-center">
                 {importe.cargo_por_energia_activa_en_punta}
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
                 {billing_data.cargo_por_energia_activa_fuera_de_punta}
              </TableCell>
              <TableCell className="text-center">
                 {importe.cargo_por_energia_activa_fuera_de_punta}
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
                {billing_data.tariff_rating ? billing_data.cargo_por_potencia_activa_de_generacion_para_usuarios.presentes_en_punta : billing_data.cargo_por_potencia_activa_de_generacion_para_usuarios.presentes_fuera_de_punta}
              </TableCell>
              <TableCell className="text-center">
                  {importe.cargo_por_potencia_activa_generacion}
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
                {billing_data.tariff_rating ? billing_data.cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios.presentes_en_punta : billing_data.cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios.presentes_fuera_de_punta}
              </TableCell>
              <TableCell className="text-center">
                  {importe.cargo_por_potencia_activa_distribucion}
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
                {billing_data["cargo_por_energia_reactiva_que_exceda_el_30%_del_total_de_energia_activa"]}
              </TableCell>
              <TableCell className="text-center">
                  {importe.cargo_por_energia_reactiva}
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
                  {importe.total}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
