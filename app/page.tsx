import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Module } from "./lib/definitions"

function ModuleCard({ image, name, description, route }: Module) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/80 p-6 shadow-lg transition-all duration-300 hover:bg-white hover:shadow-xl">
      <div className="flex items-center gap-4">
        {image && (
          <div className="rounded-lg bg-gradient-to-r from-[rgb(0,183,202)]/10 to-[rgb(0,186,167)]/10 p-3">
            <Image
              src={image || "/placeholder.svg"}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              alt=""
            />
          </div>
        )}
        <h3 className="bg-gradient-to-r from-[rgb(0,183,202)] to-[rgb(0,186,167)] bg-clip-text text-xl font-bold text-transparent">
          {name}
        </h3>
      </div>

      <p className="mt-4 text-sm/relaxed text-gray-600">{description}</p>

      <Link
        href={route}
        className="group/link mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[rgb(0,183,202)] to-[rgb(0,186,167)] px-4 py-2 text-sm font-medium text-white transition-all hover:translate-x-1"
      >
        Ingresar
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#f5f7f9]">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0, 183, 202, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 80% 50%, rgba(0, 186, 167, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 40% 80%, rgba(0, 193, 83, 0.08) 0%, transparent 25%),
            linear-gradient(to right, rgba(0, 183, 202, 0.05), rgba(0, 193, 83, 0.05))
          `,
        }}
      />

      {/* Content */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Logo */}
          <div className="py-8">
            <Image src="/logozeia.png" width={120} height={80} className="h-12 w-auto" alt="Logo zeia" priority />
          </div>

          {/* Hero Section */}
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="relative max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-[#4d5a64] sm:text-6xl">
                Soluciones de{" "}
                <span className="bg-gradient-to-r from-[rgb(0,183,202)] via-[rgb(0,186,167)] to-[rgb(0,193,83)] bg-clip-text text-transparent">
                  monitoreo
                </span>{" "}
                inteligente
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Optimiza tus recursos y protege el medio ambiente con nuestras soluciones de monitoreo avanzado.
              </p>
            </div>

            {/* Services Grid */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ModuleCard
                image="/co2service.png"
                name="Monitoreo de Agentes Contaminantes"
                description="Asegura un ambiente saludable controlando CO2, TVOC, HCHO, PM y luz en espacios interiores."
                route="/ocupacional"
              />
              <ModuleCard
                image="/monitoreoservice.png"
                name="Monitoreo Ambiental"
                description="Control avanzado de gases y agentes ambientales como PM, Cloro, Amoniaco entre otros, contribuyendo a disminuir la contaminación ambiental."
                route="/ambiental"
              />
              <ModuleCard
                image="/monitoreoservice.png"
                name="Monitoreo Energético"
                description="Controla tu consumo de energía para ahorrar costos, mejorar la eficiencia y reducir el impacto ambiental."
                route="/energia"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

