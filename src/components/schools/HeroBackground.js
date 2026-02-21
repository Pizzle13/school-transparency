'use client';

/**
 * Animated grid background for school directory hero sections.
 * Renders a subtle grid pattern with randomly glowing cells.
 * Pure CSS — no framer-motion or other dependencies.
 */
export default function HeroBackground() {
  // 12 cells with different positions and animation delays
  // to create a scattered, organic glow effect
  const cells = [
    { col: 2, row: 1, delay: 0 },
    { col: 7, row: 2, delay: 1.5 },
    { col: 4, row: 3, delay: 3 },
    { col: 10, row: 1, delay: 0.8 },
    { col: 1, row: 4, delay: 2.2 },
    { col: 8, row: 3, delay: 4 },
    { col: 5, row: 1, delay: 1 },
    { col: 11, row: 4, delay: 3.5 },
    { col: 3, row: 2, delay: 2.8 },
    { col: 9, row: 4, delay: 0.5 },
    { col: 6, row: 3, delay: 4.5 },
    { col: 12, row: 2, delay: 1.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Glowing cells */}
      {cells.map((cell, i) => (
        <div
          key={i}
          className="absolute w-[80px] h-[80px] animate-grid-glow"
          style={{
            left: `${(cell.col - 1) * 80}px`,
            top: `${(cell.row - 1) * 80}px`,
            animationDelay: `${cell.delay}s`,
          }}
        >
          <div className="w-full h-full bg-orange-500/10 rounded-sm" />
        </div>
      ))}

      {/* Bottom fade to blend into content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-900 to-transparent" />
    </div>
  );
}
