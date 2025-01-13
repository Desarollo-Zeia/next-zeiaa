'use client'
import { Input } from '@/components/ui/input';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Search } from "lucide-react"
import { useDebouncedCallback } from 'use-debounce';

export default function RoomSearchFilter() {

   const searchParams = useSearchParams()
   const pathname = usePathname()
   const params = new URLSearchParams(searchParams)
   const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((search) => {
    
   
    if (search) {
      params.set('search', search)
      params.delete('offset')
    } else {
      params.delete('search')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative">
        <Input
          type="text"
          placeholder="Search rooms..."
          className="max-w-xs"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get('query')?.toString()}
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3">
          <Search className="h-5 w-5"/>
        </div>
      </div>
  )
}
