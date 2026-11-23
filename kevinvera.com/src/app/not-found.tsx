import { PenLink } from "@/components/PenLink";

export const metadata = { title: "Not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="lost">
      <p className="tag">404</p>
      <h1 className="title">Nothing drawn here yet.</h1>
      <p className="lede">The page you asked for does not exist. Everything that does is one click away.</p>
      <div>
        <PenLink href="/">Back to the start</PenLink>
      </div>
    </section>
  );
}
