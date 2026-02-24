"use client"

import { ChevronRight, LayoutList, Activity, Megaphone, FileChartColumnIncreasing, ShieldAlert } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useRoom } from "@/app/utils/func"
import posthog from "posthog-js"



export function NavMain({
  module,
}: {
  module: {
    rooms: string,
    monitoreo: string,
    covid?: string,
    alertas: string,
    analisis: {
      isActive: boolean,
      title: string,
      url: string,
      items: { title: string, url: string }[]
    }
  }
}) {

  const pathname = usePathname()
  const { roomId } = useRoom()

  const getPortal = () => {
    if (pathname.includes('/ambiental')) return 'ambiental'
    if (pathname.includes('/ocupacional')) return 'ocupacional'
    return 'unknown'
  }

  const handleNavigation = (sectionName: string, url: string) => {
    const portal = getPortal()
    posthog.capture('section_viewed', {
      section: sectionName,
      portal: portal,
      url: url,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip={'Listado de salas'} 
            data-active={pathname.includes(module.rooms) && 'true'}
            onClick={() => handleNavigation('Listado de salas', module.rooms)}
          >
            <Link href={module.rooms} prefetch>
              <LayoutList />
              <span>Listado de salas</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip={'Monitoreo de salas'} 
            data-active={pathname.includes(module.monitoreo) && 'true'}
            onClick={() => handleNavigation('Monitoreo de salas', module.monitoreo)}
          >
            <Link href={module.monitoreo} prefetch>
              <Activity />
              <span>Monitoreo de salas</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <Collapsible
          key={module.analisis.title}
          asChild
          defaultOpen={module.analisis.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={module.analisis.title}>
                {/* {module.analisis.title && <a href={module.analisis.url}><item.icon className="h-4 w-4"/></a> } */}
                {module.analisis.title && <Link href={module.analisis.url}><FileChartColumnIncreasing width={15} height={15} /></Link>}

                <span>{module.analisis.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {module.analisis.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton 
                      asChild 
                      data-active={pathname.includes(subItem.url) && 'true'}
                      onClick={() => handleNavigation(subItem.title, subItem.url)}
                    >
                      <Link href={{
                        pathname: subItem.url,
                        query: roomId ? { room: roomId } : {}
                      }} prefetch>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>

          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
      <SidebarMenu>
        {
          module.covid && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                tooltip={'Normativa covid'} 
                data-active={pathname.includes(module.covid) && 'true'}
                onClick={() => handleNavigation('Normativa covid', module.covid ?? '#')}
              >
                <Link href={module.covid ?? "#"} prefetch>
                  <ShieldAlert />
                  <span>Normativa covid</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            tooltip={'Alertas'} 
            data-active={pathname.includes(module.alertas) && 'true'}
            onClick={() => handleNavigation('Alertas', module.alertas)}
          >
            <Link href={module.alertas} prefetch>
              <Megaphone />
              <span>Alertas</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
