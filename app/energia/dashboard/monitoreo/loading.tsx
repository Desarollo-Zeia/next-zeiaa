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

      {/* Power info boxes skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* View type tabs skeleton */}
      <div className="flex justify-end mb-4">
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Legend skeleton */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Help button skeleton */}
      <div className="mb-8">
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Graph placeholder skeleton */}
      <div className="border border-gray-200 rounded-md p-4 mb-8 h-[300px] relative">
        {/* Y-axis labels skeletons */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Horizontal dotted lines */}
        <div className="absolute left-8 right-4 top-[20%] border-t border-dotted border-gray-200"></div>
        <div className="absolute left-8 right-4 top-[40%] border-t border-dotted border-gray-200"></div>
        <div className="absolute left-8 right-4 top-[60%] border-t border-dotted border-gray-200"></div>
        <div className="absolute left-8 right-4 top-[80%] border-t border-dotted border-gray-200"></div>

        {/* X-axis label skeleton */}
        <div className="absolute bottom-2 right-[50%] h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Excess power section skeleton */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        <div className="space-y-6 mt-6">
          <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

