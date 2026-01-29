'use client'
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
import { accountData, accountDataEnergy } from "@/app/utils/account"

interface EnergyItem {
  name: string
  url: string
  is_active?: boolean
  icon: string // El signo de interrogación indica que es opcional
}


export function AppSidebar() {

  const pathname = usePathname()
  const [userInfo, setUserInfo] = useState<object>({ email: '', name: '', avatar: '' })
  const [energyModules, setEnergyModules] = useState<EnergyItem[]>([])

  useEffect(() => {

    const handleRequest = async () => {
      try {
        const res = await accountData()
        const userData = await accountDataEnergy()
        const { results } = res
        const user = results[0]
        const { email, last_name, energy_modules, enterprise_name } = user
        setUserInfo({ email: userData.email, name: enterprise_name, avatar: '' })
        setEnergyModules(energy_modules)
      } catch {
        // Error silenciado - manejo de errores de carga de usuario
      }
    }
    handleRequest()

  }, [])

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
              {energyModules?.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild data-active={pathname.includes(item.url) && 'true'} tooltip={item.name} disabled={item.is_active}>
                    <Link href={item.is_active === false ? "#" : item.url} className={item.is_active === false ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}>
                      {/* <item.icon /> */}
                      <Image src={item.icon} alt={item.icon} width={16} height={16} className="w-4 h-4 text-white" priority />
                      <span>{item.name}</span>
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
