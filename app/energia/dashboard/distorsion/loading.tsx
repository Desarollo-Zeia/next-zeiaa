import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      {/* Header with dropdowns and date selector skeletons */}
      <div className="flex flex-col md:flex-row justify-end mb-8 gap-4">
        <Skeleton className="h-10 w-full md:w-60 bg-gray-100" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-100" />
        <Skeleton className="h-10 w-full md:w-60 bg-gray-100" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-56 bg-gray-100" />
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-32 bg-gray-100" />
          <Skeleton className="h-10 w-32 bg-gray-100" />
          <Skeleton className="h-10 w-34 bg-gray-100" />
        </div>
      </div>
      <Skeleton className="w-full h-96 bg-gray-100"/>
    </div>
  )
}
