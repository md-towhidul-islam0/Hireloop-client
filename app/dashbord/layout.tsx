import { DashbordSidebar } from "@/components/DashbordSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashbordSidebar/>
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
           
        </SidebarProvider>
    )
}