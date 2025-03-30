import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EnergyDashboardSkeleton() {
  return (
    <div className="container mx-auto p-4">
      {/* Top navigation */}
      
      <div className="flex flex-col md:flex-row justify-end mb-8 gap-4">
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-200" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consumption calculator skeleton */}
        <Card className="p-6 col-span-1 shadow-sm">
          <Skeleton className="h-6 w-48 mb-6" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-36 mb-3" />
              <Skeleton className="h-10 w-28" />
            </div>
            <div>
              <Skeleton className="h-4 w-36 mb-3" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </Card>

        {/* Current billing cycle skeleton */}
        <Card className="p-6 col-span-1 md:col-span-2 shadow-sm">
          <Skeleton className="h-6 w-64 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={`top-${i}`}>
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={`bottom-${i}`}>
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-5 w-24" />
              </div>  
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-8">
          <div className="pt-8">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Skeleton className="h-16 w-16 rounded-full mb-4" />
              <Skeleton className="h-6 w-64 mb-3" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
        </div>
    </div>
  )
}

