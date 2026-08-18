import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isSupabaseReady } from "@/lib/supabase";
import { useAdminAuth } from "./useAdminAuth";
import SetupNotice from "./components/SetupNotice";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, authed, isAdmin } = useAdminAuth();

  if (!isSupabaseReady) return <SetupNotice />;
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-ink-faint">Checking access…</div>;
  }
  if (!authed || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
