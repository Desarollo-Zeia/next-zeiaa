import { Skeleton } from "@/components/ui/skeleton"

export function FiltersSkeleton() {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Skeleton className="h-10 w-48 bg-gray-200" />
      <Skeleton className="h-10 w-48 bg-gray-200" />
      <Skeleton className="h-10 w-48 bg-gray-200" />
      <Skeleton className="h-10 w-64 bg-gray-200" />
      <Skeleton className="h-10 w-32 bg-gray-200" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="w-full">
      {/* Table header */}
      <div className="flex border-b pb-4">
        <Skeleton className="h-6 w-32 bg-gray-200 mr-4" />
        <Skeleton className="h-6 w-24 bg-gray-200 mr-4" />
        <Skeleton className="h-6 w-36 bg-gray-200" />
      </div>

      {/* Table rows */}
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex py-4 border-b">
            <Skeleton className="h-5 w-40 bg-gray-200 mr-4" />
            <Skeleton className="h-5 w-16 bg-gray-200 mr-4" />
            <Skeleton className="h-5 w-16 bg-gray-200" />
          </div>
        ))}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-8 w-24 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 bg-gray-200" />
          <Skeleton className="h-8 w-8 bg-gray-200" />
          <Skeleton className="h-8 w-8 bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export function GraphSkeleton() {
  return (
    <div className="w-full">
      {/* Time filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-10 w-20 bg-gray-200" />
        <Skeleton className="h-10 w-20 bg-gray-200" />
        <Skeleton className="h-10 w-24 bg-gray-200" />
        <Skeleton className="h-10 w-20 bg-gray-200" />
      </div>

      {/* Chart area */}
      <Skeleton className="h-[350px] w-full bg-gray-200 rounded-lg" />
    </div>
  )
}
