"use client";

/**
 * Stylised ballot urn. The SVG is deliberately simple (no realistic shading)
 * so it reads as a civic symbol rather than a 3D render.
 */
export function BallotUrn({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 200"
      className={className}
      fill="none"
      aria-hidden
    >
      {/* Slot */}
      <rect x="55" y="44" width="50" height="4" rx="2" fill="#1A1A1C" />

      {/* Urn body */}
      <path
        d="M30 60 L130 60 L122 180 Q122 188 114 188 L46 188 Q38 188 38 180 Z"
        fill="#F6F6F1"
        stroke="#1A1A1C"
        strokeWidth="1.4"
      />
      {/* Front shadow line */}
      <path
        d="M34 70 L126 70"
        stroke="#1A1A1C"
        strokeOpacity="0.12"
        strokeWidth="1"
      />
      {/* Lid */}
      <rect
        x="26"
        y="52"
        width="108"
        height="10"
        rx="2"
        fill="#FAFAF7"
        stroke="#1A1A1C"
        strokeWidth="1.4"
      />
      {/* Emblem */}
      <g transform="translate(80 126)" opacity="0.65">
        <circle r="18" fill="none" stroke="#1A1A1C" strokeWidth="1" />
        <path
          d="M-10 2 L-2 10 L12 -6"
          stroke="#1A1A1C"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
