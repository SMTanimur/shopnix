import React from 'react';

interface ShopnixLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  size?: number;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  showBadge?: boolean;
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
        <linearGradient id="shopnix-react-icon-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
        <linearGradient id="shopnix-react-bolt-grad" x1="24" y1="25" x2="40" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
        <linearGradient id="shopnix-react-spark-gold" x1="40" y1="9" x2="52" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Squircle Base with Crimson-Rose Gradient */}
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#shopnix-react-icon-bg)" />

      {/* Top Specular Sheen */}
      <path d="M4 20C4 11.16 11.16 4 20 4H44C52.84 4 60 11.16 60 20V26L4 38V20Z" fill="#FFFFFF" fillOpacity="0.12" />

      {/* Shopping Bag Handle */}
      <path
        d="M24 20C24 14.5 27.6 10.5 32 10.5C36.4 10.5 40 14.5 40 20"
        stroke="#FFFFFF"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shopping Bag Body */}
      <path
        d="M16.5 21H47.5L44.2 46.8C43.8 49.6 41.5 51.5 38.6 51.5H25.4C22.5 51.5, 20.2 49.6, 19.8 46.8L16.5 21Z"
        fill="#FFFFFF"
      />

      {/* Subtle Inner Crease */}
      <path
        d="M16.5 21L23 27H41L47.5 21"
        stroke="#F43F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.25"
      />

      {/* High-Velocity Speed Bolt (Center of Bag) */}
      <path
        d="M34 25.5L23.5 37.5H30.5L28 47.5L40.5 35.5H33.5L34 25.5Z"
        fill="url(#shopnix-react-bolt-grad)"
      />

      {/* Innovation Spark / Star */}
      <path
        d="M46 9.5C46 12.5 43.5 14.5 40.5 14.5C43.5 14.5 46 16.5 46 19.5C46 16.5 48.5 14.5 51.5 14.5C48.5 14.5 46 12.5 46 9.5Z"
        fill="url(#shopnix-react-spark-gold)"
      />
    </svg>
  );
}

export function ShopnixLogo({
  variant = 'full',
  size = 38,
  className = '',
  theme = 'auto',
  showBadge = true,
}: ShopnixLogoProps) {
  if (variant === 'icon') {
    return <ShopnixIcon size={size} className={className} />;
  }

  const textColor =
    theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-slate-900' : 'text-slate-900 dark:text-white';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <ShopnixIcon
        size={size}
        className="shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-md shadow-rose-500/20"
      />
      <div className="flex items-center gap-2 leading-none">
        <span
          className={`font-black tracking-tight text-xl sm:text-[22px] transition-colors ${textColor}`}
          style={{ letterSpacing: '-0.035em' }}
        >
          Shop<span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500">nix</span>
        </span>
        {showBadge && (
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 tracking-wider uppercase ml-0.5">
            OS
          </span>
        )}
      </div>
    </div>
  );
}

export default ShopnixLogo;
