"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import { NavMain, NavUser } from "./sidebar/";
import { authClient } from "@/lib/auth-client";

const data = {
    navMain: [
        { title: "Overview", url: "/overview", icon: LayoutDashboard },
        { title: "My Groups", url: "/groups", icon: Users },
    ],
};

export default function AppSidebar() {
    const { data: session } = authClient.useSession();
    console.log(session);
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>Header</SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        name: session?.user.name ?? "John doe",
                        email: session?.user.email ?? "johndoe@gmail.com",
                        image: session?.user.image ?? undefined,
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
