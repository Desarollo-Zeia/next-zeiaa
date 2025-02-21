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
  SidebarFooter,
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

const energyItems = [
  {
    title: "Consumo energético",
    url: "/energia/dashboard/consumo",
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
    url: "/energia/dashboard/tasa",
    icon: WaveformIcon,
  },
]

export function AppSidebar() {
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión energética</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {energyItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
      </SidebarContent>
      <SidebarFooter>{/* Footer content can be added here later */}</SidebarFooter>
    </Sidebar>
  )
}
