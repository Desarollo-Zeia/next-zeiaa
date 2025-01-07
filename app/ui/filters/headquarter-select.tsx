'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface Headquarter {
  id:number
  name:string
}

interface Headquarters {
  count: number,
  next: string,
  previous: string,
  results : Headquarter[]
}

export default function HeadquarterSelect({ headquarters } : { headquarters : Headquarters }) {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleRoomChange = (headquearter: string) => {
    const params = new URLSearchParams(searchParams);
    if (headquearter) {
      params.set('headquearter', headquearter);
    } 

    if (headquearter === 'none') {
      params.delete('headquearter');
    }

    replace(`${pathname}?${params.toString()}`);
  }
  
  return (
    <Select onValueChange={handleRoomChange}>
      <SelectTrigger className="w-[240px] bg-[#00b0c7]">
        <SelectValue placeholder="Selecciona una sede" className="text-white font-bold"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='none'>Sin área</SelectItem>
        {
          headquarters?.results?.map((headquarter : Headquarter) => (
            <SelectItem key={headquarter.id} value={String(headquarter.id)} >{headquarter.name}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}
