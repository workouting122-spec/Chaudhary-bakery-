import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { site, waLink, telLink } from "@/config/site";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit phone number"),
  message: z.string().min(5, "Tell us a little more"),
});
type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    // No backend yet — hand off to WhatsApp with the message prefilled.
    window.open(
      waLink(`Hi, I'm ${data.name} (${data.phone}). ${data.message}`),
      "_blank"
    );
  };

  return (
    <div className="container-x grid gap-12 pb-24 pt-[calc(var(--nav-h)+2rem)] md:grid-cols-2">
      <div>
        <p className="eyebrow mb-3">Get in touch</p>
        <h1 className="font-display text-display-md">Contact us</h1>
        <ul className="mt-8 space-y-5 text-ink-soft">
          <li className="flex gap-3"><MapPin className="mt-0.5 text-brand" size={20} /><span>{site.address.line1}<br />{site.address.line2}</span></li>
          <li className="flex gap-3"><Phone className="mt-0.5 text-brand" size={20} /><a href={telLink()} className="hover:text-brand">{site.phoneDisplay}</a></li>
          <li className="flex gap-3"><MessageCircle className="mt-0.5 text-brand" size={20} /><a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brand">Chat on WhatsApp</a></li>
        </ul>
        <div className="mt-8 h-64 overflow-hidden rounded-2xl shadow-soft">
          <iframe title="Map" src={site.address.mapEmbedSrc} className="h-full w-full border-0" loading="lazy" />
        </div>
      </div>

      <div className="rounded-2xl bg-cream-50 p-8 shadow-card">
        <h2 className="font-display text-2xl">Send us a message</h2>
        {isSubmitSuccessful ? (
          <p className="mt-6 rounded-xl bg-veg/10 p-4 text-veg">Thanks! We've opened WhatsApp so you can send it directly.</p>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <input {...register("name")} placeholder="Your name" className="w-full rounded-xl border border-ink/15 bg-cream-100 px-4 py-3 focus:border-brand focus:outline-none" />
            {errors.name && <p className="mt-1 text-sm text-brand">{errors.name.message}</p>}
          </div>
          <div>
            <input {...register("phone")} inputMode="numeric" placeholder="10-digit phone" className="w-full rounded-xl border border-ink/15 bg-cream-100 px-4 py-3 focus:border-brand focus:outline-none" />
            {errors.phone && <p className="mt-1 text-sm text-brand">{errors.phone.message}</p>}
          </div>
          <div>
            <textarea {...register("message")} rows={4} placeholder="How can we help?" className="w-full rounded-xl border border-ink/15 bg-cream-100 px-4 py-3 focus:border-brand focus:outline-none" />
            {errors.message && <p className="mt-1 text-sm text-brand">{errors.message.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full">Send via WhatsApp</button>
        </form>
      </div>
    </div>
  );
}
