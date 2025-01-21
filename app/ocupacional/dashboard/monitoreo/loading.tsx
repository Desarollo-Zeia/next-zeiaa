import styles from "@/app/ui/home.module.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function loading() {
  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <Skeleton className="h-10 w-48 ml-4" />
      </div>
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex flex-col gap-2">
          <Skeleton className="w-64 h-8"/>
          <Skeleton className="w-24 h-4"/>
        </CardTitle>
        <Skeleton className="w-16 h-16"/>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"><Skeleton className="w-24 h-6"/></TableHead>
              <TableHead className="w-[100px]"><Skeleton className="w-24 h-6"/></TableHead>
              <TableHead><Skeleton className="w-24 h-6"/></TableHead>
              <TableHead><Skeleton className="w-24 h-6"/></TableHead>
              <TableHead className="text-right"><Skeleton className="w-24 h-6"/></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium"><Skeleton className="w-6 h-6 rounded-full"/></TableCell>
              <TableCell className="font-medium"><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell className="text-right"><Skeleton className="w-24 h-6"/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium"><Skeleton className="w-6 h-6 rounded-full"/></TableCell>
              <TableCell className="font-medium"><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell className="text-right"><Skeleton className="w-24 h-6"/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium"><Skeleton className="w-6 h-6 rounded-full"/></TableCell>
              <TableCell className="font-medium"><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell className="text-right"><Skeleton className="w-24 h-6"/></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium"><Skeleton className="w-6 h-6 rounded-full"/></TableCell>
              <TableCell className="font-medium"><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell><Skeleton className="w-24 h-6"/></TableCell>
              <TableCell className="text-right"><Skeleton className="w-24 h-6"/></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
      <Card className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="w-16 h-9"/>
          <Skeleton className="w-16 h-9"/>
        </div>
        <CardHeader>
            <CardTitle>
              <Skeleton className="w-40 h-8"/>
            </CardTitle>
            <br/>
            <div className="w-full">
              <div className="text-xs font-medium mb-2"><Skeleton className="w-20 h-4"/></div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-orange-500 font-bold">---</div>
                  <span className="font-normal"><Skeleton className="w-24 h-6"/></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-red-500 font-bold">---</div>
                  <span className="font-normal"><Skeleton className="w-24 h-6"/></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-red-500 font-bold">---</div>
                  <span className="font-normal"><Skeleton className="w-24 h-6"/></span>
                </div>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[400px] bg-gray-50"/>
        </CardContent>
      
    </Card>
    </div>
    
  )
}
