import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  };
}

export const Icons = {
  logo: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 17V7l7 5 7-5v10" />
    </svg>
  ),
  sun: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  ),
  menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  github: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  ),
  copy: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  arrowRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  rocket: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2Z" />
      <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
    </svg>
  ),
  layers: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m12 2 10 5-10 5L2 7l10-5Z" />
      <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  hook: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M18 4v8a6 6 0 0 1-12 0V9" />
      <path d="m3 12 3-3 3 3" />
    </svg>
  ),
  tabs: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 16h18M9 16v5M15 16v5" />
    </svg>
  ),
  nested: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
    </svg>
  ),
  shield: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  book: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  ),
  back: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  ),
  zap: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </svg>
  ),
  feather: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M20.2 12.2A6 6 0 0 0 11.8 3.8L5 10.6V19h8.4Z" />
      <path d="M16 8 2 22M17.5 15H9" />
    </svg>
  ),
  android: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 16V10a7 7 0 0 1 14 0v6Z" />
      <path d="M5 16h14v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2ZM8 3l1.5 2.5M16 3l-1.5 2.5" />
      <circle cx="9.5" cy="10" r=".5" fill="currentColor" />
      <circle cx="14.5" cy="10" r=".5" fill="currentColor" />
    </svg>
  ),
  apple: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 7c-1-1.5-2.5-2-4-2-2.8 0-5 2.5-5 6 0 4.5 3 10 5.5 10 1.3 0 2-.8 3.5-.8s2.2.8 3.5.8C18 21 21 15.5 21 11c0-3.5-2.2-6-5-6-1.5 0-3 .5-4 2Z" />
      <path d="M12 7c0-2 1-4 3-5" />
    </svg>
  ),
  globe: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  ),
  info: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  bulb: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
    </svg>
  ),
  alert: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
};

export type IconName = keyof typeof Icons;
