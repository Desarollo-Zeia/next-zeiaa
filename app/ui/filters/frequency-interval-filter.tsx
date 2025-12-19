'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react'

type Time = {
  id: number,
  value: number | null,
  label: string
}


const timeOptions = [
  { id: 0, value: null, label: "5 minutos" },
  { id: 1, value: 15, label: "15 minutos" },
  { id: 2, value: 30, label: "30 minutos" },
  { id: 3, value: 60, label: "1 hora" },
  { id: 4, value: 240, label: "4 horas" },
  { id: 5, value: 360, label: "6 horas" },
  { id: 6, value: 720, label: "12 horas" },
  { id: 7, value: 1440, label: "24 horas" }
]

export default function FrequencyIntervalFilter({ interval }: { interval: string }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()


  const hanldeIntervalFrequency = (interval: string) => {

    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString())

      newParams.set('interval', interval)

      if (!interval) {
        newParams.delete('interval')
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    });
  }

  return (
    <div className="relative">
      <Select
        onValueChange={hanldeIntervalFrequency}
        value={interval}
        disabled={isPending}
      >
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue
            placeholder={isPending ? "Cargando..." : "Selecciona un frecuencia de intervalo"}
            className="text-white font-bold"
          />
        </SelectTrigger>
        <SelectContent>
          {timeOptions?.map((time: Time) => (
            <SelectItem
              key={time.id}
              value={String(time.value)}
            // className={room.is_activated ? 'text-black' : 'text-gray-300'}
            >
              {time.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}
