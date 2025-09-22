import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TriangleAlert } from "lucide-react"

export default function AlertTestSheet({ count }: { count?: number }) {
  return (
    <Sheet>
      <SheetTrigger className='relative flex items-center justify-center '>
        <TriangleAlert className='h-8 w-8 animate-pulse' />
        <div className='absolute rounded-full bg-[#59ac77] flex items-center justify-center -top-3 -right-4 text-white text-sm p-[4px]'>
          <p>{count}</p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
