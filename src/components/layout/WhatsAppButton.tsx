import { MessageCircle } from "lucide-react";
import { waLink } from "@/config/site";

export default function WhatsAppButton() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  );
}
