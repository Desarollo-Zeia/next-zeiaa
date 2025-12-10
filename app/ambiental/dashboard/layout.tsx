import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { fetchWithAuthAmbiental } from "@/app/lib/api"
import { AppSidebar } from "@/components/app-sidebar"
import { getToken } from "@/app/lib/auth"

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {

  const authToken = await getToken()


  const userData = await fetchWithAuthAmbiental('/enterprise/api/enterprise/detail/', {}, authToken!)

  const ambiental = {
    rooms: '/ambiental/dashboard/rooms',
    monitoreo: '/ambiental/dashboard/monitoreo',
    analisis: {
      title: 'Análisis',
      isActive: true,
      url: '/ambiental/dashboard/analisis',
      items: [
        {
          title: 'Indicadores',
          url: '/ambiental/dashboard/analisis'
        },
        // {
        //   title: 'Picos Históricos',
        //   url: '/ocupacional/dashboard/analisis/picoshistoricos'
        // },
        {
          title: 'Estadísticas',
          url: '/ambiental/dashboard/analisis/estadisticas'
        }
      ]
    },
    // covid: '/ambiental/dashboard/covid',
    alertas: '/ambiental/dashboard/alertas'
  }

  return (
    <SidebarProvider >
      <AppSidebar userData={userData} module={ambiental} />
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
