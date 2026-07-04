import { HomeClient } from "./HomeClient";

export default function HomePage() {
  return (
    <>
      {/* Warm the hero poster early and at high priority — it is the LCP element.
          Scoped to the homepage so other routes do not fetch it. Next/React hoist
          this <link> into <head>. */}
      <link
        rel="preload"
        as="image"
        href="/hero-poster.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <HomeClient />
    </>
  );
}
