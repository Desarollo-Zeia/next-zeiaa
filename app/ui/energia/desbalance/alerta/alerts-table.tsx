import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

export default function AlertTable() {
  return (
    <Card className="w-full p-6 flex flex-col gap-4">
        <div className="p-4 bg-slate-100">
            <p className="text-sm">Tabla general</p>
        </div>
        <div className="overflow-x-auto">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="text-sm font-medium text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground">Hora</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground">Neutro</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground">R</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground">S</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground">T</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="text-sm">Miercóles 12 de Julio de 2024</TableCell>
                    <TableCell className="text-sm">11:00 a.m</TableCell>
                    <TableCell className="text-sm">220A</TableCell>
                    <TableCell className="text-sm">420A</TableCell>
                    <TableCell className="text-sm">220A</TableCell>
                    <TableCell className="text-sm">530A</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </div>
    </Card>
  )
}
