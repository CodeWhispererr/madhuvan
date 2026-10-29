import { useMemo } from 'react';
import { directionShort } from '../../lib/plots';
import { dayOfYear, sunPosition, sunTimes } from '../../lib/sun';

const SIZE = 220;
const C = SIZE / 2;
const R = 82;

export const SEASONS = [
  { month: 5, label: 'Jun 21', cls: 'summer' },
  { month: 2, label: 'Mar / Sep', cls: 'equinox' },
  { month: 11, label: 'Dec 21', cls: 'winter' },
];

function project(azimuth: number, elevation: number) {
  const r = (R * (90 - elevation)) / 90;
  const a = (azimuth * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)] as const;
}

function halfDisk(bearing: number) {
  const [x1, y1] = project(bearing - 90, 0);
  const [x2, y2] = project(bearing + 90, 0);
  return `M${C} ${C} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} Z`;
}

/** Sun-path diagram for Hardoi (north up) with the half of the sky in front of the plot highlighted. */
export function SunPath({ bearings }: { bearings: number[] }) {
  const paths = useMemo(
    () =>
      SEASONS.map((s) => {
        const doy = dayOfYear(s.month);
        const { sunrise, sunset } = sunTimes(doy);
        const pts: string[] = [];
        let noon: readonly [number, number] = [C, C];
        let maxEl = -1;
        for (let t = sunrise; t <= sunset + 0.01; t += 0.2) {
          const p = sunPosition(doy, t);
          if (p.elevation < 0) continue;
          const xy = project(p.azimuth, p.elevation);
          pts.push(`${xy[0].toFixed(1)},${xy[1].toFixed(1)}`);
          if (p.elevation > maxEl) {
            maxEl = p.elevation;
            noon = xy;
          }
        }
        return { ...s, d: `M${pts.join(' L')}`, noon };
      }),
    [],
  );

  return (
    <svg className="sunpath" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Sun path over Hardoi through the year">
      {bearings.map((b) => (
        <path key={b} className="sunpath__front" d={halfDisk(b)} />
      ))}
      {[90, 60, 30].map((el) => (
        <circle key={el} className="sunpath__ring" cx={C} cy={C} r={(R * (90 - el)) / 90} />
      ))}
      {[0, 90, 180, 270].map((b) => {
        const [x, y] = project(b, -12);
        return (
          <text key={b} className="sunpath__cardinal" x={x} y={y} textAnchor="middle" dominantBaseline="central">
            {directionShort(b)}
          </text>
        );
      })}
      {paths.map((p) => (
        <g key={p.cls} className={`sunpath__season sunpath__season--${p.cls}`}>
          <path d={p.d} />
          <circle cx={p.noon[0]} cy={p.noon[1]} r={3.2} />
        </g>
      ))}
      {bearings.map((b) => {
        const [x, y] = project(b, 34);
        return (
          <g key={b}>
            <line className="sunpath__arrow" x1={C} y1={C} x2={x} y2={y} />
            <circle className="sunpath__arrow-head" cx={x} cy={y} r={2.6} />
          </g>
        );
      })}
      <rect className="sunpath__house" x={C - 6} y={C - 6} width={12} height={12} rx={2} />
    </svg>
  );
}
