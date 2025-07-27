
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Video,
  ShieldAlert,
  FileText,
  Users,
  Settings,
  LogOut,
  QrCode,
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
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Cameras", icon: Video, href: "/cameras" },
  { label: "Incidents", icon: ShieldAlert, href: "/incidents" },
  { label: "Reports", icon: FileText, href: "/reports" },
  { label: "QR Alert", icon: QrCode, href: "/qr-alert" },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden transition-all duration-300">Drishti.ai</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.label}>
              <Link href={link.href} passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(link.href)}
                  tooltip={{ children: link.label }}
                  className="justify-start"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden transition-all duration-300">{link.label}</span>
                </SidebarMenuButton>
              </Link>
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
