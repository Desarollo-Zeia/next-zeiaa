import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/ui/sidebar/app-siderbar";


export default function Layout({ children } : { children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        { children }
      </main>
    </SidebarProvider>
  )
}
