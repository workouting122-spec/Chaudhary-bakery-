/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAZORPAY_KEY_ID?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
}
