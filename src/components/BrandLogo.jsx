// Brand emblem for مُلتقى — an endless (infinity) knot: two interlaced
// circular loops with alternating over-under crossings, rendered as a
// single deep-purple stroke. Scalable SVG; the wordmark is rendered
// separately beside it.
export default function BrandLogo({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="شعار مُلتقى" xmlns="http://www.w3.org/2000/svg">
      {/* Left loop: continuous except for a gap at the lower crossing,
          so the right loop passes over it there. */}
      <path
        d="M 29.08 43.49 A 13 13 0 1 1 34.24 38.54"
        fill="none"
        stroke="#452445"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right loop: continuous except for a gap at the upper crossing,
          so the left loop passes over it there. */}
      <path
        d="M 29.76 25.46 A 13 13 0 1 0 34.93 20.51"
        fill="none"
        stroke="#452445"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}