import { Skeleton } from "@/components/ui/skeleton"

export default function VoltageSkeleton() {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header dropdowns skeleton */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
          <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
        </div>
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
      </div>

      {/* Voltage dropdown skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-60 bg-gray-200" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto mb-8">
        <div className="w-full">
          {/* Table header */}
          <div className="flex border-b pb-4">
            <Skeleton className="h-6 w-32 bg-gray-200 mr-4" />
            <Skeleton className="h-6 w-24 bg-gray-200 mr-4" />
            <Skeleton className="h-6 w-36 bg-gray-200 mr-4" />
            <Skeleton className="h-6 w-36 bg-gray-200 mr-4" />
            <Skeleton className="h-6 w-36 bg-gray-200" />
          </div>

          {/* Table rows */}
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex py-4 border-b">
                <Skeleton className="h-5 w-40 bg-gray-200 mr-4" />
                <Skeleton className="h-5 w-16 bg-gray-200 mr-4" />
                <Skeleton className="h-5 w-16 bg-gray-200 mr-4" />
                <Skeleton className="h-5 w-16 bg-gray-200 mr-4" />
                <Skeleton className="h-5 w-16 bg-gray-200" />
              </div>
            ))}
        </div>
      </div>

      {/* Time filter and chart section */}
      <div className="mt-8 flex flex-col md:flex-row justify-between">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          <Skeleton className="h-10 w-24 bg-gray-200" />
          <Skeleton className="h-10 w-24 bg-gray-200" />
          <Skeleton className="h-10 w-32 bg-gray-200" />
          <Skeleton className="h-10 w-24 bg-gray-200" />
        </div>

        <div className="w-full md:w-1/2">
          <Skeleton className="h-8 w-48 bg-gray-200 mb-4" />
          <Skeleton className="h-40 w-full bg-gray-200" />
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="mt-8 flex items-center justify-between">
        <Skeleton className="h-8 w-24 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 bg-gray-200" />
          <Skeleton className="h-8 w-8 bg-gray-200" />
          <Skeleton className="h-8 w-8 bg-gray-200" />
          <Skeleton className="h-8 w-8 bg-gray-200" />
          <Skeleton className="h-8 w-24 bg-gray-200" />
        </div>
        <Skeleton className="h-6 w-48 bg-gray-200 hidden md:block" />
      </div>
    </div>
  )
}

