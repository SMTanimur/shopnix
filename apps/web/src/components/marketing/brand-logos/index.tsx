'use client';

import React from 'react';

export interface LogoProps extends Omit<React.SVGProps<SVGSVGElement>, 'title'> {
  className?: string;
  size?: number;
  title?: string;
}

/** Shopify Official 3D Shopping Bag SVG (#95BF47 & #5E8E3E) */
export function ShopifyLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
      <path
        d="M23.8 9.6L21.5 9a.7.7 0 00-.64.14l-1.68 1.6s-.58-.82-1.7-.82c-1.16 0-1.22.72-1.22.91 0 1 2.66 1.38 2.66 3.72 0 1.85-1.3 2.98-3.05 2.98-2.09 0-3.12-1.3-3.12-1.3l.55-1.78s1.1.96 2.21.96c.66 0 1.01-.43 1.01-.84 0-.95-2.21-1.21-2.21-3.46 0-2.1 1.5-3.5 3.53-3.5 1.61 0 2.5.74 2.5.74l.58-1.86c-.29-.16-.92-.54-2.32-.54-1.85 0-3.76 1.37-4.2 3.36-.02.12-.07.31-.07.31l-2.14.62a.7.7 0 00-.48.64l-1.01 12.36c-.02.31.18.58.48.62l14.93 2.54c.05.01.08.01.13.01.28 0 .5-.19.55-.47l2.16-15.3a.68.68 0 00-.47-.76z"
        fill="#95BF47"
      />
      <path
        d="M21.5 9l-1.92-.56a.7.7 0 00-.64.14l-1.68 1.6V25.4l6.35 1.08 2.16-15.3a.68.68 0 00-.47-.76L21.5 9z"
        fill="#5E8E3E"
        fillOpacity="0.85"
      />
    </svg>
  );
}

/** WooCommerce 2025 Refreshed Brand Mark (#873EFF) */
export function WooCommerceLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#873EFF" />
      <path
        d="M6 9.5h20c1.1 0 2 .9 2 2v8.5c0 1.1-.9 2-2 2H14.5L10 25v-3H6c-1.1 0-2-.9-2-2V11.5c0-1.1.9-2 2-2z"
        fill="#5007AA"
        fillOpacity="0.45"
      />
      <path
        d="M7.5 12.5c.9 3.6 1.8 5.4 2.5 5.4.7 0 1.2-1.4 1.8-3.5.6 2.3 1.2 3.5 1.8 3.5.7 0 1.5-1.8 2.4-5.4h-1.8c-.5 2.4-1 3.6-1.2 3.6-.4 0-.7-1-1.2-3h-1.2c-.5 2.1-.8 3-1.2 3-.4 0-.7-1.2-1.2-3.6H7.5z"
        fill="#FFFFFF"
      />
      <circle cx="19.5" cy="15.5" r="2.3" stroke="#FFFFFF" strokeWidth="1.7" />
      <circle cx="24.5" cy="15.5" r="2.3" stroke="#FFFFFF" strokeWidth="1.7" />
    </svg>
  );
}

/** Daraz Official Isometric Open Parcel Box 'd' Logo (#F85606) */
export function DarazLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#F85606" />
      <path
        d="M19.8 7.2V13L14.6 10.2L9.2 13.4V20L14.6 23.2L19.8 20L22.8 21.8V10.2L19.8 7.2Z"
        fill="#FFFFFF"
      />
      <path d="M14.6 14L18.4 16.4L14.6 18.8L11.6 16.4L14.6 14Z" fill="#F85606" />
    </svg>
  );
}

/** Meta Official Continuous 3D Gradient Infinity Loop (#0064E0 -> #00B2FF) */
export function MetaLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#EFF6FF" stroke="#BFDBFE" />
      <path
        d="M16 19.8c-2.3 3-4.4 4.8-6.8 4.8-3.3 0-5.8-2.8-5.8-6.8 0-4.2 2.6-7.1 6.2-7.1 2.5 0 4.5 1.8 6.4 4.4 1.9-2.6 3.9-4.4 6.4-4.4 3.6 0 6.2 2.9 6.2 7.1 0 4-2.5 6.8-5.8 6.8-2.4 0-4.5-1.8-6.8-4.8zm0-3.5c-1.9-2.8-3.4-4-5.2-4-2 0-3.6 1.8-3.6 4.5 0 2.6 1.5 4.3 3.5 4.3 1.8 0 3.4-1.4 5.3-4.8zm0 0c1.9 3.4 3.5 4.8 5.3 4.8 2 0 3.5-1.7 3.5-4.3 0-2.7-1.6-4.5-3.6-4.5-1.8 0-3.3 1.2-5.2 4z"
        fill="url(#meta-brand-grad)"
      />
      <defs>
        <linearGradient id="meta-brand-grad" x1="3" y1="10" x2="29" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0064E0" />
          <stop offset="0.5" stopColor="#0081FB" />
          <stop offset="1" stopColor="#00B2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Facebook Messenger Official Gradient Lightning Bubble */
