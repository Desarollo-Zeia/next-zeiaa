"use client"

import { Eye, EyeOff, Lock, SendToBack, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useActionState } from "react"
import { actionOccupational } from "../actions/validation"

export default function Page() {    

    const [avaiblePassword, setAvaiblePassword] = useState<boolean>(false)
    const [state, formAction] = useActionState(actionOccupational, { message: '' });

  return (
    <main className="relative min-h-screen bg-[#ebeef1]">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0, 183, 202, 0.1) 0%, transparent 30%),
            radial-gradient(circle at 80% 50%, rgba(0, 186, 167, 0.1) 0%, transparent 30%),
            radial-gradient(circle at 40% 80%, rgba(0, 193, 83, 0.1) 0%, transparent 30%),
            linear-gradient(to right, rgba(0, 183, 202, 0.05), rgba(0, 193, 83, 0.05))
          `,
        }}
      />

      {/* Logo */}
      <div className="absolute left-0 top-0 p-8">
        <Image src="/logozeia.png" width={120} height={80} className="h-12 w-auto" alt="Logo zeia" priority />
      </div>

      {/* Login Form */}
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white/95 p-8 shadow-lg backdrop-blur-sm">
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-r from-[rgb(0,183,202)]/10 to-[rgb(0,186,167)]/10 blur-2xl" />
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-r from-[rgb(0,186,167)]/10 to-[rgb(0,193,83)]/10 blur-2xl" />

          {/* Form content */}
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="bg-gradient-to-r from-[rgb(0,183,202)] to-[rgb(0,186,167)] bg-clip-text text-2xl font-bold text-transparent">
                  Inicia sesión
                </h2>
                <p className="mt-1 text-sm text-gray-500">Ingrese a su cuenta</p>
              </div>
              <Link href="/" className="rounded-full p-2 transition-colors hover:bg-gray-100">
                <SendToBack className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            <form className="mt-8 space-y-6" action={formAction}>
              <div className="space-y-4">
                <div className="group relative">
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 focus-within:border-[rgb(0,183,202)] focus-within:ring-4 focus-within:ring-[rgb(0,183,202)]/10">
                    <User className="ml-3 h-5 w-5 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        className="flex-1 bg-transparent outline-none p-2 box-border text-xs"
                        placeholder="example@zeia.com.pe"
                        required
                    />
                  </div>
                </div>

                <div className="group relative">
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 focus-within:border-[rgb(0,183,202)] focus-within:ring-4 focus-within:ring-[rgb(0,183,202)]/10">
                    <Lock className="ml-3 h-5 w-5 text-gray-400" />
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
            <input type="submit"  placeholder='Ingresar' className={styles.buttonservice}/>
        </div>
      </div>
    </main>
  )
}   
