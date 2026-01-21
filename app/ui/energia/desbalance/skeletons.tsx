import { Skeleton } from "@/components/ui/skeleton"

export function FiltersSkeleton() {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Skeleton className="h-10 w-48 bg-gray-200" />
      <Skeleton className="h-10 w-48 bg-gray-200" />
      <Skeleton className="h-10 w-48 bg-gray-200" />
      <Skeleton className="h-10 w-64 bg-gray-200" />
    </div>
  )
}

export function Top3Skeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-64 mx-auto mb-3 bg-gray-200" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-5 w-32 mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-24 mb-1 bg-gray-200" />
            <div className="flex gap-4 mt-2">
              <Skeleton className="h-4 w-16 bg-gray-200" />
              <Skeleton className="h-4 w-16 bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="w-full mt-3">
      <Skeleton className="h-[350px] w-full bg-gray-200 rounded-lg" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="w-full h-auto space-y-6">
      <FiltersSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pl-4">
        <Top3Skeleton />
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-48 mb-3 bg-gray-200" />
          <ChartSkeleton />
        </div>
      </div>
    </div>
  )
}
