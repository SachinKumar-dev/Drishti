"use client"

import {
  Home,
  Video,
  ShieldAlert,
  FileText,
  Users,
  Settings,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons/logo"

const links = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Cameras", icon: Video },
  { label: "Incidents", icon: ShieldAlert },
  { label: "Reports", icon: FileText },
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden transition-all duration-300">SentinelAI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.label}>
              <SidebarMenuButton
                isActive={link.active}
                tooltip={{ children: link.label }}
                className="justify-start"
              >
                <link.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden transition-all duration-300">{link.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Logout' }} className="justify-start">
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden transition-all duration-300">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
