'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

const barOptions = ['Resumen de consumos', 'Tarifario', 'Historial de consumo']

export default function OptionBar() {

  const [optionSelected, setOptionSelected] = useState('Resumen de consumos')

  const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()
 
 
    const handleClickOption = (option: string) => {
      setOptionSelected(option)
  
      startTransition(() => {
        const params = new URLSearchParams(searchParams)
        params.set("selected", option)
        replace(`${pathname}?${params.toString()}`)
      })
    }

  return (
    <>
        {
            barOptions.map(option => (
                <div key={option} onClick={() => handleClickOption(option)} className={`${optionSelected === option ? 'bg-gray-200' : 'bg-gray-100'} p-4 cursor-pointer`}>
                    <p>{option}</p>
                    {isPending && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                </div>
            ))
        }
    </>
    
  )
}
