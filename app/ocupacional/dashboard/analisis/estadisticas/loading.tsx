import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/app/ui/home.module.css"
import { CardTitle } from "@/components/ui/card"

export default function loading() {
  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <Skeleton className="h-10 w-56 ml-4" />
        <Skeleton className="h-10 w-64 ml-4" />
      </div>
      <div className="flex justify-between">
        <div>
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
        </div>
        <div className="flex flex-row gap-2 mt-10">
          <Skeleton className="w-16 h-9"/>
          <Skeleton className="w-16 h-9"/>
        </div>
      </div>
      <div className="w-full">
        <Skeleton className="w-11/12 h-[400px] bg-gray-50 mx-12 mt-6"/>
      </div>
    </div>
  )
}