export function MessengerLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <defs>
        <linearGradient id="msgr-grad" x1="6" y1="26" x2="26" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#006AFF" />
          <stop offset="0.5" stopColor="#A033FF" />
          <stop offset="1" stopColor="#FF5280" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#msgr-grad)" />
      <path
        d="M16 6.5C10.2 6.5 5.5 10.8 5.5 16.2c0 3 1.5 5.7 3.8 7.5V27l3.3-1.8c1.1.3 2.2.5 3.4.5 5.8 0 10.5-4.3 10.5-9.5S21.8 6.5 16 6.5z"
        fill="#FFFFFF"
      />
      <path
        d="M11.2 18.8l3.2-5.1 2.5 2.5 3.9-2.5-3.2 5.1-2.5-2.5-3.9 2.5z"
        fill="url(#msgr-grad)"
      />
    </svg>
  );
}

/** WhatsApp Official Speech Bubble & Receiver (#25D366) */
export function WhatsAppLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#25D366" />
      <path
        d="M16 6a10 10 0 00-8.6 15L6 26l5.2-1.4A10 10 0 1016 6zm0 18.2c-1.6 0-3.2-.4-4.6-1.2l-.4-.2-3.3.9.9-3.2-.3-.4a8.2 8.2 0 1114.7-4c0 4.6-3.7 8.1-7 8.1zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.4 6.4 0 01-1.9-1.1 7 7 0 01-1.2-1.6c-.1-.2 0-.4.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4l-.8-2c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.2.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.9 4.3.6.3 1.2.5 1.6.6.7.2 1.4.2 1.9.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/** TikTok Official RGB Glitch Note (#000000, #25F4EE, #FE2C55) */
export function TikTokLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#09090B" />
      <path
        d="M20.2 7c.5 1.9 1.9 3.4 3.8 3.8v2.9a6.9 6.9 0 01-3.8-1.1v7.2a6 6 0 11-6-6c.5 0 .9 0 1.4.1v3.1a3 3 0 101.7 2.8V7h2.9z"
        fill="#25F4EE"
      />
      <path
        d="M21 7.6c.5 1.9 1.9 3.4 3.8 3.8v2.3a6.9 6.9 0 01-3.8-1.1v7.8a6 6 0 11-6-6c.5 0 .9 0 1.4.1v3.1a3 3 0 101.7 2.8V7.6H21z"
        fill="#FE2C55"
        style={{ mixBlendMode: 'screen' }}
      />
      <path
        d="M20.5 7.3c.5 1.9 1.9 3.4 3.8 3.8v2.5a6.9 6.9 0 01-3.8-1.1v7.5a6 6 0 11-6-6c.5 0 .9 0 1.4.1v3.1a3 3 0 101.7 2.8V7.3h2.9z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/** Google Ads Official Tri-Color A-Frame (#FBBC04, #4285F4, #34A853) */
export function GoogleAdsLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
      <path
        d="M8.2 20.4l6.1-10.6c.5-.9 1.7-1.2 2.6-.7l2.6 1.6c.9.5 1.2 1.7.7 2.6l-6.1 10.6c-.5.9-1.7 1.2-2.6.7l-2.6-1.6c-.9-.5-1.2-1.7-.7-2.6z"
        fill="#FBBC04"
      />
      <path
        d="M18.4 9.1l6.1 10.6c.5.9.2 2.1-.7 2.6l-2.6 1.6c-.9.5-2.1.2-2.6-.7L12.5 12.6c-.5-.9-.2-2.1.7-2.6l2.6-1.6c.9-.5 2.1-.2 2.6.7z"
        fill="#4285F4"
      />
      <circle cx="10.6" cy="22" r="2.9" fill="#34A853" />
    </svg>
  );
}

/** Steadfast Courier Official Express Chevron & Shield (#E11D48 & #0F172A) */
export function SteadfastLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#0F172A" />
      <path d="M6.5 11H19.5L23.5 16L19.5 21H6.5L10.5 16L6.5 11Z" fill="#E11D48" />
      <path d="M13.5 11H21.5L25.5 16L21.5 21H13.5L17.5 16L13.5 11Z" fill="#FFFFFF" />
    </svg>
  );
}

