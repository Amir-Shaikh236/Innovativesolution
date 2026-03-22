import React, { useState, useEffect, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search, Mail, Bell, LogOut, X, LayoutDashboard, Users,
    Settings, FileText, Tag, ArrowRight, BookOpen, Sun, Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

// ─── SPOTLIGHT MODAL ─────────────────────────────────────────────────────────
// (Keep SEARCH_ITEMS array the same as before)
const SEARCH_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", category: "Pages", path: "/admin" },
    { icon: Users, label: "Users", category: "Pages", path: "/users" },
    { icon: BookOpen, label: "Blogs", category: "Pages", path: "/blogs" },
    { icon: Tag, label: "Categories", category: "Pages", path: "/categories" },
    { icon: FileText, label: "SubPages", category: "Pages", path: "/subpages" },
    { icon: Settings, label: "Settings", category: "Settings", path: "/settings" },
];

function SpotlightModal({ open, onClose }) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    // ... (Keep the filtering and useEffect logic exactly the same)
    const filtered = query.trim() ? SEARCH_ITEMS.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase())) : SEARCH_ITEMS;
    const go = useCallback((path) => { navigate(path); onClose(); setQuery(""); }, [navigate, onClose]);
    useEffect(() => { setSelected(0); }, [query]);
    useEffect(() => { if (!open) { setQuery(""); setSelected(0); } }, [open]);
    useEffect(() => {
        const handler = (e) => {
            if (!open) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
            if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
            if (e.key === "Enter" && filtered[selected]) go(filtered[selected].path);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, selected, filtered, go, onClose]);

    if (!open) return null;
    const groups = filtered.reduce((acc, item) => { if (!acc[item.category]) acc[item.category] = []; acc[item.category].push(item); return acc; }, {});
    let globalIdx = 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] sm:pt-[12vh] px-4"
            style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)" }}
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Responsive Width: 90vw on mobile, max-w-xl on desktop */}
            <div className="w-[90vw] sm:w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100/60 dark:border-slate-800 bg-white dark:bg-slate-900">

                <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-slate-800">
                    <Search className="h-4 w-4 text-emerald-500 shrink-0" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search anything…"
                        className="flex-1 text-sm text-gray-800 dark:text-slate-100 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 min-w-0"
                    />
                    <div className="flex items-center gap-1.5 shrink-0">
                        {query && (
                            <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                        <kbd className="hidden sm:inline-block bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 text-[11px] font-semibold px-1.5 py-0.5 rounded-md">ESC</kbd>
                    </div>
                </div>

                <div className="py-2 max-h-[60vh] sm:max-h-80 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 dark:text-slate-500 py-8">No results for "{query}"</p>
                    ) : (
                        Object.entries(groups).map(([category, items]) => (
                            <div key={category}>
                                <p className="px-4 sm:px-5 pt-3 pb-1 text-[10px] font-bold tracking-widest text-gray-400 dark:text-slate-500 uppercase">
                                    {category}
                                </p>
                                {items.map((item) => {
                                    const idx = globalIdx++;
                                    const isSelected = selected === idx;
                                    return (
                                        <button
                                            key={item.label}
                                            onMouseEnter={() => setSelected(idx)}
                                            onClick={() => go(item.path)}
                                            className={`w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 text-left transition-colors ${isSelected ? "bg-emerald-50 dark:bg-emerald-500/10" : "hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                                        >
                                            <span className={`p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"}`}>
                                                <item.icon className="h-3.5 w-3.5" />
                                            </span>
                                            <span className={`text-sm font-medium truncate ${isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-slate-300"}`}>
                                                {item.label}
                                            </span>
                                            {isSelected && <ArrowRight className="ml-auto h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── ONLINE STATUS INDICATOR ──────────────────────────────────────────────────
function OnlineStatus() {
    const [online, setOnline] = useState(navigator.onLine);
    useEffect(() => {
        const on = () => setOnline(true);
        const off = () => setOnline(false);
        window.addEventListener("online", on);
        window.addEventListener("offline", off);
        return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
    }, []);

    return (
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all duration-500 ${online ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/20 text-red-600 dark:text-red-400"
            }`}>
            <span className="relative flex h-1.5 w-1.5 shrink-0">
                {online && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${online ? "bg-emerald-500" : "bg-red-400"}`} />
            </span>
            {online ? "Online" : "Offline"}
        </div>
    );
}

// ─── MAIN ADMIN LAYOUT ────────────────────────────────────────────────────────
export default function AdminLayout({ children, admin, onLogout }) {
    const [spotlightOpen, setSpotlightOpen] = useState(false);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const adminName = admin?.name || "Admin User";
    const adminEmail = admin?.email || "admin@example.com";
    const getInitials = (name) => {
        const parts = name.split(" ");
        return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
    };
    const initials = getInitials(adminName);

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSpotlightOpen((o) => !o);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar onLogout={onLogout} />

            <SpotlightModal open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />

            {/* Added max-w-[100vw] to prevent horizontal scroll issues on mobile */}
            <main className="flex-1 w-full max-w-[100vw] sm:max-w-full bg-[#f8faf9] dark:bg-slate-950 min-h-screen flex flex-col transition-colors overflow-x-hidden">

                {/* ── Header ── */}
                <header className="sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 bg-[#f8faf9]/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100/80 dark:border-slate-800">

                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <SidebarTrigger className="text-gray-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0" />

                        {/* Desktop Search Button */}
                        <button
                            onClick={() => setSpotlightOpen(true)}
                            className="group flex items-center gap-3 pl-3.5 pr-3 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-gray-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/50 hover:shadow-md transition-all text-sm text-gray-400 dark:text-slate-400 max-w-xs w-full hidden sm:flex"
                        >
                            <Search className="h-3.5 w-3.5 text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
                            <span className="flex-1 text-left text-[13px] truncate">Search anything…</span>
                            <div className="flex items-center gap-0.5 shrink-0">
                                <kbd className="bg-gray-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 rounded px-1.5 py-0.5 text-[11px] font-bold transition-colors">⌘</kbd>
                                <kbd className="bg-gray-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 rounded px-1.5 py-0.5 text-[11px] font-bold transition-colors">K</kbd>
                            </div>
                        </button>

                        {/* Mobile Search Icon */}
                        <button
                            onClick={() => setSpotlightOpen(true)}
                            className="sm:hidden p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-500 hover:text-emerald-600 shrink-0 transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                        <OnlineStatus />

                        {/* Theme Toggle Button */}
                        <button
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            className="relative p-2 sm:p-2.5 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-full text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
                        >
                            <Sun className="h-4 w-4 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 h-4 w-4 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
                        </button>

                        <button className="hidden sm:flex p-2.5 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-full text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0">
                            <Mail className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => navigate("/admin/notifications")}
                            className="relative p-2 sm:p-2.5 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-full text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900">
                                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                            </span>
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 p-1 sm:p-1.5 sm:pr-3 bg-white dark:bg-slate-900 rounded-full outline-none hover:shadow-md transition-all shadow-sm cursor-pointer border border-gray-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-500/50 shrink-0">
                                    <div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                                        <span style={{ position: "absolute", width: "250%", height: "250%", top: "-75%", left: "-75%", background: "conic-gradient(#10b981,#9ca3af,#ffffff,#22c55e,#86efac,#10b981)", borderRadius: "50%", animation: "spinRing 3s linear infinite" }} />
                                        <span className="absolute inset-[3px] rounded-full bg-white dark:bg-slate-950 flex items-center justify-center text-[12px] font-bold text-gray-800 dark:text-slate-100 z-10">
                                            {initials}
                                        </span>
                                    </div>
                                    <div className="hidden lg:flex flex-col text-left">
                                        <span className="text-[12px] font-bold text-gray-800 dark:text-slate-100 leading-tight truncate max-w-[100px]">{adminName}</span>
                                        <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 leading-tight">Admin</span>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56 sm:w-60 rounded-2xl mt-2 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 z-50" side="bottom" align="end">
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-3 px-3 py-3">
                                        <div style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                                            <span style={{ position: "absolute", width: "250%", height: "250%", top: "-75%", left: "-75%", background: "conic-gradient(#10b981,#9ca3af,#ffffff,#22c55e,#86efac,#10b981)", borderRadius: "50%", animation: "spinRing 3s linear infinite" }} />
                                            <span className="absolute inset-[3px] rounded-full bg-white dark:bg-slate-950 flex items-center justify-center text-[13px] font-bold text-gray-800 dark:text-slate-100 z-10">
                                                {initials}
                                            </span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-gray-800 dark:text-slate-100 truncate">{adminName}</span>
                                            <span className="text-xs text-gray-400 dark:text-slate-500 truncate">{adminEmail}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-slate-800" />
                                <DropdownMenuItem onClick={() => navigate("/setting")} className="rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-slate-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <Settings className="mr-2.5 h-4 w-4 text-gray-400 dark:text-slate-500" /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onLogout} className="rounded-xl px-3 py-2.5 text-sm text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10">
                                    <LogOut className="mr-2.5 h-4 w-4" /> Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* ── Page content ── */}
                <div className="px-3 sm:px-6 pb-6 pt-3 sm:pt-4 flex-1 flex flex-col w-full">
                    {/* p-4 on mobile, p-8 on desktop */}
                    <div className="bg-white dark:bg-slate-900 flex-1 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 shadow-sm border border-gray-100/50 dark:border-slate-800 transition-colors w-full overflow-x-auto">
                        {children}
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes spinRing {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </SidebarProvider>
    );
}