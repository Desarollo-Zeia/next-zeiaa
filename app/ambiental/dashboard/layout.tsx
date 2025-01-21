import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { fetchWithAuthAmbiental } from "@/app/lib/api"
import { AppSidebar } from "@/components/app-sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children } : LayoutProps) {

  const userData = await fetchWithAuthAmbiental('/enterprise/api/enterprise/detail/')

  return (
    <SidebarProvider >
      <AppSidebar userData={userData}/>
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        { children }
      </SidebarInset>
    </SidebarProvider>
    
 
  )
}
