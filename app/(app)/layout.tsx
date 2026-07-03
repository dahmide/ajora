import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Container, Sidebar } from "@/components/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Sidebar />
            <div className="w-full py-12 md:py-12">
                <Container>{children}</Container>
            </div>
        </SidebarProvider>
    );
}
