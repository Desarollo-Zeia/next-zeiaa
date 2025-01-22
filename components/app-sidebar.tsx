"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareLibrary ,
} from "lucide-react"

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
    covid: string,
    alertas: string,
    analisis: {
      isActive: boolean,
      title: string,
      url: string,
      items: { title: string, url: string}[]
    }
  } // Agrega userdata aquí
}

const data = {
  user: {
    name: "Ricardo Palma",
    email: "richardpalmer@zeia.com.pe",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Análisis",
      url: "/ocupacional/dashboard/analisis",
      icon: SquareLibrary ,
      isActive: true,
      items: [
        {
          title: "Indicadores",
          url: "/ocupacional/dashboard/analisis?page=1",
        },
        {
          title: "Picos históricos",
          url: "/ocupacional/dashboard/analisis/picoshistoricos?page=1",
        },
        {
          title: "Estadísticas",
          url: "/ocupacional/dashboard/analisis/estadisticas",
        },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
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
