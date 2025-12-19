import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/app/ui/home.module.css"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const RoomStatusCardSkeleton = () => (
  <Card className="max-w-xs shadow-lg">
    <CardContent className="p-6">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-[64px] h-[64px]" />
        </div>
        <div className="flex flex-col flex-1 items-end gap-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-1/2 h-6" />
        </div>
      </div>

      {/* Middle Section */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between gap-4">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-full h-6" />
        </div>
        <div className="flex justify-between gap-4">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-full h-6" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-sm text-muted-foreground mb-4">
        <Skeleton className="w-1/2 h-6" />
      </div>
    </CardContent>
    <CardFooter>
      <div
        className="w-full"
      >
        <Skeleton className="w-full h-8" />
      </div>
    </CardFooter>
  </Card>
)

export default function RoomSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <Skeleton className="h-10 w-48 ml-4" />
        <Skeleton className="h-10 w-48 ml-4" />
      </div>
      <section className={styles.roomCardsContainer}>
        {[...Array(12)].map((_, index) => (
          <RoomStatusCardSkeleton key={index} />
        ))}
      </section>
      <div className={styles.paginationContainer}>
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
    </div>
  )
}

