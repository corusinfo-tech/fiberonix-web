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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Map,
  Router,
  UserCog,
  GitBranch,
  Users,
  CreditCard,
  Building2,
  Server,
  Package,
  FileText,
  Settings,
  Activity,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   title: "Network Map",
  //   url: "/map",
  //   icon: Map,
  // },
  {
    title: "OLT",
    url: "/add",
    icon: Server,
  },
  {
    title: "Sub Offices",
    url: "/sub",
    icon: Building2,
  },
  {
    title: "Junctions",
    url: "/junctions",
    icon: GitBranch,
  },
  {
    title: "Devices",
    url: "/devices",
    icon: Router,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Staffs",
    url: "/staff",
    icon: UserCog,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Plans",
    url: "/plans",
    icon: Package,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export function NetworkSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300`}
    >
      <SidebarHeader className="">
        <div className="flex items-center gap-3">
          {/* <div className="relative">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center shadow-glow">
              <Activity className="w-4 h-4 text-primary-foreground" />

            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
          </div> */}
          {!collapsed && (
            <div>
              {/* <h1 className="font-bold text-lg text-sidebar-foreground">
                NetworkCommand
              </h1>
              <p className="text-xs text-sidebar-foreground/70">
                Optical Network Center
              </p> */}
              <div
                className=""
                
              >
                <img
                  src="./Fiberonix Logo 23.png"
                  alt="Logo"
                  style={{ maxHeight: "100%", width: "75%" }} // adjust 40px to your liking
                />
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium tracking-wide">
            NETWORK MANAGEMENT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                            : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon
                        className={`w-4 h-4 ${collapsed ? "mx-auto" : ""}`}
                      />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="px-4 py-3 bg-sidebar-accent/50 rounded-lg mx-2 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-sidebar-foreground">
                    Network Status
                  </span>
                </div>
                <div className="text-xs text-sidebar-foreground/70">
                  All systems operational
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs text-success">Online</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
