import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, CreditCard, BarChart3, Settings, ShieldCheck, LogOut, FileText, RotateCcw, History } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Refunds", url: "/refunds", icon: RotateCcw },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Audit Logs", url: "/audit-logs", icon: History },
  { title: "Staff Directory", url: "/staff-management", icon: ShieldCheck },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { signOut, organization, profile, role } = useAuth();

  const allowedItems = items.filter((item) => {
    if (item.url === "/staff-management") {
      return role === "super_admin" || role === "admin";
    }
    if (item.url === "/invoices" || item.url === "/refunds") {
      return role !== "viewer";
    }
    return true;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-4 px-3 bg-sidebar">
        <Link to="/dashboard" className="flex items-center gap-3 select-none">
          <div className="relative h-9 w-9 flex items-center justify-center font-sans text-2xl font-black italic shrink-0">
            <span className="absolute text-blue-400 select-none" style={{ transform: "translate(-3px, -2px)" }}>P</span>
            <span className="absolute text-cyan-400 opacity-85 select-none" style={{ transform: "translate(3px, 2px)" }}>V</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm tracking-tight text-white leading-none">
                Pay<span className="text-cyan-400">Verify</span>
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 font-medium truncate mt-1">{organization?.name ?? "Workspace"}</span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/45 font-bold uppercase tracking-wider text-[10px]">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allowedItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-2.5">
        {!collapsed && profile && (
          <div className="px-2 py-1.5 text-xs text-sidebar-foreground">
            <p className="font-bold truncate text-[11px] uppercase tracking-wider text-sidebar-foreground/50 leading-none">User</p>
            <p className="font-semibold truncate text-white mt-1">{profile.full_name} ({role})</p>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full rounded-full font-semibold text-xs" 
          onClick={() => signOut()}
        >
          <LogOut className="h-4.5 w-4.5" />
          {!collapsed && "Sign out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}