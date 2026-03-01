import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Bell, Sparkles, BadgeCheck, CreditCard, LogOut } from "lucide-react";

export default function AdminLayout({ children, admin, onLogout }) {
    const adminName = admin?.name || "Admin User";
    const adminEmail = admin?.email || "admin@example.com";

    const getInitials = (name) => {
        const parts = name.split(" ");
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(adminName);

    return (
        <SidebarProvider>
            <AppSidebar onLogout={onLogout} />
            <main className="flex-1 w-full bg-[#f8faf9] min-h-screen flex flex-col">
                <header className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                        <SidebarTrigger className="text-gray-500 hover:text-emerald-600" />
                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search task"
                                className="w-full pl-11 pr-12 py-2.5 bg-white border-none rounded-full text-sm outline-none shadow-md focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <kbd className="hidden sm:inline-block bg-gray-100 rounded-md px-1.5 py-0.5 text-[13px] font-bold text-gray-500">⌘</kbd>
                                <kbd className="hidden sm:inline-block bg-gray-100 rounded-md px-1.5 py-0.5 text-[13px] font-bold text-gray-500">F</kbd>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            <button className="p-2.5 bg-white rounded-full text-gray-400 hover:text-emerald-600 shadow-sm transition-all">
                                <Mail className="h-5 w-5" />
                            </button>
                            <button className="relative p-2.5 bg-white rounded-full text-gray-400 hover:text-emerald-600 shadow-sm transition-all">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white box-content"></span>
                            </button>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 p-1.5 pr-4 bg-white rounded-full outline-none hover:shadow-md transition-all shadow-sm">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="" alt={adminName} />
                                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:flex flex-col text-left">
                                        <span className="text-sm font-bold text-gray-800 leading-tight">{adminName}</span>
                                        <span className="text-xs font-medium text-gray-400 leading-tight">Admin</span>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56 rounded-xl mt-2 border-none shadow-lg" side="bottom" align="end">
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src="" alt={adminName} />
                                            <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700 font-semibold">{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{adminName}</span>
                                            <span className="truncate text-xs text-gray-500">{adminEmail}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-lg">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </header>
                <div className="px-6 pb-6 pt-2 flex-1 flex flex-col">
                    <div className="bg-white flex-1 rounded-[2rem] p-8 shadow-sm border border-gray-100/50">
                        {children}
                    </div>
                </div>

            </main>
        </SidebarProvider>
    );
}