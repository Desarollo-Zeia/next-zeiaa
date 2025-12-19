import { Skeleton } from "@/components/ui/skeleton";
import styles from "@/app/ui/home.module.css"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function AlertasSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <Skeleton className="h-10 w-48 ml-4" />
        <Skeleton className="h-10 w-48 ml-4" />
      </div>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2 gap-2">
          <Skeleton className="w-16 h-9" />
          <Skeleton className="w-16 h-9" />
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
  )
}
