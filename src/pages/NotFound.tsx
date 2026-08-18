import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <p className="font-display text-6xl text-brand">404</p>
      <h1 className="font-display text-3xl">This page has been eaten.</h1>
      <p className="text-ink-soft">The page you're looking for isn't on the menu.</p>
      <Link to="/" className="btn-primary">Back home</Link>
    </div>
  );
}
