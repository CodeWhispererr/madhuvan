import { useId } from 'react';
import './GateIllustration.css';

// Front elevation of the Madhuvan Enclave entrance, drawn after the official render:
// twin slanted white pylons, cantilevered louvred canopies over the in/out lanes,
// a slatted feature wall carrying the emblem, a planted median, guard cabins and boom barriers.

const GROUND = 500;
// The gate itself spans x 0–1200; wider framings add boundary walls and planting either side.
const SCENE_L = -800;
const SCENE_R = 1460;
const VIEWBOX = {
  normal: '0 100 1200 500',
  /** Gate centred with scenery either side. */
  wide: '-260 100 1720 500',
  /** Gate set towards the right, leaving open sky on the left for a headline. */
  hero: '-760 100 2000 500',
};
export type GateFraming = keyof typeof VIEWBOX;

const treeLine = (() => {
  const heights = [438, 412, 430, 404, 426, 398, 420, 408, 432, 402, 418, 436, 400, 424, 410, 430, 406, 428, 414, 400, 426, 410, 432, 404, 420, 412, 436, 402, 422, 410];
  const step = 41.4;
  const count = Math.ceil((SCENE_R - SCENE_L) / step);
  let d = `M${SCENE_L} ${GROUND} L${SCENE_L} ${heights[0]}`;
  for (let i = 0; i < count; i++) {
    const x = SCENE_L + i * step;
    d += ` Q ${x + step / 2} ${heights[i % heights.length] - 26} ${x + step} ${heights[(i + 1) % heights.length]}`;
  }
  return `${d} L${SCENE_R} ${GROUND} Z`;
})();

const FROND_ANGLES = [158, -168, -138, -108, -76, -44, -14, 18];

function Palm({ x, height, lean, scale = 1 }: { x: number; height: number; lean: number; scale?: number }) {
  const topX = x + lean;
  const topY = GROUND - height;
  return (
    <g className="gate__palm">
      <path
        className="gate__trunk"
        d={`M${x - 5} ${GROUND} Q ${x + lean * 0.2} ${GROUND - height * 0.55} ${topX - 2.5} ${topY} L ${topX + 2.5} ${topY} Q ${x + lean * 0.2 + 7} ${GROUND - height * 0.55} ${x + 5} ${GROUND} Z`}
      />
      {FROND_ANGLES.map((a, i) => (
        <path
          key={a}
          className={i % 2 ? 'gate__frond gate__frond--alt' : 'gate__frond'}
          transform={`translate(${topX} ${topY}) rotate(${a}) scale(${scale})`}
          d="M0 0 C 18 -15, 50 -17, 78 6 C 52 -3, 24 -1, 0 0 Z"
        />
      ))}
    </g>
  );
}

function StreetLight({ x, flip = false }: { x: number; flip?: boolean }) {
  const dir = flip ? -1 : 1;
  return (
    <g className="gate__streetlight">
      <rect className="gate__pole" x={x - 2.5} y={252} width={5} height={GROUND - 252} />
      <path className="gate__pole" d={`M${x} 262 L ${x + dir * 30} 262 L ${x + dir * 30} 268 L ${x} 268 Z`} />
      <rect className="gate__lamp" x={flip ? x - 40 : x + 22} y={266} width={18} height={6} rx={2} />
      <path className="gate__panel" d={`M${x - 26} 246 L ${x + 26} 236 L ${x + 26} 250 L ${x - 26} 258 Z`} />
      <path className="gate__panel-grid" d={`M${x - 9} 243 L ${x - 9} 255 M${x + 9} 240 L ${x + 9} 252 M${x - 26} 252 L ${x + 26} 243`} />
    </g>
  );
}

function BoundaryWall({ x0, x1 }: { x0: number; x1: number }) {
  const pillars: number[] = [];
  for (let x = x0; x <= x1 - 12; x += 70) pillars.push(x);
  return (
    <g className="gate__wall">
      <rect className="gate__wall-body" x={x0} y={420} width={x1 - x0} height={GROUND - 420} />
      <rect className="gate__coping" x={x0} y={412} width={x1 - x0} height={10} />
      {pillars.slice(0, -1).map((p, i) => {
        const next = pillars[i + 1];
        const slats = [];
        for (let sx = p + 20; sx < next - 6; sx += 7) slats.push(sx);
        return (
          <g key={p}>
            <rect className="gate__wall-panel" x={p + 16} y={432} width={next - p - 18} height={56} />
            {slats.map((sx) => (
              <rect key={sx} className="gate__slat" x={sx} y={432} width={3.2} height={56} />
            ))}
          </g>
        );
      })}
      {pillars.map((p) => (
        <rect key={p} className="gate__wall-pillar" x={p} y={406} width={14} height={GROUND - 406} />
      ))}
    </g>
  );
}

