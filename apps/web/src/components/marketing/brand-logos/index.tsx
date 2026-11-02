import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function ShopifyLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path
        d="M19.78 6.44l-1.92-.56a.6.6 0 00-.54.12l-1.4 1.34s-.48-.68-1.42-.68c-.97 0-1.02.6-1.02.76 0 .84 2.22 1.15 2.22 3.1 0 1.54-1.08 2.48-2.54 2.48-1.74 0-2.6-1.08-2.6-1.08l.46-1.48s.92.8 1.84.8c.55 0 .84-.36.84-.7 0-.79-1.84-1.01-1.84-2.88 0-1.75 1.25-2.92 2.94-2.92 1.34 0 2.08.62 2.08.62l.48-1.55c-.24-.13-.77-.45-1.93-.45-1.54 0-3.13 1.14-3.5 2.8-.02.1-.06.26-.06.26l-1.78.52a.58.58 0 00-.4.53l-.84 10.3c-.02.26.15.48.4.52l12.44 2.12c.04.01.07.01.11.01.23 0 .42-.16.46-.39l1.8-12.75a.57.57 0 00-.39-.63z"
        fill="#95BF47"
      />
      <path
        d="M17.86 5.88l-1.92-.56a.6.6 0 00-.54.12l-1.4 1.34s-.48-.68-1.42-.68c-.97 0-1.02.6-1.02.76 0 .84 2.22 1.15 2.22 3.1 0 1.54-1.08 2.48-2.54 2.48-1.74 0-2.6-1.08-2.6-1.08l.46-1.48s.92.8 1.84.8c.55 0 .84-.36.84-.7 0-.79-1.84-1.01-1.84-2.88 0-1.75 1.25-2.92 2.94-2.92 1.34 0 2.08.62 2.08.62L17.86 5.88z"
        fill="#5E8E3E"
      />
    </svg>
  );
}

export function WooCommerceLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#7F54B3" />
      <path
        d="M4.5 7h15c.8 0 1.5.7 1.5 1.5v7c0 .8-.7 1.5-1.5 1.5h-9l-3.5 2.5v-2.5h-2.5C3.7 17 3 16.3 3 15.5v-7C3 7.7 3.7 7 4.5 7z"
        fill="#96588A"
      />
      <path
        d="M6 10c.8 3 1.5 4.5 2 4.5.6 0 1-1.2 1.5-3 .5 2 1 3 1.5 3 .6 0 1.2-1.5 2-4.5h-1.5c-.4 2-.8 3-1 3-.3 0-.6-.8-1-2.5h-1c-.4 1.8-.7 2.5-1 2.5-.3 0-.6-1-1-3H6zm8 0c.8 3 1.5 4.5 2 4.5.6 0 1-1.2 1.5-3 .5 2 1 3 1.5 3 .6 0 1.2-1.5 2-4.5h-1.5c-.4 2-.8 3-1 3-.3 0-.6-.8-1-2.5h-1c-.4 1.8-.7 2.5-1 2.5-.3 0-.6-1-1-3H14z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function MetaLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <path
        d="M12 15.2c-1.8 2.4-3.5 3.8-5.4 3.8-2.6 0-4.6-2.2-4.6-5.4 0-3.3 2.1-5.6 4.9-5.6 2 0 3.6 1.4 5.1 3.5 1.5-2.1 3.1-3.5 5.1-3.5 2.8 0 4.9 2.3 4.9 5.6 0 3.2-2 5.4-4.6 5.4-1.9 0-3.6-1.4-5.4-3.8zm0-2.8c-1.5-2.2-2.7-3.2-4.1-3.2-1.6 0-2.9 1.4-2.9 3.6 0 2.1 1.2 3.4 2.8 3.4 1.4 0 2.7-1.1 4.2-3.8zm0 0c1.5 2.7 2.8 3.8 4.2 3.8 1.6 0 2.8-1.3 2.8-3.4 0-2.2-1.3-3.6-2.9-3.6-1.4 0-2.6 1-4.1 3.2z"
        fill="url(#meta-gradient)"
      />
      <defs>
        <linearGradient id="meta-gradient" x1="2" y1="8" x2="22" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0064E0" />
          <stop offset="0.5" stopColor="#0079FF" />
          <stop offset="1" stopColor="#00B2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WhatsAppLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path
        d="M12 4a8 8 0 00-6.9 12L4 20l4.2-1.1A8 8 0 1012 4zm0 14.6c-1.3 0-2.6-.3-3.7-1l-.3-.2-2.7.7.7-2.6-.2-.3a6.6 6.6 0 1111.8-3.2c0 3.7-3 6.6-6.6 6.6zm3.6-4.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1-.1.2-.5.7-.6.8-.1.1-.2.2-.4.1a5.1 5.1 0 01-1.5-.9 5.6 5.6 0 01-1-1.3c-.1-.2 0-.3.1-.4l.3-.3.2-.3c.1-.1 0-.2 0-.3l-.7-1.6c-.2-.4-.3-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2 1 2.3.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function TikTokLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M15.5 5c.4 1.5 1.5 2.7 3 3v2.3a5.5 5.5 0 01-3-.9v5.8a4.8 4.8 0 11-4.8-4.8c.4 0 .7 0 1.1.1v2.5a2.4 2.4 0 101.4 2.2V5h2.3z"
        fill="#25F4EE"
      />
      <path
        d="M16 5.5c.4 1.5 1.5 2.7 3 3v1.8a5.5 5.5 0 01-3-.9v6.3a4.8 4.8 0 11-4.8-4.8c.4 0 .7 0 1.1.1v2.5a2.4 2.4 0 101.4 2.2V5.5h2.3z"
        fill="#FE2C55"
        style={{ mixBlendMode: 'screen' }}
      />
      <path
        d="M15.7 5.2c.4 1.5 1.5 2.7 3 3v2a5.5 5.5 0 01-3-.9v6a4.8 4.8 0 11-4.8-4.8c.4 0 .7 0 1.1.1v2.5a2.4 2.4 0 101.4 2.2V5.2h2.3z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function GoogleAdsLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
      <path
        d="M6.2 15.3l4.6-8c.4-.7 1.3-.9 2-.5l2 1.2c.7.4.9 1.3.5 2l-4.6 8c-.4.7-1.3.9-2 .5l-2-1.2c-.7-.4-.9-1.3-.5-2z"
        fill="#FBBC04"
      />
      <path
        d="M13.8 6.8l4.6 8c.4.7.2 1.6-.5 2l-2 1.2c-.7.4-1.6.2-2-.5l-4.6-8c-.4-.7-.2-1.6.5-2l2-1.2c.7-.4 1.6-.2 2 .5z"
        fill="#4285F4"
      />
      <circle cx="8" cy="16.5" r="2.2" fill="#34A853" />
    </svg>
  );
}