/** Pathao Courier Official 2023 Rebrand Ribbon Mark (#EF233C) */
export function PathaoLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#EF233C" />
      <path
        d="M10.5 23.5V12.5C10.5 9.7 12.7 7.5 15.5 7.5H18.5C21.3 7.5 23.5 9.7 23.5 12.5C23.5 15.3 21.3 17.5 18.5 17.5H14.5V23.5H10.5Z"
        fill="#FFFFFF"
      />
      <circle cx="17.5" cy="12.5" r="2.4" fill="#EF233C" />
      <path d="M14.5 19.5H21.5" stroke="#FECDD3" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** RedX Courier Official Split Arrow X Emblem (#E51937 & #18181B) */
export function RedXLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#18181B" />
      <path d="M8 8H13.2L24 24H18.8L8 8Z" fill="#E51937" />
      <path d="M24 8H18.8L16 12.2L18.6 16L24 8Z" fill="#FFFFFF" />
      <path d="M8 24H13.2L16 19.8L13.4 16L8 24Z" fill="#E51937" />
    </svg>
  );
}

/** eCourier Official Speed Parcel Mark (#0088CC) */
export function ECourierLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#0088CC" />
      <path
        d="M11 16H22C22 12.1 19.1 9.5 15.8 9.5C12.2 9.5 9.5 12.3 9.5 16C9.5 19.7 12.3 22.5 16.2 22.5C18.8 22.5 20.8 21.3 21.8 19.6"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M5.5 12.5H8M4.5 16H7M5.5 19.5H8" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Paperfly Courier Official Dual-Tone Origami Wing (#0072BC & #38BDF8) */
export function PaperflyLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#0072BC" />
      <path d="M6.5 15.5L25.5 7.5L17.5 25.5L14.2 17.8L6.5 15.5Z" fill="#FFFFFF" />
      <path d="M25.5 7.5L14.2 17.8L17.5 21.2L25.5 7.5Z" fill="#38BDF8" />
    </svg>
  );
}

/** Carrybee Express Honeycomb Parcel Emblem (#F59E0B & #18181B) */
export function CarrybeeLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#18181B" />
      <path d="M16 6.5L24.2 11.2V20.8L16 25.5L7.8 20.8V11.2L16 6.5Z" fill="#F59E0B" />
      <path d="M12 14.5H20M12 17.8H20" stroke="#18181B" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** bKash Official Origami Hummingbird Emblem (#E2136E / #D12053) */
export function BkashLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#E2136E" />
      <path d="M7.5 7.5L16.8 12.2L13.2 17.5L7.5 7.5Z" fill="#FFFFFF" />
      <path d="M21.5 6.8L16.8 12.2L19.8 16.4L21.5 6.8Z" fill="#F9A8D4" />
      <path d="M13.2 17.5L16.8 12.2L20.4 17.8L15.4 21.6L13.2 17.5Z" fill="#FFFFFF" opacity="0.92" />
      <path d="M19.8 16.4L25.5 14.8L20.4 17.8L19.8 16.4Z" fill="#FFFFFF" />
      <path d="M15.4 21.6L20.4 17.8L18.2 25.5L10.8 24.2L15.4 21.6Z" fill="#FCE7F3" />
    </svg>
  );
}

/** Nagad Official Dynamic Flame Crest (#EC1C24 & #F6921E) */
export function NagadLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#FFF7ED" stroke="#FED7AA" />
      <defs>
        <linearGradient id="nagad-grad-a" x1="8" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F6921E" />
          <stop offset="1" stopColor="#EC1C24" />
        </linearGradient>
      </defs>
      <path
        d="M16.5 5.5C11.2 8.2 8 13.5 9.2 19.2C10.1 23.4 13.8 26.2 18.2 26.2C22.4 26.2 25.5 23.1 25.5 18.8C25.5 14.5 22.2 11.8 19.5 9.5C20.2 12.8 19.1 15.6 16.8 17.2C14.5 14.8 14.8 10.2 16.5 5.5Z"
        fill="url(#nagad-grad-a)"
      />
      <circle cx="15.5" cy="19.5" r="2.6" fill="#FFFFFF" />
    </svg>
  );
}

/** Rocket (DBBL) Mobile Banking Official Emblem (#8C3494) */
export function RocketLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#8C3494" />
      <path
        d="M22.5 8.5C18.2 8.8 13.8 11.8 11.2 16.2L8.5 15.5L7 18.5L10.2 19.8L12.2 21.8L13.5 25L16.5 23.5L15.8 20.8C20.2 18.2 23.2 13.8 23.5 9.5L22.5 8.5Z"
        fill="#FFFFFF"
      />
      <circle cx="18.5" cy="13.5" r="1.8" fill="#8C3494" />
      <path d="M7.5 24.5L11.2 20.8L9.8 19.4L7.5 24.5Z" fill="#ED1C24" />
    </svg>
  );
}

