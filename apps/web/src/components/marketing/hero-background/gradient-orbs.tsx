import React from 'react';

export function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Central Radiant Rose Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[380px] sm:h-[450px] bg-gradient-to-tr from-rose-500/15 via-primary/20 to-pink-500/10 blur-[130px] rounded-full animate-pulse [animation-duration:8s]" />

      {/* Top Left Subtle Orb */}
      <div className="absolute -top-24 left-10 w-[380px] h-[380px] bg-primary/10 blur-[110px] rounded-full animate-pulse [animation-duration:10s]" />

      {/* Top Right Pink Glow */}
      <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] bg-pink-500/10 blur-[120px] rounded-full animate-pulse [animation-duration:12s]" />
    </div>
  );
}
