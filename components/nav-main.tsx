"use client"

import { ChevronRight, LayoutList, Activity, ShieldAlert  , Megaphone,  type LucideIcon } from "lucide-react"
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
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Módulos</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/ocupacional/dashboard'}>
                <LayoutList />
                <span>Listado de salas</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/ocupacional/dashboard/monitoreo'}>
                <Activity />
                <span>Monitoreo de salas</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <a href={item.url}><item.icon className="h-4 w-4"/></a> }
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
               
            </SidebarMenuItem>
          </Collapsible>
        ))}
   
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/ocupacional/dashboard/covid'}>
                <ShieldAlert   />
                <span>Normativa covid</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/ocupacional/dashboard/alertas'}>
                <Megaphone />
                <span>Alertas</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
