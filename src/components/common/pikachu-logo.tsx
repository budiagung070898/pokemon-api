import { useId } from "react";

const OUTLINE = "#1c1917";
const YELLOW = "#FFD43B";
const CHEEK = "#E8402F";

const LEFT_EAR = "M18 28 C 11 20, 6 10, 4 2 C 13 6, 22 14, 28 22 Z";
const RIGHT_EAR = "M46 28 C 53 20, 58 10, 60 2 C 51 6, 42 14, 36 22 Z";

/**
 * Site logo: a simple Pikachu head. Same drawing as `app/icon.svg` (favicon).
 * Decorative — the link around it carries the accessible name.
 */
export function PikachuLogo({ className }: { className?: string }) {
  // Unique clip ids so several logos on one page don't collide.
  const id = useId();
  const leftEar = `${id}-left-ear`;
  const rightEar = `${id}-right-ear`;

  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <defs>
        <clipPath id={leftEar}>
          <path d={LEFT_EAR} />
        </clipPath>
        <clipPath id={rightEar}>
          <path d={RIGHT_EAR} />
        </clipPath>
      </defs>
      <g stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round" fill={YELLOW}>
        <path d={LEFT_EAR} />
        <path d={RIGHT_EAR} />
      </g>
      {/* Black ear tips */}
      <circle cx={4} cy={2} r={11} fill={OUTLINE} clipPath={`url(#${leftEar})`} />
      <circle cx={60} cy={2} r={11} fill={OUTLINE} clipPath={`url(#${rightEar})`} />

      <ellipse cx={32} cy={41} rx={23} ry={19} fill={YELLOW} stroke={OUTLINE} strokeWidth={2} />
      <circle cx={23} cy={37} r={4.2} fill={OUTLINE} />
      <circle cx={41} cy={37} r={4.2} fill={OUTLINE} />
      <circle cx={21.8} cy={35.6} r={1.5} fill="#fff" />
      <circle cx={39.8} cy={35.6} r={1.5} fill="#fff" />
      <ellipse cx={14.5} cy={46} rx={5} ry={4.2} fill={CHEEK} />
      <ellipse cx={49.5} cy={46} rx={5} ry={4.2} fill={CHEEK} />
      <ellipse cx={32} cy={42} rx={1.2} ry={0.8} fill={OUTLINE} />
      <path
        d="M27.5 45.5 q2.25 2.8 4.5 0 q2.25 2.8 4.5 0"
        fill="none"
        stroke={OUTLINE}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
