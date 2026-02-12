"use client";

import { useEffect, useState, memo } from "react";
import {
  Home,
  Briefcase,
  Users,
  MessageSquare,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";
import { useCompany } from "@/context/AppContext";

const NAV_ITEMS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Candidati", href: "/dashboard/candidates", icon: Users },
  { name: "Matches", href: "/dashboard/matches", icon: MessageSquare },
  { name: "Chat", href: "/dashboard/chat", icon: MessageCircle },
  { name: "Impostazioni", href: "/dashboard/settings", icon: Settings },
];

// Memoized NavItem per evitare re-render inutili quando cambia lo stato di unread o company
const NavItem = memo(function NavItem({ item, isActive, unread }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={20} />
      <span>{item.name}</span>
      {item.name === "Chat" && unread > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
});

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const company = useCompany(); // solo company dal Context, no re-render inutili
  const [unread, setUnread] = useState(0);

  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // 🔔 Messaggi non letti + real-time
  useEffect(() => {
    if (!company?.id) return;

    let mounted = true;

    const fetchUnread = async () => {
      const { data: matches } = await supabase
        .from("matches")
        .select("id")
        .eq("company_id", company.id);

      if (!matches?.length || !mounted) return;

      const matchIds = matches.map((m) => m.id);
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("match_id", matchIds)
        .neq("sender_id", company.id)
        .is("read_at", null);

      if (mounted) setUnread(count || 0);
    };

    fetchUnread();

    const channel = supabase
      .channel(`layout-unread-${company.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data: match } = await supabase
            .from("matches")
            .select("company_id")
            .eq("id", payload.new.match_id)
            .single();

          if (match?.company_id !== company.id) return;
          if (payload.new.sender_id === company.id) return;

          setUnread((prev) => prev + 1);
          if (!pathname.startsWith("/dashboard/chat")) {
            showToast.info("💬 Nuovo messaggio!");
          }
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [company?.id, pathname]);

  // Reset unread quando entri in chat
  useEffect(() => {
    if (pathname.startsWith("/dashboard/chat")) setUnread(0);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 flex-shrink-0">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 px-4 mb-8">
          <span className="text-2xl">🚀</span>
          <span className="text-xl font-bold text-gray-900">HireFlow</span>
        </Link>

        {/* Company badge */}
        {company && (
          <div className="mx-4 mb-6 p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-500 font-medium">Loggato come</p>
            <p className="text-sm font-bold text-blue-900 truncate">
              {company.name}
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              unread={unread}
            />
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-medium text-sm mt-4"
        >
          <LogOut size={20} />
          <span>Esci</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
