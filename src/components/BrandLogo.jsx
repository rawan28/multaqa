// Brand emblem for مُلتقى — a circular seal with two intertwined X-like
// shapes, radial gradient from navy (edges) to teal (center) with a soft
// white glow. Scalable SVG, inherits color context from the page.
export default function BrandLogo({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="شعار مُلتقى" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="brandGrad" cx="32" cy="32" r="27" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8fd0e0" />
          <stop offset="0.45" stopColor="#3a86a6" />
          <stop offset="1" stopColor="#103460" />
        </radialGradient>
        <radialGradient id="brandGlow" cx="32" cy="32" r="13" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="none" stroke="url(#brandGrad)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="13" fill="url(#brandGlow)" />
      <g stroke="url(#brandGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M21.5 21.5 L42.5 42.5" />
        <path d="M42.5 21.5 L21.5 42.5" />
        <path d="M32 14 L32 50" />
        <path d="M14 32 L50 32" />
      </g>
    </svg>
  );
}