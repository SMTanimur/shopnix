import React from 'react';

interface ShopnixLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  size?: number;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export function ShopnixIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shopnix-react-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#shopnix-react-grad)" />
      <circle cx="16" cy="18" r="3" fill="#FFFFFF" />
      <circle cx="32" cy="30" r="3" fill="#FFFFFF" />
      <path
        d="M16 18L32 30"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="0.5 4"
        strokeOpacity="0.7"
      />
      <path
        d="M24 13C24 18 20 22 15 22C20 22 24 26 24 31C24 26 28 22 33 22C28 22 24 18 24 13Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ShopnixLogo({
  variant = 'full',
  size = 36,
  className = '',
  theme = 'auto',
}: ShopnixLogoProps) {
  if (variant === 'icon') {
    return <ShopnixIcon size={size} className={className} />;
  }

  const textColorClass =
    theme === 'dark'
      ? 'text-white'
      : theme === 'light'
      ? 'text-slate-900'
      : 'text-foreground';

  const subColorClass =
    theme === 'dark'
      ? 'text-rose-400'
      : 'text-primary';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <ShopnixIcon size={size} className="shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm shadow-primary/20" />
      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight text-lg transition-colors ${textColorClass}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          Shopnix
        </span>
        <span
          className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 ${subColorClass}`}
        >
          Ecommerce OS
        </span>
      </div>
    </div>
  );
}

export default ShopnixLogo;