function Cabin({ x, flip = false }: { x: number; flip?: boolean }) {
  return (
    <g className="gate__cabin">
      <rect className="gate__cabin-body" x={x} y={384} width={90} height={GROUND - 384} />
      <rect className="gate__cabin-roof" x={x - 10} y={372} width={110} height={13} />
      <rect className="gate__glass" x={x + 12} y={402} width={66} height={38} rx={2} />
      <path className="gate__glass-shine" d={`M${x + 20} 438 L ${x + 44} 404 L ${x + 54} 404 L ${x + 30} 438 Z`} />
      <rect className="gate__sign" x={x + 20} y={450} width={50} height={13} rx={2} />
      <text className="gate__sign-text" x={x + 45} y={459.5} textAnchor="middle">
        SECURITY
      </text>
      <rect className="gate__plinth" x={x - 2} y={492} width={94} height={8} />
      <rect className="gate__post" x={flip ? x + 76 : x + 4} y={176} width={10} height={196} />
    </g>
  );
}

function Canopy({ x, width }: { x: number; width: number }) {
  const louvres = [];
  for (let lx = x + 8; lx < x + width - 4; lx += 9) louvres.push(lx);
  return (
    <g className="gate__canopy">
      <rect className="gate__canopy-wood" x={x + 4} y={158} width={width - 8} height={18} />
      {louvres.map((lx) => (
        <rect key={lx} className="gate__louvre" x={lx} y={158} width={4} height={18} />
      ))}
      <rect className="gate__canopy-frame" x={x} y={134} width={width} height={26} />
      <rect className="gate__canopy-shadow" x={x} y={158} width={width} height={3} />
    </g>
  );
}

function Pylon({ side }: { side: 'left' | 'right' }) {
  const pts =
    side === 'left' ? '508,500 548,500 500,134 460,134' : '652,500 692,500 740,134 700,134';
  const shade =
    side === 'left' ? '538,500 548,500 500,134 490,134' : '652,500 662,500 710,134 700,134';
  return (
    <g className="gate__pylon">
      <polygon className="gate__pylon-face" points={pts} />
      <polygon className="gate__pylon-shade" points={shade} />
    </g>
  );
}

function Camera({ x, flip = false }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g className="gate__camera" transform={`translate(${x} 196) scale(${s} 1)`}>
      <rect className="gate__camera-mount" x={0} y={-2} width={4} height={10} />
      <rect className="gate__camera-body" x={4} y={0} width={20} height={9} rx={2} transform="rotate(14 4 4)" />
      <circle className="gate__camera-led" cx={21} cy={9} r={1.4} />
    </g>
  );
}

function Agave({ x }: { x: number }) {
  const leaves = [-62, -38, -16, 0, 16, 38, 62];
  return (
    <g className="gate__agave">
      {leaves.map((a) => (
        <path key={a} transform={`translate(${x} 468) rotate(${a})`} d="M-3 0 L0 -26 L3 0 Z" />
      ))}
    </g>
  );
}

function FeatureWall({ markId }: { markId: string }) {
  const slats = [];
  for (let sx = 556; sx < 646; sx += 7.5) slats.push(sx);
  return (
    <g className="gate__feature">
      <rect className="gate__feature-back" x={552} y={158} width={96} height={GROUND - 158} />
      {slats.map((sx) => (
        <rect key={sx} className="gate__feature-slat" x={sx} y={160} width={3.6} height={GROUND - 162} />
      ))}
      <rect className="gate__feature-cap" x={546} y={150} width={108} height={10} />
      <rect className="gate__plaque" x={560} y={198} width={80} height={104} rx={3} />
      <use href={`#${markId}`} x={580} y={208} width={40} height={40} className="gate__emblem" />
      <text className="gate__wordmark" x={600} y={272} textAnchor="middle">
        MADHUVAN
      </text>
      <text className="gate__wordmark-sub" x={600} y={287} textAnchor="middle">
        ENCLAVE
      </text>
    </g>
  );
}

