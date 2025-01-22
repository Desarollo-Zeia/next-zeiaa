"use client"

import { ChevronRight, LayoutList, Activity, Megaphone } from "lucide-react"
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



export function NavMain({
  module,
}: {
  module: {
    dashboard: string,
    monitoreo: string,
    covid?: string,
    alertas: string,
    analisis: {
      isActive: boolean,
      title: string,
      url: string,
      items: { title: string, url: string}[]
    }
  } // Agrega userdata aq
}) {

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={module.dashboard}>
                <LayoutList />
                <span>Listado de salas</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={module.monitoreo}>
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
                    <span>{module.analisis.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {module.analisis.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
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
        <SidebarMenuItem>
            {/* <SidebarMenuButton asChild>
              <Link href={module?.covid}>
                <ShieldAlert   />
                <span>Normativa covid</span>
              </Link>
            </SidebarMenuButton> */}
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={module.alertas}>
                <Megaphone />
                <span>Alertas</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
