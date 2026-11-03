import { useId } from "react";

export function InstagramIcon() {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        {/* One gradient across the whole glyph, like the app icon */}
        <radialGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          cx="6"
          cy="23"
          r="26"
        >
          <stop offset="0" stopColor="#ffd776" />
          <stop offset="0.25" stopColor="#f3a554" />
          <stop offset="0.45" stopColor="#f13a69" />
          <stop offset="0.7" stopColor="#bf3ab2" />
          <stop offset="1" stopColor="#6a5bf2" />
        </radialGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} strokeWidth={2.1}>
        <rect x="3" y="3" width="18" height="18" rx="5.2" />
        <circle cx="12" cy="12" r="4.2" />
      </g>
      <circle cx="17.2" cy="6.8" r="1.15" fill={`url(#${gradientId})`} />
    </svg>
  );
}
