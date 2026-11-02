import React from 'react';

interface ShopnixLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  size?: number;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export function ShopnixIcon({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shopnix-icon-react-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="60%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
        <linearGradient id="spark-grad-react" x1="32" y1="20" x2="44" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Squircle Base with Crimson-Rose Gradient */}
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#shopnix-icon-react-bg)" />

      {/* Subtle Top Specular Sheen */}
      <path d="M4 20C4 11.16 11.16 4 20 4H44C52.84 4 60 11.16 60 20V26L4 38V20Z" fill="#FFFFFF" fillOpacity="0.12" />

      {/* Bag Handle */}
      <path
        d="M24 23V19C24 14.58 27.58 11 32 11C36.42 11 40 14.58 40 19V23"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shopping Bag Silhouette */}
      <path
        d="M17 23H47L44.8 45.2C44.5 48.2 42 50.5 39 50.5H25C22 50.5 19.5 48.2 19.2 45.2L17 23Z"
        fill="#FFFFFF"
      />

      {/* Bag Inner Shading */}
      <path
        d="M17 23L24 29H40L47 23"
        stroke="#F43F5E"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeOpacity="0.3"
      />

      {/* Dynamic 'S' Velocity Swoosh */}
      <path
        d="M23 37C23 33 27 30 32 30C37 30 40 33 40 36C40 40 33 41 27 43C24 44 23 46 23 48H41"
        stroke="#E11D48"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Innovation Spark */}
      <path
        d="M44 18C44 21.5 41.5 24 38 24C41.5 24 44 26.5 44 30C44 26.5 46.5 24 50 24C46.5 24 44 21.5 44 18Z"
        fill="url(#spark-grad-react)"
      />
    </svg>
  );
}

export function ShopnixLogo({
  variant = 'full',
  size = 38,
  className = '',
  theme = 'auto',
}: ShopnixLogoProps) {
  if (variant === 'icon') {
    return <ShopnixIcon size={size} className={className} />;
  }

  const textColor =
    theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-slate-900' : 'text-slate-900 dark:text-white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <ShopnixIcon
        size={size}
        className="shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-md shadow-rose-500/20"
      />
      <div className="flex items-center gap-1.5 leading-none">
        <span
          className={`font-black tracking-tight text-xl transition-colors ${textColor}`}
          style={{ letterSpacing: '-0.04em' }}
        >
          Shop<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-500">nix</span>
        </span>
        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 tracking-wider uppercase ml-0.5">
          OS
        </span>
      </div>
    </div>
  );
}

export default ShopnixLogo;