/** SSLCommerz Official Security Shield (#0054A6 & #38BDF8) */
export function SSLCommerzLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#0054A6" />
      <path
        d="M16 5.5L7.5 9.2V15.8C7.5 21.2 11.1 25.9 16 27.5C20.9 25.9 24.5 21.2 24.5 15.8V9.2L16 5.5Z"
        fill="#00AEEF"
        fillOpacity="0.25"
        stroke="#FFFFFF"
        strokeWidth="1.6"
      />
      <path
        d="M11.5 16.2L14.6 19.3L20.8 13.1"
        stroke="#38BDF8"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Google Gemini Official Spark Star */
export function GeminiLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#1E1B4B" />
      <path
        d="M16 5C16 11.075 11.075 16 5 16C11.075 16 16 20.925 16 27C16 20.925 20.925 16 27 16C20.925 16 16 11.075 16 5Z"
        fill="url(#gemini-spark-grad)"
      />
      <defs>
        <linearGradient id="gemini-spark-grad" x1="5" y1="5" x2="27" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#818CF8" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** OpenAI Official Blossom Knot (#10A37F) */
export function OpenAILogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#10A37F" />
      <path
        d="M24.2 14.1a4.9 4.9 0 00-.4-3.8 5 5 0 00-4.3-2.3c-.4 0-.8.1-1.2.3a4.9 4.9 0 00-4.1-2.2 5 5 0 00-4.8 3.4 5 5 0 00-3.1 2.2 4.9 4.9 0 00-.5 4.3 5 5 0 00-1.3 3.6 5 5 0 003.2 4.7c.1.4.3.9.5 1.3a5 5 0 004 2.5c.4 0 .9 0 1.3-.3a4.9 4.9 0 004.1 2.2 5 5 0 004.8-3.4 5 5 0 003.1-2.2 4.9 4.9 0 00.5-4.3c.9-.8 1.3-1.9 1.3-3.2 0-1.3-.5-2.3-1.2-2.8z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** OpenRouter Official Routing Node Mark */
export function OpenRouterLogo({ size = 24, className = '', ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
      <rect width="32" height="32" rx="8" fill="#4338CA" />
      <circle cx="10.5" cy="10.5" r="3" fill="#A5B4FC" />
      <circle cx="21.5" cy="10.5" r="3" fill="#A5B4FC" />
      <circle cx="16" cy="21.5" r="3" fill="#38BDF8" />
      <path d="M10.5 10.5L16 21.5L21.5 10.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Universal Brand Logo Resolver for any Courier, Payment Gateway, Storefront, or Channel */
export function BrandLogo({
  brand,
  size = 24,
  className = '',
}: {
  brand: string;
  size?: number;
  className?: string;
}) {
  const key = (brand || '').toLowerCase().trim();
  switch (key) {
    case 'steadfast':
      return <SteadfastLogo size={size} className={className} />;
    case 'pathao':
      return <PathaoLogo size={size} className={className} />;
    case 'redx':
      return <RedXLogo size={size} className={className} />;
    case 'paperfly':
      return <PaperflyLogo size={size} className={className} />;
    case 'ecourier':
      return <ECourierLogo size={size} className={className} />;
    case 'carrybee':
      return <CarrybeeLogo size={size} className={className} />;
    case 'shopify':
      return <ShopifyLogo size={size} className={className} />;
    case 'woocommerce':
      return <WooCommerceLogo size={size} className={className} />;
    case 'daraz':
      return <DarazLogo size={size} className={className} />;
    case 'whatsapp':
      return <WhatsAppLogo size={size} className={className} />;
    case 'facebook_messenger':
    case 'messenger':
      return <MessengerLogo size={size} className={className} />;
    case 'meta':
    case 'facebook':
      return <MetaLogo size={size} className={className} />;
    case 'bkash':
      return <BkashLogo size={size} className={className} />;
    case 'nagad':
      return <NagadLogo size={size} className={className} />;
    case 'rocket':
      return <RocketLogo size={size} className={className} />;
    case 'sslcommerz':
    case 'card':
    case 'online':
      return <SSLCommerzLogo size={size} className={className} />;
    case 'tiktok':
      return <TikTokLogo size={size} className={className} />;
    case 'google_ads':
    case 'google':
      return <GoogleAdsLogo size={size} className={className} />;
    case 'gemini':
      return <GeminiLogo size={size} className={className} />;
    case 'openai':
      return <OpenAILogo size={size} className={className} />;
    case 'openrouter':
    default:
      return <OpenRouterLogo size={size} className={className} />;
  }
}
