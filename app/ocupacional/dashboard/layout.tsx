import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/ui/sidebar/app-siderbar"
import RoomFilter from "@/app/ui/filters/room-filter"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="w-full flex justify-between pt-4 px-4">
          <SidebarTrigger />
          <RoomFilter/>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}