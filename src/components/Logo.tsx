import type { SVGProps } from 'react';

/** The Madhuvan emblem: three towers rising from a home, cradled by two leaves. */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="28" y="12" width="6.5" height="36" />
      <rect x="46.75" y="2" width="6.5" height="30" />
      <rect x="65.5" y="20" width="6.5" height="28" />
      <path d="M28 70V45.5L50 29.5l22 16V70h-6.5V48.8L50 37.6 34.5 48.8V70Z" />
      <rect x="45.5" y="57" width="9" height="9" />
      <path d="M50 99C38 98 21 92 10 74c13-3 30 1 40 25Z" />
      <path d="M50 99c12-1 29-7 40-25-13-3-30 1-40 25Z" />
    </svg>
  );
}

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <span className={`logo logo--${tone}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__type">
        <span className="logo__name">Madhuvan</span>
        <span className="logo__sub">Enclave</span>
      </span>
    </span>
  );
}
