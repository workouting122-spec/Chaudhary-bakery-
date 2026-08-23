import { useMemo, useState, type FormEvent } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Backdrop from "@/components/cine/Backdrop";
import { site, telLink, mailLink } from "@/config/site";

interface Fields {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
}

const EMPTY: Fields = { name: "", email: "", phone: "", date: "", message: "" };

export default function Contact() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!f.name.trim()) e.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "A valid email helps us reply.";
    if (!f.message.trim()) e.message = "A short note lets us prepare.";
    return e;
  }, [f]);

  const set = (k: keyof Fields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: ev.target.value }));

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length) return;
    // Static-deploy friendly: hand off to the visitor's mail client.
    const body = [
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      `Phone: ${f.phone || "—"}`,
      `Preferred date: ${f.date || "—"}`,
      "",
      f.message,
    ].join("\n");
    window.location.href =
      `${mailLink(`Private viewing enquiry — ${f.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "mt-2 w-full rounded-md border border-bone/15 bg-ink-800/60 px-4 py-3 text-bone placeholder:text-bone-faint focus:border-brass focus:outline-none";

  return (
    <div className="relative">
      <div className="relative flex min-h-[46vh] items-end overflow-hidden pt-24">
        <Backdrop tone="night" variant="aperture" dim={0.5} />
        <div className="container-x relative z-10 pb-12">
          <p className="eyebrow mb-4">Private viewings</p>
          <h1 className="text-display-lg">Arrange your walk-through.</h1>
          <p className="mt-4 max-w-reading text-bone-soft">
            Tell us a little about what you are looking for. We arrange viewings one household at a
            time, so every visit is unhurried and private.
          </p>
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} noValidate className="order-2 lg:order-1">
          {sent && (
            <p
              role="status"
              className="mb-6 rounded-md border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-brass"
            >
              Thank you — your email client should now be open with the enquiry ready to send. If not,
              email us directly at {site.email}.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Full name" error={touched.name ? errors.name : undefined}>
              <input id="name" className={field} value={f.name} onChange={set("name")}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))} autoComplete="name" />
            </Field>
            <Field id="email" label="Email" error={touched.email ? errors.email : undefined}>
              <input id="email" type="email" className={field} value={f.email} onChange={set("email")}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))} autoComplete="email" />
            </Field>
            <Field id="phone" label="Phone (optional)">
              <input id="phone" className={field} value={f.phone} onChange={set("phone")} autoComplete="tel" />
            </Field>
            <Field id="date" label="Preferred date (optional)">
              <input id="date" type="date" className={field} value={f.date} onChange={set("date")} />
            </Field>
          </div>

          <div className="mt-5">
            <Field id="message" label="What are you looking for?" error={touched.message ? errors.message : undefined}>
              <textarea id="message" rows={5} className={field} value={f.message} onChange={set("message")}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))} />
            </Field>
          </div>

          <button type="submit" className="btn-primary mt-8">
            Send enquiry
          </button>
        </form>

        <aside className="order-1 space-y-6 lg:order-2">
          <a href={telLink()} className="plate flex items-center gap-4 p-5 transition hover:border-brass/40">
            <Phone className="text-brass" size={20} />
            <span>
              <span className="block text-xs uppercase tracking-widest text-bone-faint">Call</span>
              <span className="text-bone">{site.phoneDisplay}</span>
            </span>
          </a>
          <a href={mailLink()} className="plate flex items-center gap-4 p-5 transition hover:border-brass/40">
            <Mail className="text-brass" size={20} />
            <span>
              <span className="block text-xs uppercase tracking-widest text-bone-faint">Email</span>
              <span className="text-bone">{site.email}</span>
            </span>
          </a>
          <div className="plate flex items-center gap-4 p-5">
            <MapPin className="text-brass" size={20} />
            <span>
              <span className="block text-xs uppercase tracking-widest text-bone-faint">Visit</span>
              <span className="text-bone">{site.address.line1}</span>
              <span className="block text-sm text-bone-muted">{site.address.line2}</span>
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-widest text-bone-muted">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
