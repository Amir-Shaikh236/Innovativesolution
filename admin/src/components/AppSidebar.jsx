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

const menuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Categories", url: "/categories", icon: Layers },
    { title: "SubPages", url: "/subpages", icon: FileText },
    { title: "Services", url: "/subpages", icon: Briefcase },
    { title: "Blogs", url: "/blogs", icon: BookOpen },
    { title: "Manage Users", url: "/manage-users", icon: Users },
    { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
];

export function AppSidebar({ onLogout }) {
    const location = useLocation();

    return (
        <Sidebar collapsible="icon" className="border-r border-gray-100 bg-white">
            <SidebarHeader className="pt-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent cursor-pointer">
                            <Link to="/">

                                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                                    <Hexagon className="size-5" fill="currentColor" />
                                </div>

                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="text-xl font-bold tracking-tight text-gray-900">
                                        Adminzo
                                    </span>
                                </div>

                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-2">
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
                                            className="relative h-12 rounded-xl transition-all duration-300 ease-in-out text-gray-500 hover:bg-gray-50 hover:text-gray-900 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:hover:bg-emerald-100"
                                        >
                                            <Link to={item.url}>

                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1.5 bg-emerald-600 rounded-r-full" />
                                                )}

                                                <item.icon
                                                    fill={isActive ? "currentColor" : "none"}
                                                    className="size-[22px] transition-all duration-300 ml-2"
                                                />
                                                <span className={`text-[15px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
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


                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-2"> General </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="h-12 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                                    <Link to="#">
                                        <Settings className="size-[22px]" />
                                        <span className="text-[15px] font-medium tracking-wide">Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="h-12 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                                    <Link to="#">
                                        <HelpCircle className="size-[22px]" />
                                        <span className="text-[15px] font-medium tracking-wide">Help</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={onLogout}
                                    className="h-12 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                >
                                    <LogOut className="size-[22px]" />
                                    <span className="text-[15px] font-medium tracking-wide">Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    );
}