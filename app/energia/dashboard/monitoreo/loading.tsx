import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PowerDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with dropdowns and date selector skeletons */}
      <div className="flex flex-col md:flex-row justify-end mb-8 gap-4">
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
      </div>

      <div className="flex gap-4">
        <Card className="bg-slate-100 h-60 w-[340px] p-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-16 flex-1 bg-gray-200" />
            <Skeleton className="h-16 flex-1 bg-gray-200" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-full bg-gray-200" />
            <Skeleton className="h-6 w-full bg-gray-200" />
            <Skeleton className="h-6 w-full bg-gray-200" />
          </div>
          <Skeleton className="h-6 w-full bg-gray-200" />
        </Card>
        <Card className="flex-1 p-4 flex flex-col gap-4">
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-14 bg-gray-200" />
            <Skeleton className="h-10 w-14 bg-gray-200" />
          </div>
          <Skeleton className="h-96 w-full bg-gray-200" />
          <div className="w-full h-48 bg-gray-200"/>
        </Card>
      </div>
    </div>
  )
}

