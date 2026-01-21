import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MonitoreoSkeleton() {
  return (
    <div className="py-4">
      <div className="flex gap-4 mx-2">
        {/* Tabla LEYENDA Skeleton */}
        <Card className="w-[450px] shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              <Skeleton className="w-24 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">
                    <Skeleton className="w-28 h-4" />
                  </TableHead>
                  <TableHead className="text-center w-[70px]">
                    <Skeleton className="w-14 h-4 mx-auto" />
                  </TableHead>
                  <TableHead className="text-center" colSpan={2}>
                    <Skeleton className="w-24 h-4 mx-auto" />
                  </TableHead>
                  <TableHead className="text-center w-[80px]">
                    <Skeleton className="w-16 h-4 mx-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TableRow key={i}>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Skeleton className="w-4 h-4 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Skeleton className="w-12 h-4 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Skeleton className="w-12 h-4 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Skeleton className="w-12 h-4 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Gráfica Skeleton */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="w-32 h-5 mb-1" />
                <Skeleton className="w-40 h-4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-16 h-9" />
                <Skeleton className="w-16 h-9" />
                <Skeleton className="w-16 h-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-[400px]" />
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
