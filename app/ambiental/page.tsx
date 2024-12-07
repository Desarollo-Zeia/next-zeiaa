'use client'
import styles from '@/app/ui/home.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { CircleX, User, Lock  } from 'lucide-react';


export default function Page() {

  return (
    <section className={styles.background}>
        <Image
            src='/logozeia.png'
            width={120}
            height={80}
            className='p-4 absolute'
            alt='Logo zeia initial screen'
        />
      <div className='w-full flex justify-end items-center gap-8 p-8'>
        <div className='w-[350px] h-auto bg-white rounded-lg p-4 flex flex-col gap-2'>
            <div className='flex justify-between'>
                <p className='font-semibold text-lg'>Inicia sesión</p>
                <Link href='/'> 
                    <CircleX className='w-5 h-5'/>
                </Link>
            </div>
            <p className='text-xs text-green-500'>Ingrese a su cuenta</p>
            <div className='flex flex-col gap-2'>
                <div className="flex items-center bg-gray-100 border-[1px] border-gray-300 transition-all duration-400 focus-within:border-green-100 focus-within:border-[1px] focus-within:border-solid rounded-md overflow-hidden box-border focus-within:shadow-[1px_2px_4px_rgba(0,0,0,0.9)] focus-within:shadow-slate-400">
                    <User className="w-4 h-4 ml-2 text-gray-400" />
                    <input
                        type="text"
                        className="flex-1 bg-transparent outline-none p-2 box-border text-xs"
                        placeholder="example@zeia.com.pe"
                    />
                </div>
                <div className="flex items-center bg-gray-100 border-[1px] border-gray-300 transition-all duration-400 focus-within:border-green-100 focus-within:border-[1px] focus-within:shadow-[1px_2px_4px_rgba(0,0,0,0.9)] focus-within:border-solid rounded-md overflow-hidden box-border c focus-within:shadow-slate-400">
                    <Lock className="w-4 h-4 ml-2 text-gray-400" />
                    <input
                        type="text"
                        className="flex-1 bg-transparent outline-none p-2 box-border text-xs"
                        placeholder="****"
                    />
                </div>
            </div>
            <div>
                <Link href='/' className={styles.buttonservice}>
                    <p className='text-xs text-center w-full'>Ingresar</p>
                </Link>
            </div>
        </div>
      </div>
    </section>
  )
}
