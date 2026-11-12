import { DashbordSidebar } from "@/components/DashbordSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashbordSidebar />
            <main className="min-w-0 flex-1">
                <SidebarTrigger />
                {children}
                <Toaster />
            </main>

        </SidebarProvider>
    )
}