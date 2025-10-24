import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { fetchWithAuth } from "@/app/lib/api"
import { AppSidebar } from "@/components/app-sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {

  const userData = await fetchWithAuth('/enterprise/api/enterprise/detail/')

  const ocupacional = {
    rooms: '/ocupacional/dashboard/rooms',
    monitoreo: '/ocupacional/dashboard/monitoreo',
    analisis: {
      title: 'Análisis',
      isActive: true,
      url: '/ocupacional/dashboard/analisis',
      items: [
        {
          title: 'Indicadores',
          url: '/ocupacional/dashboard/analisis/indicadores'
        },
        {
          title: 'Picos Históricos',
          url: '/ocupacional/dashboard/analisis/picoshistoricos'
        },
        {
          title: 'Estadísticas',
          url: '/ocupacional/dashboard/analisis/estadisticas'
        }
      ]
    },
    // covid: '/ocupacional/dashboard/covid',
    alertas: '/ocupacional/dashboard/alertas'
  }

  return (
    <SidebarProvider >
      <AppSidebar userData={userData} module={ocupacional} />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>


  )
}
