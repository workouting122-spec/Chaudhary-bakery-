import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { supabase, isSupabaseReady } from "@/lib/supabase";
import { AUTHORIZED_ADMIN_EMAIL } from "../adminConfig";
import SetupNotice from "../components/SetupNotice";

type Mode = "signin" | "create";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isSupabaseReady) return <SetupNotice />;

  const authorized = email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  // Allowed by the bootstrap RLS policy only for the authorized email.
  const ensureAdminRow = async (userId: string) =>
    supabase!.from("admins").upsert({ id: userId, name: "Owner", role: "owner" }, { onConflict: "id" });

  const signIn = async () => {
    setError(null); setNotice(null);
    if (!authorized) return setError("Unauthorized email.");
    setBusy(true);
    const { data, error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      setBusy(false);
      return setError("Incorrect password — or you haven't set one yet (use “Set your password”).");
    }
    await ensureAdminRow(data.user.id);
    const { data: admin } = await supabase!.from("admins").select("id").eq("id", data.user.id).maybeSingle();
    setBusy(false);
    if (!admin) { await supabase!.auth.signOut(); return setError("This account isn't an admin."); }
    nav("/admin");
  };

  const createPassword = async () => {
    setError(null); setNotice(null);
    if (!authorized) return setError("Unauthorized email.");
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    const { data, error } = await supabase!.auth.signUp({ email: email.trim(), password });
    if (error) {
      setBusy(false);
      if (/already registered|already exists/i.test(error.message)) { setMode("signin"); return setError("Password already set — please sign in."); }
      return setError(error.message);
    }
    if (data.session && data.user) {
      await ensureAdminRow(data.user.id);
      setBusy(false);
      return nav("/admin");
    }
    setBusy(false);
    setMode("signin");
    setNotice("Password saved. Confirm via the email we sent (if required), then sign in.");
  };

  const forgot = async () => {
    setError(null); setNotice(null);
    if (!authorized) return setError("Unauthorized email.");
    await supabase!.auth.resetPasswordForEmail(email.trim());
    setNotice("If an account exists, a reset link has been sent.");
  };

  const submit = () => (mode === "create" ? createPassword() : signIn());
  const field = "w-full rounded-xl border border-ink/15 bg-cream-100 px-4 py-3 focus:border-brand focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-cream-50 p-8 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-cream-50"><Lock size={18} /></span>
          <div>
            <p className="font-display text-lg leading-none">Chaudhary Bake &amp; Cake</p>
            <p className="text-xs text-ink-faint">{mode === "create" ? "Set your password" : "Admin sign in"}</p>
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-brand/10 p-3 text-sm text-brand">{error}</p>}
        {notice && <p className="mb-4 rounded-lg bg-veg/10 p-3 text-sm text-veg">{notice}</p>}

        <div className="space-y-3">
          <div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              autoComplete="username" className={field} />
            {!authorized && email.trim() !== "" && <p className="mt-1 text-xs text-brand">Unauthorized email.</p>}
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "create" ? "New password (min 8 chars)" : "Password"}
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            onKeyDown={(e) => e.key === "Enter" && mode === "signin" && submit()} className={field} />
          {mode === "create" && (
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password" autoComplete="new-password"
              onKeyDown={(e) => e.key === "Enter" && submit()} className={field} />
          )}

          <button onClick={submit} disabled={busy || !authorized} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Please wait…" : mode === "create" ? "Create password & continue" : "Sign in"}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          {mode === "signin" ? (
            <>
              <button onClick={() => { setMode("create"); setError(null); setNotice(null); }} className="text-brand hover:underline">
                First time? Set your password
              </button>
              <button onClick={forgot} className="text-ink-faint hover:text-brand">Forgot password?</button>
            </>
          ) : (
            <button onClick={() => { setMode("signin"); setError(null); setNotice(null); }} className="text-brand hover:underline">
              Already have a password? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
