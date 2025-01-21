import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/app/ui/home.module.css"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function loading() {
  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <Skeleton className="h-10 w-56 ml-4" />
        <Skeleton className="h-10 w-64 ml-4" />
      </div>
      <div className='flex gap-4 mx-8'>
        <Card>
          {/* <CardHeader>
            <CardTitle className="text-2xl font-bold text-center"><Skeleton className="w-64 h-10"/></CardTitle>
          </CardHeader> */}
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="min-w-80 h-10 rounded-lg"/>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-20 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-36 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
              </div>
               <div>
                <Skeleton className="min-w-80 h-10 rounded-lg"/>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-20 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-36 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-20 h-6"/>
                  <Skeleton className="w-36 h-6"/>
                </div>
              </div>
               <div>
                <Skeleton className="min-w-80 h-10 rounded-lg"/>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-20 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-36 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
              </div>
              <div>
                <Skeleton className="min-w-80 h-10 rounded-lg"/>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-20 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
                <div className="flex p-2 justify-between">
                  <Skeleton className="w-36 h-6"/>
                  <Skeleton className="w-20 h-6"/>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full flex-1">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead> <Skeleton className="w-16 h-9"/></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9"/></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9"/></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9"/></TableHead>
                  <TableHead> <Skeleton className="w-16 h-9"/></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell> <Skeleton className="w-16 h-9"/></TableCell>
                  <TableCell> <Skeleton className="w-16 h-9"/></TableCell>
                  <TableCell> <Skeleton className="w-16 h-9"/></TableCell>
                  <TableCell> <Skeleton className="w-16 h-9"/></TableCell>
                  <TableCell > <Skeleton className="w-16 h-9"/></TableCell>
                </TableRow>
              </TableBody>
              
            </Table>
          </CardContent>
          <div className="flex justify-between">
              <div>
                <Skeleton className="w-40 h-8"/>
              </div>
              <div>
                <Skeleton className="w-40 h-8"/>
              </div>
            </div>
        </Card>
      </div>
    </div>
  )
}
