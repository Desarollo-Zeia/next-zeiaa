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
    total_consumption: number
    cost: number
    first_value: number
    last_value: number
    date_first_value: string
    date_last_value: string
}

export default function CycleClientInfoTable({ tariffData }: { tariffData: TariffData }) {

    const formattedDateAfter = format(new Date(tariffData?.billing_cycle_start), 'dd-MM-yyyy')
    const formattedDateBefore = format(new Date(tariffData?.billing_cycle_end), 'dd-MM-yyyy')

    return (
        <Table className='rounded-t-lg overflow-hidden'>
            <TableHeader>
                <TableRow className="bg-[#01b7ca] hover:bg-[#01b7ca] border-b-0">
                    <TableHead className="text-white font-medium bg-[#01b7ca] text-center">Empresa concesionaria</TableHead>
                    <TableHead className="text-white font-medium bg-[#01b7ca] text-center">N° de Suministro</TableHead>
                    <TableHead className="text-white font-medium bg-[#01b7ca] text-center">Días facturados</TableHead>
                    <TableHead className="text-white font-medium bg-[#01b7ca] text-center">Ciclo de facturación</TableHead>
                    <TableHead className="text-white font-medium bg-[#01b7ca] text-center">Potencia contratada</TableHead>
                    <TableHead className="text-white font-medium bg-[#01b7ca] text-center">Tipo</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">{tariffData.energy_provider}</TableCell>
                    <TableCell className="font-medium text-center">{tariffData.supply_number || "N/A"}</TableCell>
                    <TableCell className="font-medium text-center">{tariffData.ratedays} días</TableCell>
                    <TableCell className="font-medium text-center">{`${formattedDateAfter} - ${formattedDateBefore}`}</TableCell>
                    <TableCell className="font-medium text-center">{tariffData.power_contracted}kW</TableCell>
                    <TableCell className="font-medium text-center">{`${tariffData.electrical_panel_type} ${tariffData.electrical_panel_threads} hilos`}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
