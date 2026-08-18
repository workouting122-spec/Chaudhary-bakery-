import { Link } from "react-router-dom";
import { Database } from "lucide-react";

export default function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 p-6">
      <div className="max-w-lg rounded-2xl bg-cream-50 p-8 shadow-card">
        <Database className="text-brand" size={32} />
        <h1 className="mt-4 font-display text-2xl">Connect Supabase to use the admin portal</h1>
        <p className="mt-3 text-ink-soft">
          The admin portal needs a Supabase project. Add these to your <code className="rounded bg-cream-200 px-1">.env</code> and restart:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-4 text-sm text-cream-100">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...`}
        </pre>
        <p className="mt-4 text-sm text-ink-faint">
          Then run the SQL in <code className="rounded bg-cream-200 px-1">supabase/migrations/</code> and create an admin
          user (see the README → Admin portal).
        </p>
        <Link to="/" className="btn-primary mt-6">Back to storefront</Link>
      </div>
    </div>
  );
}
