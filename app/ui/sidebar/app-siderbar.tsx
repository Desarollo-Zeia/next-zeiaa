'use client'

import {
  Zap,
  Battery,
  Gauge,
  AlertTriangle,
  AudioWaveformIcon as WaveformIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const energyItems = [
  {
    title: "Consumo energético",
    url: "/energia/dashboard",
    icon: Zap,
  },
  {
    title: "Consumo tarifario",
    url: "/energia/dashboard/tarifario",
    icon: Battery,
  },
  {
    title: "Monitoreo de potencia",
    url: "/energia/dashboard/monitoreo",
    icon: Gauge,
  },
  {
    title: "Desbalance de carga",
    url: "/energia/dashboard/desbalance",
    icon: AlertTriangle,
  },
  {
    title: "Tasa de distorsión",
    url: "/energia/dashboard/distorsion",
    icon: WaveformIcon,
  },
]

export function AppSidebar() {

  const pathname = usePathname()

  const userinfo = {
    name: "",
    email: "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavUser userinfo={userinfo} />
      </SidebarHeader>
      <SidebarContent className="relative">
        <SidebarGroup>
          <SidebarGroupLabel>Gestión energética</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {energyItems.map((item) => (
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild data-active={pathname === item.url && 'true'} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="w-full absolute bottom-0 p-8 flex items-center justify-center">
          <Image src="/logozeia.png" width={120} height={80} className="h-12 w-auto" alt="Logo zeia" priority />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
