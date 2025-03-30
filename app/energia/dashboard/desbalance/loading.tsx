import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-end mb-8 gap-4">
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
      </div>
      <div className="flex gap-4">
        <Card className="bg-slate-100 h-60 w-[340px] p-4 flex flex-col gap-4">
          <Skeleton className="h-16 flex-1 bg-gray-200" />
          <Skeleton className="h-16 flex-1 bg-gray-200" />
          <Skeleton className="h-16 flex-1 bg-gray-200" />
          <Skeleton className="h-16 flex-1 bg-gray-200" />
        </Card>
        <Card className="flex-1 p-4 flex flex-col gap-4">
          <div className="flex gap-4 justify-end">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-24 bg-gray-200" />
            </div>
            <Skeleton className="h-10 w-24 bg-gray-200" />
          </div>
          <div className="w-full bg-gray-100 h-32"/>
          <div className="w-full bg-gray-100 h-32"/>
          <div className="w-full bg-gray-100 h-32"/>
        </Card>
      </div>
    </div>
  )
}