export function GateIllustration({
  variant = 'color',
  framing = 'normal',
  className = '',
  title = 'Front elevation of the Madhuvan Enclave main gate',
}: {
  variant?: 'color' | 'blueprint';
  framing?: GateFraming;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const ids = {
    mark: `mark-${uid}`,
    glow: `glow-${uid}`,
    road: `road-${uid}`,
    lawn: `lawn-${uid}`,
    boom: `boom-${uid}`,
    bump: `bump-${uid}`,
  };

  return (
    <svg
      className={`gate gate--${variant} ${className}`}
      viewBox={VIEWBOX[framing]}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <symbol id={ids.mark} viewBox="0 0 100 100">
          <rect x="28" y="12" width="6.5" height="36" />
          <rect x="46.75" y="2" width="6.5" height="30" />
          <rect x="65.5" y="20" width="6.5" height="28" />
          <path d="M28 70V45.5L50 29.5l22 16V70h-6.5V48.8L50 37.6 34.5 48.8V70Z" />
          <rect x="45.5" y="57" width="9" height="9" />
          <path d="M50 99C38 98 21 92 10 74c13-3 30 1 40 25Z" />
          <path d="M50 99c12-1 29-7 40-25-13-3-30 1-40 25Z" />
        </symbol>
        <radialGradient id={ids.glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe3a3" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffd38a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffd38a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.road} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5f5a" />
          <stop offset="100%" stopColor="#3b3f3c" />
        </linearGradient>
        <linearGradient id={ids.lawn} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fb064" />
          <stop offset="100%" stopColor="#5b8f46" />
        </linearGradient>
        <pattern id={ids.boom} width="24" height="8" patternUnits="userSpaceOnUse">
          <rect width="12" height="8" fill="#d23c2f" />
          <rect x="12" width="12" height="8" fill="#ffffff" />
        </pattern>
        <pattern id={ids.bump} width="28" height="8" patternUnits="userSpaceOnUse">
          <rect width="14" height="8" fill="#f2c230" />
          <rect x="14" width="14" height="8" fill="#1f2320" />
        </pattern>
      </defs>

      {variant === 'color' && <circle className="gate__glow" cx="600" cy="250" r="300" fill={`url(#${ids.glow})`} />}

      <path className="gate__treeline" d={treeLine} />
      {/* In the hero framing the left side stays open sky for the headline. */}
      {framing !== 'hero' && (
        <>
          <Palm x={-650} height={210} lean={-8} />
          <Palm x={-420} height={240} lean={14} />
          <Palm x={-170} height={230} lean={12} />
          <Palm x={70} height={250} lean={-14} />
          <StreetLight x={-540} />
          <StreetLight x={-300} />
          <StreetLight x={-60} />
          <StreetLight x={150} />
        </>
      )}
      <Palm x={318} height={300} lean={10} scale={1.1} />
      <Palm x={880} height={290} lean={-12} scale={1.05} />
      <Palm x={1132} height={240} lean={16} />
      <Palm x={1380} height={220} lean={-10} />
      <StreetLight x={1050} flip />
      <StreetLight x={1262} flip />

      <BoundaryWall x0={SCENE_L} x1={214} />
      <BoundaryWall x0={986} x1={SCENE_R} />

      <Cabin x={215} />
      <Cabin x={895} flip />

      <Canopy x={214} width={276} />
      <Canopy x={710} width={276} />

      <FeatureWall markId={ids.mark} />
      <Pylon side="left" />
      <Pylon side="right" />
      <Camera x={500} />
      <Camera x={700} flip />

      {/* Boom barriers */}
      <g className="gate__boom">
        <rect className="gate__boom-base" x={306} y={452} width={13} height={42} rx={2} />
        <rect className="gate__boom-arm" x={318} y={456} width={186} height={6} fill={`url(#${ids.boom})`} />
        <rect className="gate__boom-base" x={881} y={452} width={13} height={42} rx={2} />
        <rect className="gate__boom-arm" x={696} y={456} width={186} height={6} fill={`url(#${ids.boom})`} />
      </g>

      {/* Planted median */}
      <g className="gate__median">
        <rect className="gate__kerb" x={518} y={486} width={164} height={16} rx={3} />
        <Agave x={566} />
        <Agave x={634} />
        <rect className="gate__hedge" x={524} y={462} width={152} height={28} rx={14} />
        <ellipse className="gate__hedge-light" cx={560} cy={470} rx={22} ry={5} />
        <ellipse className="gate__hedge-light" cx={630} cy={468} rx={18} ry={4} />
      </g>

      {/* Ground */}
      <rect className="gate__road" x={SCENE_L} y={GROUND} width={SCENE_R - SCENE_L} height={100} fill={`url(#${ids.road})`} />
      <rect className="gate__lawn" x={SCENE_L} y={GROUND} width={206 - SCENE_L} height={100} fill={`url(#${ids.lawn})`} />
      <rect className="gate__lawn" x={994} y={GROUND} width={SCENE_R - 994} height={100} fill={`url(#${ids.lawn})`} />
      <rect className="gate__kerbline" x={SCENE_L} y={GROUND} width={SCENE_R - SCENE_L} height={5} />
      <rect className="gate__bump" x={226} y={528} width={284} height={8} fill={`url(#${ids.bump})`} />
      <rect className="gate__bump" x={690} y={528} width={284} height={8} fill={`url(#${ids.bump})`} />
      <path className="gate__lane" d="M600 506 L600 600" />
    </svg>
  );
}
