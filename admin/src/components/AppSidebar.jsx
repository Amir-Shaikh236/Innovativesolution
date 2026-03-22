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
    useSidebar, // 🚨 1. Import the useSidebar hook
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Users,
    Layers,
    BookOpen,
    CreditCard,
    Settings,
    HelpCircle,
    LogOut,
    Hexagon,
    Briefcase,
    FileText
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "./ui/badge";

const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Categories", url: "/categories", icon: Layers },
    { title: "SubPages", url: "/subpages", icon: FileText },
    { title: "Blogs", url: "/blogs", icon: BookOpen },
    { title: "Manage Users", url: "/manage-users", icon: Users },
    { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
];

export function AppSidebar({ onLogout }) {
    const location = useLocation();

    // 🚨 2. Destructure setOpenMobile to control the mobile sidebar state
    const { setOpenMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon" className="border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
            <SidebarHeader className="pt-4 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent dark:hover:bg-transparent cursor-pointer p-0">
                            {/* 🚨 3. Added onClick to close sidebar when clicking the logo */}
                            <Link to="/" onClick={() => setOpenMobile(false)} className="flex items-center gap-3">

                                <Badge
                                    variant="outline"
                                    className="relative flex items-center justify-center size-9 shrink-0 p-0 overflow-hidden border-none rounded-full shadow-md"
                                >
                                    <span className="absolute w-[250%] h-[250%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(#10b981,#9ca3af,#ffffff,#22c55e,#86efac,#10b981)]" />
                                    <span className="relative z-10 flex items-center justify-center w-[calc(100%-4px)] h-[calc(100%-4px)] bg-white dark:bg-slate-950 rounded-full text-[18px] font-bold text-gray-900 dark:text-white transition-colors">
                                        S
                                    </span>
                                </Badge>

                                <div className="flex flex-col gap-0.5 leading-none overflow-hidden group-data-[collapsible=icon]:hidden ml-1">
                                    <span className="text-[19px] font-extrabold tracking-tight text-gray-900 dark:text-slate-50 truncate transition-colors">
                                        Innovative
                                    </span>
                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest truncate transition-colors">
                                        Staffing Solutions
                                    </span>
                                </div>

                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 mt-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[12px] font-bold text-gray-400 dark:text-slate-500 tracking-wider uppercase mb-2 group-data-[collapsible=icon]:hidden transition-colors">
                        Menu
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className="relative h-11 rounded-xl transition-all duration-300 ease-in-out text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-50 data-[active=true]:bg-emerald-50 dark:data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-700 dark:data-[active=true]:text-emerald-400"
                                        >
                                            {/* 🚨 4. Added onClick to close sidebar when any menu item is clicked */}
                                            <Link to={item.url} onClick={() => setOpenMobile(false)} className="flex items-center w-full">

                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-emerald-600 dark:bg-emerald-500 rounded-r-full dark:shadow-[0_0_8px_rgba(5,150,105,0.4)]" />
                                                )}

                                                <item.icon
                                                    fill={isActive ? "currentColor" : "none"}
                                                    className="size-[20px] transition-all duration-300 ml-1 mr-3 shrink-0"
                                                />

                                                <span className={`text-[14px] tracking-wide truncate group-data-[collapsible=icon]:hidden ${isActive ? "font-bold" : "font-medium"}`}>
                                                    {item.title}
                                                </span>

                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    );
}