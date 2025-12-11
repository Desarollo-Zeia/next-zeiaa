// "use client"

// import { Eye, EyeOff, Lock, SendToBack, User, Loader2 } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { useState } from "react"
// import { useActionState } from "react"
// import { actionAmbiental } from "../actions/validation"

// export default function Page() {
//   const [showPassword, setShowPassword] = useState<boolean>(false)
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [state, formAction] = useActionState(actionAmbiental, { message: "" })

//   const handleSubmit = async (formData: FormData) => {
//     setIsLoading(true)
//     try {
//       await formAction(formData)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <main className="relative min-h-screen bg-[#ebeef1]">
//       {/* Gradient background */}
//       <div
//         className="absolute inset-0"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 20% 20%, rgba(0, 183, 202, 0.1) 0%, transparent 30%),
//             radial-gradient(circle at 80% 50%, rgba(0, 186, 167, 0.1) 0%, transparent 30%),
//             radial-gradient(circle at 40% 80%, rgba(0, 193, 83, 0.1) 0%, transparent 30%),
//             linear-gradient(to right, rgba(0, 183, 202, 0.05), rgba(0, 193, 83, 0.05))
//           `,
//         }}
//       />

//       {/* Logo */}
//       <div className="absolute left-0 top-0 p-8">
//         <Image src="/zeia-logo-first.png" width={120} height={80} className="h-12 w-auto" alt="Logo zeia" priority />
//       </div>

//       {/* Login Form */}
//       <div className="flex min-h-screen items-center justify-center p-8">
//         <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white/95 p-8 shadow-lg backdrop-blur-sm">
//           {/* Decorative elements */}
//           <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-r from-[rgb(0,183,202)]/10 to-[rgb(0,186,167)]/10 blur-2xl" />
//           <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-r from-[rgb(0,186,167)]/10 to-[rgb(0,193,83)]/10 blur-2xl" />

//           {/* Form content */}
//           <div className="relative">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="bg-gradient-to-r from-[rgb(0,183,202)] to-[rgb(0,186,167)] bg-clip-text text-2xl font-bold text-transparent">
//                   Inicia sesión
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">Ingrese a su cuenta</p>
//               </div>
//               <Link href="/" className="rounded-full p-2 transition-colors hover:bg-gray-100">
//                 <SendToBack className="h-5 w-5 text-gray-400" />
//               </Link>
//             </div>

//             <form className="mt-8 space-y-6" action={handleSubmit}>
//               <div className="space-y-4">
//                 <div className="group relative">
//                   <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 focus-within:border-[rgb(0,183,202)] focus-within:ring-4 focus-within:ring-[rgb(0,183,202)]/10">
//                     <User className="ml-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="email"
//                       name="email"
//                       className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
//                       placeholder="example@zeia.com.pe"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="group relative">
//                   <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 focus-within:border-[rgb(0,183,202)] focus-within:ring-4 focus-within:ring-[rgb(0,183,202)]/10">
//                     <Lock className="ml-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
//                       placeholder="****"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="px-3 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {state.message && <p className="text-center text-sm text-red-500">{state.message}</p>}

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[rgb(0,183,202)] to-[rgb(0,186,167)] p-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[rgb(0,183,202)] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Iniciando sesión...
//                   </div>
//                 ) : (
//                   "Ingresar"
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page

