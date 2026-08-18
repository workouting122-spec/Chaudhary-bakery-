import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Cake, Tags, Users, LogOut, Menu, Bell,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth, adminSignOut } from "./useAdminAuth";
import { site } from "@/config/site";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Cake },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminLayout() {
  const { adminName } = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newOrders, setNewOrders] = useState(0);

  // Realtime: bump a badge when a new order is inserted.
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const ch = client
      .channel("orders-insert")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () =>
        setNewOrders((n) => n + 1)
      )
      .subscribe();
    return () => { client.removeChannel(ch); };
  }, []);

  const signOut = async () => { await adminSignOut(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-cream-100 text-ink">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-ink text-cream-100 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <span className="font-display text-lg text-cream-50">Chaudhary</span>
          <span className="text-xs text-cream-100/60">admin</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-brand text-cream-50" : "text-cream-100/70 hover:bg-white/5 hover:text-cream-50"
                }`
              }
            >
              <n.icon size={18} />
              {n.label}
              {n.label === "Orders" && newOrders > 0 && (
                <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs text-cream-50">{newOrders}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <button onClick={signOut} className="absolute bottom-4 left-3 right-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream-100/70 hover:bg-white/5 hover:text-cream-50">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink/10 bg-cream-50/80 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <span className="font-display text-lg">{site.name}</span>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative" aria-label="Notifications" onClick={() => setNewOrders(0)}>
              <Bell size={20} />
              {newOrders > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand" />}
            </button>
            <span className="text-sm text-ink-soft">{adminName ?? "Admin"}</span>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
