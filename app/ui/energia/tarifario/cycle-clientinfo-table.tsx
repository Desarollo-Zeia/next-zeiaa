'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import React from 'react'

interface TariffData {
    power_contracted: number
    electrical_panel_type: string
    electrical_panel_threads: number
    energy_provider: string
    supply_number: string | null
    billing_cycle_start: string
    billing_cycle_end: string
    ratedays: number
    totalratedays: number
    total_consumption: number
    cost: number
    first_value: number
    last_value: number
    date_first_value: string
    date_last_value: string
}

export default function CycleClientInfoTable({ tariffData }: { tariffData: TariffData }) {


    return (
        <Table className='rounded-t-lg overflow-hidden'>
            <TableHeader>
                <TableRow className="bg-gray-100 border-t-2 border-b-0 hover:bg-gray-100">
                    <TableHead className="text-[#4D5A63] font-bold text-center">Empresa concesionaria</TableHead>
                    <TableHead className="text-[#4D5A63] font-bold text-center">N° de Suministro</TableHead>
                    <TableHead className="text-[#4D5A63] font-bold text-center">Días facturados</TableHead>
                    <TableHead className="text-[#4D5A63] font-bold text-center">Ciclo de facturación</TableHead>
                    <TableHead className="text-[#4D5A63] font-bold text-center">Potencia contratada</TableHead>
                    <TableHead className="text-[#4D5A63] font-bold text-center">Tipo</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableCell className="font-medium text-center text-[#4D5A63]">{tariffData.energy_provider || "Sin especificar"}</TableCell>
                    <TableCell className="font-medium text-center text-[#4D5A63]">{tariffData.supply_number || "N/A"}</TableCell>
                    <TableCell className="font-medium text-center text-[#4D5A63]">{tariffData.ratedays} de {tariffData.totalratedays} dias</TableCell>
                    <TableCell className="font-medium text-center text-[#4D5A63]">{`${tariffData.billing_cycle_start} - ${tariffData.billing_cycle_end}`}</TableCell>
                    <TableCell className="font-medium text-center text-[#4D5A63]">{tariffData.power_contracted}kW</TableCell>
                    <TableCell className="font-medium text-center text-[#4D5A63]">{`${tariffData.electrical_panel_type} ${tariffData.electrical_panel_threads} hilos`}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
