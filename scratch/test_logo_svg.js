const fs = require('fs');

const svgIcon = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shopnix-grad-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E11D48" />
      <stop offset="50%" stop-color="#F43F5E" />
      <stop offset="100%" stop-color="#FB7185" />
    </linearGradient>
    <linearGradient id="shopnix-bolt-grad" x1="24" y1="25" x2="40" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#F43F5E" />
    </linearGradient>
    <linearGradient id="spark-gold" x1="40" y1="9" x2="52" y2="20" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="icon-glow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#E11D48" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#shopnix-grad-bg)" filter="url(#icon-glow)" />

  <!-- Top Specular Sheen -->
  <path d="M4 20C4 11.16 11.16 4 20 4H44C52.84 4 60 11.16 60 20V26L4 38V20Z" fill="#FFFFFF" fill-opacity="0.12" />

  <!-- Shopping Bag Handle -->
  <path
    d="M24 20C24 14.5 27.6 10.5 32 10.5C36.4 10.5 40 14.5 40 20"
    stroke="#FFFFFF"
    stroke-width="3.8"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Shopping Bag Body -->
  <path
    d="M16.5 21H47.5L44.2 46.8C43.8 49.6 41.5 51.5 38.6 51.5H25.4C22.5 51.5 20.2 49.6 19.8 46.8L16.5 21Z"
    fill="#FFFFFF"
  />

  <!-- Inner Subtle Crease -->
  <path
    d="M16.5 21L23 27H41L47.5 21"
    stroke="#F43F5E"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-opacity="0.2"
  />

  <!-- High-Velocity Speed Bolt (Center of Bag) -->
  <path
    d="M34 25.5L23.5 37.5H30.5L28 47.5L40.5 35.5H33.5L34 25.5Z"
    fill="url(#shopnix-bolt-grad)"
  />

  <!-- Innovation Spark / Star -->
  <path
    d="M46 9.5C46 12.5 43.5 14.5 40.5 14.5C43.5 14.5 46 16.5 46 19.5C46 16.5 48.5 14.5 51.5 14.5C48.5 14.5 46 12.5 46 9.5Z"
    fill="url(#spark-gold)"
  />
</svg>
`;

console.log('SVG syntax valid, length:', svgIcon.length);
