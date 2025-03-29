"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Zap, ChevronDown, ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function TariffTable() {
  const [openGeneration, setOpenGeneration] = useState(true)
  const [openDistribution, setOpenDistribution] = useState(true)

  return (
    <Card className="w-full mx-auto overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-[#01b7ca] py-6">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-white" />
          <CardTitle className="text-white text-xl font-bold tracking-tight">BAJA TENSIÓN : TARIFA BT4</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-[#f4f9ff]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#01b7ca] w-full">
              <TableHead className="text-white font-medium w-[50%] py-4">TARIFA CON SIMPLE MEDICIÓN DE ENERGÍA ACTIVA Y CONTRATACIÓN O MEDICIÓN DE UNA POTENCIA 1E1P</TableHead>
              <TableHead className="text-white font-medium text-center py-4">UNIDAD</TableHead>
              <TableHead className="text-white font-medium text-center py-4">TARIFA</TableHead>
              <TableHead className="text-white font-medium text-center py-4">Consumo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-white hover:bg-[#f4f9ff] transition-colors w-full">
              <TableCell className="font-medium">Cargo Fijo Mensual</TableCell>
              <TableCell className="text-center">$/mes</TableCell>
              <TableCell className="text-center font-medium">4.37</TableCell>
              <TableCell className="text-center font-medium text-[#01b7ca]">24.20</TableCell>
            </TableRow>
            <TableRow className="bg-white hover:bg-[#f4f9ff] transition-colors w-full">
              <TableCell className="font-medium">Cargo por Energía Activa en Punta</TableCell>
              <TableCell className="text-center">ctm. $/kW.h</TableCell>
              <TableCell className="text-center font-medium">36.35</TableCell>
              <TableCell className="text-center font-medium text-[#01b7ca]">66.95</TableCell>
            </TableRow>
            
            {/* Sección desplegable: Cargo por Potencia Activa de generación */}
            <tr className="w-full">
              <td colSpan={4} className="p-0 w-full">
                <Collapsible open={openGeneration} onOpenChange={setOpenGeneration} className="w-full">
                  <CollapsibleTrigger className="w-full">
                    <div 
                      className="bg-[#d9eeff] cursor-pointer hover:bg-[#c5e4ff] transition-colors py-3 px-4 w-full flex items-center font-semibold text-[#01b7ca]"
                    >
                      {openGeneration ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                      Cargo por Potencia Activa de generación para Usuarios:
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="w-full">
                    <Table className="w-full">
                      <TableBody>
                        <TableRow className="bg-white hover:bg-[#f4f9ff] transition-colors w-full">
                          <TableCell className="pl-8 border-l-4 border-[#01b7ca]">Presentes en Punta</TableCell>
                          <TableCell className="text-center">$/kW-mes</TableCell>
                          <TableCell className="text-center font-medium">65.81</TableCell>
                          <TableCell className="text-center font-medium text-[#01b7ca]">164.20</TableCell>
                        </TableRow>
                        <TableRow className="bg-white hover:bg-[#f4f9ff] transition-colors w-full">
                          <TableCell className="pl-8 border-l-4 border-[#01b7ca]">Presentes Fuera de Punta</TableCell>
                          <TableCell className="text-center">$/kW-mes</TableCell>
                          <TableCell className="text-center font-medium">39.20</TableCell>
                          <TableCell className="text-center font-medium text-[#01b7ca]">86.65</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CollapsibleContent>
                </Collapsible>
              </td>
            </tr>
            
            {/* Sección desplegable: Cargo por Potencia Activa de redes de distribución */}
            <tr className="w-full">
              <td colSpan={4} className="p-0 w-full">
                <Collapsible open={openDistribution} onOpenChange={setOpenDistribution} className="w-full">
                  <CollapsibleTrigger className="w-full">
                    <div 
                      className="bg-[#d9eeff] cursor-pointer hover:bg-[#c5e4ff] transition-colors py-3 px-4 w-full flex items-center font-semibold text-[#01b7ca]"
                    >
                      {openDistribution ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                      Cargo por Potencia Activa de redes de distribución para Usuarios:
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="w-full">
                    <Table className="w-full">
                      <TableBody>
                        <TableRow className="bg-white hover:bg-[#f4f9ff] transition-colors w-full">
                          <TableCell className="pl-8 border-l-4 border-[#01b7ca]">Presentes en Punta</TableCell>
                          <TableCell className="text-center">$/kW-mes</TableCell>
                          <TableCell className="text-center font-medium">66.42</TableCell>
                          <TableCell className="text-center font-medium text-[#01b7ca]">106.65</TableCell>
                        </TableRow>
                        <TableRow className="bg-white hover:bg-[#f4f9ff] transition-colors w-full">
                          <TableCell className="pl-8 border-l-4 border-[#01b7ca]">Presentes Fuera de Punta</TableCell>
                          <TableCell className="text-center">$/kW-mes</TableCell>
                          <TableCell className="text-center font-medium">57.83</TableCell>
                          <TableCell className="text-center font-medium text-[#01b7ca]">120.20</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CollapsibleContent>
                </Collapsible>
              </td>
            </tr>
            
            <TableRow className="bg-[#ffeeee] hover:bg-[#ffe0e0] transition-colors w-full">
              <TableCell className="font-medium">Cargo por Energía Reactiva que exceda el 30% del total de la Energía Activa</TableCell>
              <TableCell className="text-center">ctm. $/kVAr.h</TableCell>
              <TableCell className="text-center font-medium">5.45</TableCell>
              <TableCell className="text-center font-medium text-[#01b7ca]">106.65</TableCell>
            </TableRow>
            
            <TableRow className="bg-[#01b7ca] text-white w-full">
              <TableCell colSpan={3} className="text-right font-semibold">Costo total</TableCell>
              <TableCell className="text-center font-bold text-xl">5,678.89</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}