import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import ZeiaLogo from '@/public/logozeia.png'

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
import Image from "next/image"
import { NavUser } from "@/components/nav-user"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {

  const userinfo = {
    name:  "",
    email:  "",
    avatar: "",
  }

  return (
    <Sidebar>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavUser userinfo={userinfo} />
        {/* asdkaosdoaskdokaskodakosdokaskokasdoaskodasd */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Image src={ZeiaLogo} alt="logo" className="object-contain w-36 h-12 mx-auto mb-4"/>
      </SidebarFooter>
    </Sidebar>
  )
}
