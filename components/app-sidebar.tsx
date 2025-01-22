"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

type UserData = {
  name?: string,
  acronym?: string,
  first_room?: number,
  logo?: string,
  background_color?: null
}

// This is sample data.


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: UserData;
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
  } // Agrega userdata aquí
}
export function AppSidebar({ module, userData, ...props }: AppSidebarProps) {

  const { name, acronym: email, logo: avatar  } = userData

  const userinfo = {
    name: name || "",
    email: email || "",
    avatar: avatar || "",
  }

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavUser userinfo={userinfo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain module={module} />
        {/* <NavProjects projects={data.projects} /> */}  
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail/>
    </Sidebar>
  )
}
