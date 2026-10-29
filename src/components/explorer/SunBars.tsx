import { useState } from 'react';
import { MONTHS } from '../../lib/sun';

const W = 240;
const H = 76;
const MAX_HOURS = 13;
const GAP = 2;

/** Monthly hours of direct sun on the plot's front — one series, so no legend; hover a bar for its value. */
export function SunBars({ monthly, annual }: { monthly: number[]; annual: number }) {
  const [active, setActive] = useState<number | null>(null);
  const barW = (W - GAP * 11) / 12;

  return (
    <div className="sunbars">
      <svg viewBox={`0 0 ${W} ${H + 14}`} role="img" aria-label="Hours of direct sun on the front of this plot, by month">
        <line className="sunbars__base" x1={0} y1={H} x2={W} y2={H} />
        {monthly.map((h, i) => {
          const bh = Math.max(2, (h / MAX_HOURS) * (H - 4));
          const x = i * (barW + GAP);
          const y = H - bh;
          const r = Math.min(3, barW / 2);
          return (
            <g
              key={MONTHS[i]}
              className={`sunbars__bar ${active === i ? 'is-active' : ''}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
            >
              <rect className="sunbars__hit" x={x - GAP / 2} y={0} width={barW + GAP} height={H + 14} />
              <path d={`M${x} ${H} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + barW - r} Q${x + barW} ${y} ${x + barW} ${y + r} V${H} Z`} />
              <text x={x + barW / 2} y={H + 10} textAnchor="middle">
                {MONTHS[i][0]}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="sunbars__readout" aria-live="polite">
        {active === null ? (
          <>
            <strong>{annual.toFixed(1)} h</strong> of direct sun a day, averaged over the year · hover a month
          </>
        ) : (
          <>
            <strong>{monthly[active].toFixed(1)} h</strong> on {MONTHS[active]} 21
          </>
        )}
      </p>
    </div>
  );
}