export function SteadfastLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#E11D48" />
      <path d="M5 8h14l-2 8H3L5 8z" fill="#FFFFFF" opacity="0.9" />
      <path d="M10 6l6 6-6 6V6z" fill="#0F172A" />
      <circle cx="16" cy="12" r="2" fill="#F43F5E" />
    </svg>
  );
}

export function PathaoLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#DC2626" />
      <path
        d="M6 14.5c0-4.5 3.5-7.5 7.5-7.5s6.5 2.5 6.5 5.5-2 4.5-5 4.5h-5l-4 3v-5.5z"
        fill="#FFFFFF"
      />
      <circle cx="14" cy="12" r="2.5" fill="#DC2626" />
    </svg>
  );
}

export function RedXLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#18181B" />
      <path d="M6 6l12 12M18 6L6 18" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function ECourierLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#0284C7" />
      <path
        d="M5 12h9m-4-4l4 4-4 4M5 7h4M5 17h5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PaperflyLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#2563EB" />
      <path d="M4 12l16-7-7 15-2-6-7-2z" fill="#FFFFFF" />
    </svg>
  );
}

export function GeminiLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#1E1B4B" />
      <path
        d="M12 4C12 8.418 8.418 12 4 12C8.418 12 12 15.582 12 20C12 15.582 15.582 12 20 12C15.582 12 12 8.418 12 4Z"
        fill="url(#gemini-grad)"
      />
      <defs>
        <linearGradient id="gemini-grad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#818CF8" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OpenAILogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#10A37F" />
      <path
        d="M18.5 10.5a3.8 3.8 0 00-.3-2.9 3.9 3.9 0 00-3.3-1.8c-.3 0-.6.1-.9.2a3.8 3.8 0 00-3.2-1.7 3.9 3.9 0 00-3.7 2.6 3.9 3.9 0 00-2.4 1.7 3.8 3.8 0 00-.4 3.3 3.9 3.9 0 00-1 2.8 3.9 3.9 0 002.5 3.6c.1.3.2.7.4 1a3.9 3.9 0 003.1 1.9c.3 0 .7 0 1-.2a3.8 3.8 0 003.2 1.7 3.9 3.9 0 003.7-2.6 3.9 3.9 0 002.4-1.7 3.8 3.8 0 00.4-3.3c.7-.6 1-1.5 1-2.5 0-1-.4-1.8-1-2.3z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OpenRouterLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#4338CA" />
      <circle cx="8" cy="8" r="2.5" fill="#A5B4FC" />
      <circle cx="16" cy="8" r="2.5" fill="#A5B4FC" />
      <circle cx="12" cy="16" r="2.5" fill="#38BDF8" />
      <path d="M8 8l4 8 4-8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BkashLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#E2136E" />
      <path d="M4 14l8-9 8 9-8 5-8-5z" fill="#FFFFFF" />
      <path d="M12 5v14" stroke="#E2136E" strokeWidth="1.5" />
    </svg>
  );
}

export function NagadLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
      <rect width="24" height="24" rx="6" fill="#F97316" />
      <circle cx="12" cy="12" r="6" fill="#FFFFFF" />
      <path d="M12 8v8m-4-4h8" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
