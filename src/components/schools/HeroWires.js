'use client';

import { motion } from 'framer-motion';

/**
 * Auto-animating wire lines that flow in from the left, split around
 * the title text block (like water around a rock), and exit right.
 *
 * ViewBox 1440x400. The "text block" sits roughly at x:350–1090, y:80–280.
 * Wires approach at center-height, diverge to trace over/under the text,
 * then reconverge and exit.
 */
export default function HeroWires() {
  const wires = [
    {
      // Inner top — hugs the title block top edge
      d: [
        'M-20 200',
        'C 120 200, 220 200, 300 195',   // approach from left
        'C 340 190, 355 140, 375 105',   // curve upward
        'C 400 65, 450 48, 530 42',      // arc over top-left corner
        'L 910 42',                       // trace along top edge
        'C 990 42, 1040 48, 1065 105',   // arc over top-right corner
        'C 1085 140, 1100 190, 1140 195', // curve back down
        'C 1220 200, 1320 200, 1460 200', // exit right
      ].join(' '),
      color: '#f59e0b', // amber-500
      delay: 0,
      width: 1.5,
      glowWidth: 4,
    },
    {
      // Outer top — wider arc above the title
      d: [
        'M-20 198',
        'C 100 198, 180 198, 260 190',   // approach from left
        'C 310 185, 330 110, 355 60',    // steep curve up
        'C 380 15, 440 0, 540 -4',       // wide arc
        'L 900 -4',                       // trace far above
        'C 1000 0, 1060 15, 1085 60',    // arc back
        'C 1110 110, 1130 185, 1180 190', // curve down
        'C 1260 198, 1340 198, 1460 198', // exit right
      ].join(' '),
      color: '#fb923c', // orange-400
      delay: 0.6,
      width: 1,
      glowWidth: 3,
    },
    {
      // Inner bottom — hugs the title block bottom edge
      d: [
        'M-20 205',
        'C 120 205, 220 205, 300 210',   // approach from left
        'C 340 215, 355 265, 375 300',   // curve downward
        'C 400 340, 450 358, 530 362',   // arc under bottom-left
        'L 910 362',                      // trace along bottom edge
        'C 990 362, 1040 358, 1065 300', // arc under bottom-right
        'C 1085 265, 1100 215, 1140 210', // curve back up
        'C 1220 205, 1320 205, 1460 205', // exit right
      ].join(' '),
      color: '#ea580c', // orange-600
      delay: 1.2,
      width: 1.5,
      glowWidth: 4,
    },
    {
      // Outer bottom — wider arc below the title
      d: [
        'M-20 203',
        'C 100 203, 180 203, 260 212',   // approach from left
        'C 310 220, 330 300, 355 350',   // steep curve down
        'C 380 395, 440 410, 540 414',   // wide arc below
        'L 900 414',                      // trace far below
        'C 1000 410, 1060 395, 1085 350', // arc back
        'C 1110 300, 1130 220, 1180 212', // curve up
        'C 1260 203, 1340 203, 1460 203', // exit right
      ].join(' '),
      color: '#fdba74', // orange-300
      delay: 1.8,
      width: 1,
      glowWidth: 3,
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Subtle grid lines underneath */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* SVG wire paths */}
      <svg
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="wire-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>

        {wires.map((wire, i) => (
          <g key={i}>
            {/* Blurred glow layer */}
            <motion.path
              d={wire.d}
              stroke={wire.color}
              strokeWidth={wire.glowWidth}
              strokeLinecap="round"
              fill="none"
              filter="url(#wire-glow)"
              opacity={0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{
                duration: 10,
                delay: wire.delay,
                repeat: Infinity,
                repeatDelay: 2.5,
                times: [0, 0.4, 0.75, 1],
                ease: 'easeInOut',
              }}
            />
            {/* Sharp foreground line */}
            <motion.path
              d={wire.d}
              stroke={wire.color}
              strokeWidth={wire.width}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{
                duration: 10,
                delay: wire.delay,
                repeat: Infinity,
                repeatDelay: 2.5,
                times: [0, 0.4, 0.75, 1],
                ease: 'easeInOut',
              }}
            />
          </g>
        ))}
      </svg>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-900 to-transparent" />
    </div>
  );
}
