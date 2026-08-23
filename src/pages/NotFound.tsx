import { Link } from "react-router-dom";
import Backdrop from "@/components/cine/Backdrop";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] items-center overflow-hidden">
      <Backdrop tone="night" variant="landscape" dim={0.5} />
      <div className="container-x relative z-10 text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="mx-auto max-w-2xl text-display-md">
          This room isn’t part of the tour.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-bone-muted">
          The page you were looking for has moved or never existed.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/" className="btn-primary">
            Return to the entrance
          </Link>
          <Link to="/contact" className="btn-ghost">
            Book a viewing
          </Link>
        </div>
      </div>
    </div>
  );
}
