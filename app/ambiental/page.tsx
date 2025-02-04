'use client'
import styles from '@/app/ui/home.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { SendToBack , User, Lock, Eye, EyeOff  } from 'lucide-react';
import { useState, useActionState } from 'react';
import { actionAmbiental } from '../actions/validation';

export default function Page() {    

    const [avaiblePassword, setAvaiblePassword] = useState<boolean>(false)
    const [state, formAction] = useActionState(actionAmbiental, { message: '' });

  return (
    <section className={styles.background}>
        <Image
            src='/logozeia.png'
            width={120}
            height={80}
            className='p-4 absolute'
            alt='Logo zeia initial screen'
        />
      <form className='w-full flex justify-end items-center gap-8 p-8' action={formAction}>
        <div className='w-[350px] h-auto bg-white rounded-lg p-8 flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-lg'>Inicia sesión</p>
                <Link href='/'> 
                    <SendToBack className='w-4 h-4'/>
                </Link>
            </div>
            <p className='text-xs text-green-500'>Ingrese a su cuenta</p>
            <div className='flex flex-col gap-2'>
                <div className="flex items-center bg-gray-100 border-[1px] border-gray-300 transition-all duration-400 focus-within:border-green-100 focus-within:border-[1px] focus-within:border-solid rounded-md overflow-hidden box-border focus-within:shadow-[1px_2px_4px_rgba(0,0,0,0.9)] focus-within:shadow-slate-400">
                    <User className="w-4 h-4 ml-2 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        className="flex-1 bg-transparent outline-none p-2 box-border text-xs"
                        placeholder="example@zeia.com.pe"
                        required
                    />
                </div>
                <div className="flex items-center bg-gray-100 border-[1px] border-gray-300 transition-all duration-400 focus-within:border-green-100 focus-within:border-[1px] focus-within:shadow-[1px_2px_4px_rgba(0,0,0,0.9)] focus-within:border-solid rounded-md overflow-hidden box-border c focus-within:shadow-slate-400">
                    <Lock className="w-4 h-4 ml-2 text-gray-400" />
                    <input
                        type={avaiblePassword ? 'text' : 'password'}
                        className="flex-1 bg-transparent outline-none p-2 box-border text-xs"
                        placeholder="****"
                        name='password'
                        required
                    />
                    { avaiblePassword ? <Eye className='h-4 w-4 mr-2 cursor-pointer' onClick={() => setAvaiblePassword(false)}/> : <EyeOff className='w-4 h-4 mr-2 cursor-pointer' onClick={()=> setAvaiblePassword(true)}/>}
                </div>
            </div>
            <div className="h-4 text-sm text-center text-[#ED4337] font-thin">
                {state.message && <p>{state.message}</p>}
            </div>
            <button className={styles.buttonservice}>
                <input type="submit"  placeholder='Ingresar' className='w-full h-full'/>
            </button>
        </div>
      </form>
    </section>
  )
}   
