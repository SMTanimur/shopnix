import React from 'react';

export function AnimatedPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <svg
        className="w-full h-full opacity-25 dark:opacity-20"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hero-path-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" stopOpacity="0" />
            <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-path-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0" />
            <stop offset="50%" stopColor="#E11D48" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dynamic Curved Flow Paths */}
        <path
          d="M-50 180 C 320 80, 580 340, 920 160 C 1220 20, 1380 260, 1500 210"
          stroke="url(#hero-path-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
        />

        <path
          d="M-80 320 C 260 220, 680 480, 1020 280 C 1260 140, 1420 380, 1520 310"
          stroke="url(#hero-path-grad-2)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeLinecap="round"
        />

        {/* Commerce Network Nodes along the paths */}
        <circle cx="320" cy="120" r="3" fill="#E11D48" fillOpacity="0.6" />
        <circle cx="920" cy="160" r="4" fill="#F43F5E" fillOpacity="0.7" />
        <circle cx="680" cy="440" r="3.5" fill="#FB7185" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
