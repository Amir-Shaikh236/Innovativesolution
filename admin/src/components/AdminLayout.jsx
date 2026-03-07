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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Mail,
    Bell,
    LogOut,
    X,
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    Tag,
    ArrowRight,
    BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Spotlight Search Modal ───────────────────────────────────────────────────

const SEARCH_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", category: "Pages", path: "/admin" },
    { icon: Users, label: "Users", category: "Pages", path: "/users" },
    { icon: BookOpen, label: "Blogs", category: "Pages", path: "/blogs" },
    // { icon: BarChart2, label: "Analytics", category: "Pages", path: "/admin/analytics" },
    { icon: Tag, label: "Categories", category: "Pages", path: "/categories" },
    { icon: FileText, label: "SubPages", category: "Pages", path: "/subpages" },
    { icon: Settings, label: "Settings", category: "Settings", path: "/settings" },
    // { icon: HelpCircle, label: "Help & Support", category: "Settings", path: "/admin/help" },
];

function SpotlightModal({ open, onClose }) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const filtered = query.trim()
        ? SEARCH_ITEMS.filter((i) =>
            i.label.toLowerCase().includes(query.toLowerCase()) ||
            i.category.toLowerCase().includes(query.toLowerCase())
        )
        : SEARCH_ITEMS;

    const go = useCallback(
        (path) => {
            navigate(path);
            onClose();
            setQuery("");
        },
        [navigate, onClose]
    );

    useEffect(() => {
        setSelected(0);
    }, [query]);

    useEffect(() => {
        if (!open) { setQuery(""); setSelected(0); }
    }, [open]);

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

    // Group by category
    const groups = filtered.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    let globalIdx = 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
            style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)" }}
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100/60"
                style={{ background: "#fff" }}
            >
                {/* Input row */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <Search className="h-4 w-4 text-emerald-500 shrink-0" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search pages, settings, users…"
                        className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                    />
                    <div className="flex items-center gap-1.5">
                        {query && (
                            <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-gray-100 text-gray-400">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                        <kbd className="bg-gray-100 text-gray-400 text-[11px] font-semibold px-1.5 py-0.5 rounded-md">ESC</kbd>
                    </div>
                </div>

                {/* Results */}
                <div className="py-2 max-h-80 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-8">No results for "{query}"</p>
                    ) : (
                        Object.entries(groups).map(([category, items]) => (
                            <div key={category}>
                                <p className="px-5 pt-3 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
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
                                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <span className={`p-1.5 rounded-lg ${isSelected ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                                                <item.icon className="h-3.5 w-3.5" />
                                            </span>
                                            <span className={`text-sm font-medium ${isSelected ? "text-emerald-700" : "text-gray-700"}`}>
                                                {item.label}
                                            </span>
                                            {isSelected && (
                                                <ArrowRight className="ml-auto h-3.5 w-3.5 text-emerald-400" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer hint */}
                <div className="flex items-center gap-4 px-5 py-3 border-t border-gray-100 bg-gray-50/60">
                    {[
                        ["↑↓", "navigate"],
                        ["↵", "open"],
                        ["esc", "close"],
                    ].map(([key, label]) => (
                        <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-[10px]">{key}</kbd>
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Online Status Indicator ──────────────────────────────────────────────────

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
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-500 ${online
            ? "bg-emerald-50 border-emerald-200/60 text-emerald-700"
            : "bg-red-50 border-red-200/60 text-red-600"
            }`}>
            <span className="relative flex h-2 w-2">
                {online && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${online ? "bg-emerald-500" : "bg-red-400"}`} />
            </span>
            {online ? "Online" : "Offline"}
        </div>
    );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────

export default function AdminLayout({ children, admin, onLogout }) {
    const [spotlightOpen, setSpotlightOpen] = useState(false);
    const navigate = useNavigate();

    const adminName = admin?.name || "Admin User";
    const adminEmail = admin?.email || "admin@example.com";

    const getInitials = (name) => {
        const parts = name.split(" ");
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };
    const initials = getInitials(adminName);

    // ⌘K / Ctrl+K global shortcut
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

            {/* Spotlight Modal */}
            <SpotlightModal open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />

            <main className="flex-1 w-full bg-[#f8faf9] min-h-screen flex flex-col">

                {/* ── Header ── */}
                <header className="sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 bg-[#f8faf9]/80 backdrop-blur-md border-b border-gray-100/80">

                    {/* Left: trigger + spotlight button */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <SidebarTrigger className="text-gray-400 hover:text-emerald-600 transition-colors shrink-0" />

                        {/* Spotlight trigger button */}
                        <button
                            onClick={() => setSpotlightOpen(true)}
                            className="group flex items-center gap-3 pl-3.5 pr-3 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all text-sm text-gray-400 max-w-xs w-full hidden sm:flex"
                        >
                            <Search className="h-3.5 w-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                            <span className="flex-1 text-left text-gray-400 text-[13px]">Search anything…</span>
                            <div className="flex items-center gap-0.5 shrink-0">
                                <kbd className="bg-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-500 rounded px-1.5 py-0.5 text-[11px] font-bold text-gray-400 transition-colors">⌘</kbd>
                                <kbd className="bg-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-500 rounded px-1.5 py-0.5 text-[11px] font-bold text-gray-400 transition-colors">K</kbd>
                            </div>
                        </button>

                        {/* Mobile search icon only */}
                        <button
                            onClick={() => setSpotlightOpen(true)}
                            className="sm:hidden p-2.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Right: status + actions + avatar */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                        {/* Online status */}
                        <OnlineStatus />

                        {/* Mail */}
                        <button className="p-2.5 bg-white rounded-full text-gray-400 hover:text-emerald-600 shadow-sm hover:shadow-md transition-all">
                            <Mail className="h-4 w-4" />
                        </button>

                        {/* Bell → notifications page */}
                        <button
                            onClick={() => navigate("/admin/notifications")}
                            className="relative p-2.5 bg-white rounded-full text-gray-400 hover:text-emerald-600 shadow-sm hover:shadow-md transition-all"
                            title="Notifications"
                        >
                            <Bell className="h-4 w-4" />
                            {/* Unread dot */}
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white">
                                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                            </span>
                        </button>

                        {/* Profile dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2.5 p-1.5 pr-3 bg-white rounded-full outline-none hover:shadow-md transition-all shadow-sm cursor-pointer border border-gray-100 hover:border-emerald-100">
                                    {/* Spinning badge avatar */}
                                    <div
                                        style={{
                                            position: "relative",
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: "absolute",
                                                width: "250%",
                                                height: "250%",
                                                top: "-75%",
                                                left: "-75%",
                                                background: "conic-gradient(#10b981,#9ca3af,#ffffff,#22c55e,#86efac,#10b981)",
                                                borderRadius: "50%",
                                                animation: "spinRing 3s linear infinite",
                                            }}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                zIndex: 10,
                                                top: 3,
                                                left: 3,
                                                right: 3,
                                                bottom: 3,
                                                borderRadius: "50%",
                                                background: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: "#1e293b",
                                            }}
                                        >
                                            {initials}
                                        </span>
                                    </div>
                                    <div className="hidden md:flex flex-col text-left">
                                        <span className="text-[13px] font-bold text-gray-800 leading-tight truncate max-w-[100px]">{adminName}</span>
                                        <span className="text-[11px] font-medium text-gray-400 leading-tight">Admin</span>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-60 rounded-2xl mt-2 border border-gray-100 shadow-xl p-1.5"
                                side="bottom"
                                align="end"
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-3 px-3 py-3">
                                        {/* Mini spinning badge in dropdown */}
                                        <div
                                            style={{
                                                position: "relative",
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    width: "250%",
                                                    height: "250%",
                                                    top: "-75%",
                                                    left: "-75%",
                                                    background: "conic-gradient(#10b981,#9ca3af,#ffffff,#22c55e,#86efac,#10b981)",
                                                    borderRadius: "50%",
                                                    animation: "spinRing 3s linear infinite",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    zIndex: 10,
                                                    top: 3,
                                                    left: 3,
                                                    right: 3,
                                                    bottom: 3,
                                                    borderRadius: "50%",
                                                    background: "#fff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color: "#1e293b",
                                                }}
                                            >
                                                {initials}
                                            </span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-gray-800 truncate">{adminName}</span>
                                            <span className="text-xs text-gray-400 truncate">{adminEmail}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="my-1 bg-gray-100" />

                                <DropdownMenuItem
                                    onClick={() => navigate("/admin/settings")}
                                    className="rounded-xl px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                                >
                                    <Settings className="mr-2.5 h-4 w-4 text-gray-400" />
                                    Settings
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => navigate("/admin/notifications")}
                                    className="rounded-xl px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                                >
                                    <Bell className="mr-2.5 h-4 w-4 text-gray-400" />
                                    Notifications
                                    <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 bg-gray-100" />

                                <DropdownMenuItem
                                    onClick={onLogout}
                                    className="rounded-xl px-3 py-2.5 text-sm text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                                >
                                    <LogOut className="mr-2.5 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* ── Page content ── */}
                <div className="px-4 sm:px-6 pb-6 pt-4 flex-1 flex flex-col">
                    <div className="bg-white flex-1 rounded-[2rem] p-5 sm:p-8 shadow-sm border border-gray-100/50">
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