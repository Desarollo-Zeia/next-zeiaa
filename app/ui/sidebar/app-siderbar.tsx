'use client'

import {
  Zap,
  Battery,
  Gauge,
  AlertTriangle,
  AudioWaveformIcon as WaveformIcon,
  TowerControl 
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
import { useEffect, useState } from "react"
import { accountData } from "@/app/utils/account"

const energyItems = [
  {
    title: "Consumo energético",
    url: "/energia/dashboard/home",
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
  {
    title: "Panel general",
    url: "/energia/dashboard/panel",
    icon: TowerControl,
  },
]

export function AppSidebar() {

  const pathname = usePathname()
  const [userInfo, setUserInfo] = useState<object>({ email: '', name: '', avatar: '' })

  useEffect(() => {

    const handleRequest = async () => {
        try {
          const res = await accountData()
          const { results } = res 
          const user = results[0]
          const { email, last_name } = user
          setUserInfo({ email, name: last_name, avatar: '' })
        } catch (error) {
          console.log(error)
        }
    }
    handleRequest()

  }, [ ])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavUser userinfo={userInfo} />
      </SidebarHeader>
      <SidebarContent className="relative">
        <SidebarGroup>
          <SidebarGroupLabel>Gestión energética</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {energyItems.map((item) => (
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild data-active={pathname.includes(item.url) && 'true'} tooltip={item.title}>
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
