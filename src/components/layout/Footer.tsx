import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import { site, telLink, mailLink } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink-950">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl text-bone">{site.name}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-muted">
              {site.fullName}. {site.tagline}. Private viewings by appointment.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Visit</p>
            <address className="not-italic text-sm leading-relaxed text-bone-muted">
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>
          </div>

          <div>
            <p className="eyebrow mb-4">Enquiries</p>
            <ul className="space-y-2 text-sm text-bone-muted">
              <li>
                <a href={telLink()} className="transition hover:text-bone">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailLink()} className="transition hover:text-bone">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-4 pt-3">
                <a href={site.social.instagram} aria-label="Instagram" className="transition hover:text-brass">
                  <Instagram size={18} />
                </a>
                <a href={site.social.linkedin} aria-label="LinkedIn" className="transition hover:text-brass">
                  <Linkedin size={18} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-8 text-xs text-bone-faint sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="transition hover:text-bone">
              Book a Viewing
            </Link>
            <a href="#top" className="transition hover:text-bone">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
