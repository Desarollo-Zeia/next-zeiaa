import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/app/ui/home.module.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PicosSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <Skeleton className="h-10 w-48 ml-4" />
        <Skeleton className="h-10 w-48 ml-4" />
      </div>
      <div className='flex gap-4 mx-8'>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center"><Skeleton className="w-64 h-10" /></CardTitle>
            <Skeleton className="w-32 h-6" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="min-w-80 h-44" />
              {/* <Skeleton className="min-w-80 h-14"/> */}
              {/* <Skeleton className="min-w-80 h-14"/> */}
            </div>
            {/* <div className="mt-6 flex justify-center space-x-4">
              <Skeleton className="w-24 h-10"/>
              <Skeleton className="w-24 h-10"/>
            </div> */}
          </CardContent>
        </Card>
        <Card className="w-full flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2 gap-2">
              <Skeleton className="w-16 h-9" />
              <Skeleton className="w-16 h-9" />
            </CardHeader>
            {/* <Skeleton className="w-48 h-9"/> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead> <Skeleton className="w-16 h-9" /></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9" /></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9" /></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9" /></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell> <Skeleton className="w-16 h-9" /></TableCell>
                  <TableCell> <Skeleton className="w-16 h-9" /></TableCell>
                  <TableCell> <Skeleton className="w-16 h-9" /></TableCell>
                  <TableCell> <Skeleton className="w-16 h-9" /></TableCell>
                  <TableCell > <Skeleton className="w-16 h-9" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <div className="flex justify-between">
            <div>
              <Skeleton className="w-40 h-8" />
            </div>
            <div>
              <Skeleton className="w-40 h-8" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
