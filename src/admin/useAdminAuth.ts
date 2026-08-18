import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AdminAuth {
  loading: boolean;
  authed: boolean;
  isAdmin: boolean;
  adminName: string | null;
  email: string | null;
}

/**
 * Tracks the Supabase session and whether that user exists in the `admins` table.
 * `isAdmin` gates every /admin route.
 */
export function useAdminAuth(): AdminAuth {
  const [state, setState] = useState<AdminAuth>({
    loading: true, authed: false, isAdmin: false, adminName: null, email: null,
  });

  useEffect(() => {
    if (!supabase) {
      setState({ loading: false, authed: false, isAdmin: false, adminName: null, email: null });
      return;
    }
    let active = true;

    const check = async (userId: string | undefined, email: string | null) => {
      if (!userId) {
        if (active) setState({ loading: false, authed: false, isAdmin: false, adminName: null, email: null });
        return;
      }
      const { data } = await supabase!
        .from("admins").select("name").eq("id", userId).maybeSingle();
      if (active) setState({
        loading: false, authed: true, isAdmin: Boolean(data),
        adminName: data?.name ?? null, email,
      });
    };

    supabase.auth.getSession().then(({ data }) =>
      check(data.session?.user?.id, data.session?.user?.email ?? null)
    );
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      check(session?.user?.id, session?.user?.email ?? null)
    );
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}

export async function adminSignOut() {
  await supabase?.auth.signOut();
}
