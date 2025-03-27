'use client'
import { useState } from "react"

const barOptions = ['Resumen de consumos', 'Tarifario', 'Historial de consumo']

export default function OptionBar() {
  const [optionSelected, setOptionSelected] = useState('Resumen de consumos')

  return (
    <>
        {
            barOptions.map(option => (
                <div key={option} onClick={() => setOptionSelected(option)} className={`${optionSelected === option ? 'bg-gray-200' : 'bg-gray-100'} p-4 cursor-pointer`}>
                    <p>{option}</p>
                </div>
            ))
        }
    </>
    
  )
}
