import React from 'react';
import { GradientOrbs } from './gradient-orbs';
import { FloatingParticles } from './floating-particles';
import { AnimatedPaths } from './animated-paths';

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      <GradientOrbs />
      <AnimatedPaths />
      <FloatingParticles />
    </div>
  );
}

export * from './gradient-orbs';
export * from './floating-particles';
export * from './animated-paths';
export * from './hero-announcement';
