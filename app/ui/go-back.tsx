'use client'

import { CircleArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function GoBack() {
  const router = useRouter()

  return (
    <CircleArrowLeft className='absolute h-6 w-6 text-gray-500 cursor-pointer bottom-24'  onClick={() => router.push('/ocupacional/dashboard/covid')}/>
  )
}
