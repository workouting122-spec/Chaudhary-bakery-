import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { site, waLink, telLink } from "@/config/site";

export default function ContactSection() {
  return (
    <section className="bg-cream-200 py-20 md:py-28" id="visit">
      <div className="container-x grid gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Visit us</p>
          <h2 className="font-display text-display-md">Come by, or order in.</h2>

          <ul className="mt-8 space-y-5 text-ink-soft">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 shrink-0 text-brand" size={20} />
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 shrink-0 text-brand" size={20} />
              <a href={telLink()} className="hover:text-brand">{site.phoneDisplay}</a>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 shrink-0 text-brand" size={20} />
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                Order on WhatsApp
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 shrink-0 text-brand" size={20} />
              <span>
                {site.hours.map((h) => (
                  <span key={h.day} className="block">
                    <strong className="font-medium text-ink">{h.day}:</strong> {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <div className="h-80 overflow-hidden rounded-2xl shadow-soft md:h-full md:min-h-[24rem]">
          <iframe
            title="Shop location map"
            src={site.address.mapEmbedSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
