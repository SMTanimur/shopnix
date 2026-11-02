import React from 'react';

export function FloatingParticles() {
  const particles = [
    { x: '12%', y: '22%', size: 6, delay: '0s', duration: '6s', opacity: 0.3 },
    { x: '88%', y: '18%', size: 8, delay: '1.5s', duration: '7s', opacity: 0.35 },
    { x: '25%', y: '68%', size: 5, delay: '2.5s', duration: '5.5s', opacity: 0.25 },
    { x: '80%', y: '62%', size: 7, delay: '0.8s', duration: '8s', opacity: 0.3 },
    { x: '5%', y: '48%', size: 4, delay: '3.2s', duration: '6.5s', opacity: 0.2 },
    { x: '94%', y: '42%', size: 5, delay: '2.1s', duration: '7.5s', opacity: 0.25 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="absolute rounded-full bg-gradient-to-r from-primary to-rose-400 animate-pulse motion-safe:animate-bounce"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
