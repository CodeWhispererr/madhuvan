import { memo, useMemo, type MouseEvent, type PointerEvent } from 'react';
import {
  PLAN_UP_BEARING,
  avenueTrees,
  boundary,
  gate,
  parks,
  roads,
  streetLights,
  viewBox,
  type Pt,
} from '../../data/layout';
import { centroid, toPoints, type PlotInfo } from '../../lib/plots';
import { facadeIncidence, type SunPosition } from '../../lib/sun';
import { NIGHT_FILL, sizeFill, statusFill, statusInk, sunFill, type MapMode } from './mapStyle';

interface SiteMapProps {
  plots: PlotInfo[];
  mode: MapMode;
  /** Sun position for the sunlight view; null after dark. */
  sun?: SunPosition | null;
  matches?: (p: PlotInfo) => boolean;
  hovered?: number | null;
  selected?: number | null;
  onHover?: (no: number | null, e?: PointerEvent) => void;
  onSelect?: (no: number) => void;
  /** Static preview without hover or keyboard focus. */
  preview?: boolean;
}

/** Trees planted around a park's edge, nudged inwards towards its centre. */
function perimeterTrees(poly: readonly Pt[], spacing = 6.5, inset = 2.6): Pt[] {
  const [cx, cy] = centroid(poly);
  const out: Pt[] = [];
  poly.forEach(([x1, y1], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.floor(len / spacing);
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      const d = Math.hypot(cx - px, cy - py) || 1;
      out.push([px + ((cx - px) / d) * inset, py + ((cy - py) / d) * inset]);
    }
  });
  return out;
}

const parkTrees = parks.map((p) => perimeterTrees(p.polygon));
const boundaryPoints = toPoints(boundary);
const vb = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
const all = () => true;

function plotFill(p: PlotInfo, mode: MapMode, sun: SunPosition | null | undefined) {
  if (mode === 'availability') return statusFill[p.status];
  if (mode === 'size') return sizeFill[p.size];
  if (!sun || sun.elevation <= 0) return NIGHT_FILL;
  return sunFill(Math.max(...p.bearings.map((b) => facadeIncidence(sun, b))));
}

function plotInk(p: PlotInfo, mode: MapMode, sun: SunPosition | null | undefined) {
  if (mode === 'availability') return statusInk[p.status];
  if (mode === 'size') return '#ffffff';
  return sun && sun.elevation > 0 ? '#2a2418' : '#c9d4dc';
}

/** The sun, drawn on the map's edge in the direction it shines from. */
function SunMarker({ sun }: { sun: SunPosition }) {
  const cx = viewBox.x + viewBox.w / 2;
  const cy = viewBox.y + viewBox.h / 2;
  const angle = ((sun.azimuth - PLAN_UP_BEARING) * Math.PI) / 180;
  const x = cx + Math.sin(angle) * (viewBox.w / 2 - 13);
  const y = cy - Math.cos(angle) * (viewBox.h / 2 - 13);
  const below = sun.elevation <= 0;
  return (
    <g className={`map__sun ${below ? 'map__sun--set' : ''}`} transform={`translate(${x} ${y})`}>
      {!below &&
        Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={0} y1={-9.5} x2={0} y2={-13} transform={`rotate(${i * 45})`} />
        ))}
      <circle r={7.5} />
    </g>
  );
}

function Compass() {
  return (
    <g className="map__compass" transform={`translate(${viewBox.x + 24} ${viewBox.y + 22})`}>
      <circle r={12} />
      <g transform={`rotate(${-PLAN_UP_BEARING})`}>
        <path d="M0 -9 L3.2 1 L0 -1 L-3.2 1 Z" className="map__compass-n" />
        <path d="M0 9 L3.2 -1 L0 1 L-3.2 -1 Z" className="map__compass-s" />
        <text y={-14.5} textAnchor="middle">
          N
        </text>
      </g>
    </g>
  );
}

function ScaleBar() {
  return (
    <g className="map__scale" transform="translate(60 196)">
      <rect x={0} y={0} width={20} height={2.4} className="map__scale-a" />
      <rect x={20} y={0} width={20} height={2.4} className="map__scale-b" />
      <text x={0} y={-2.2}>0</text>
      <text x={20} y={-2.2} textAnchor="middle">
        20
      </text>
      <text x={40} y={-2.2} textAnchor="middle">
        40 m
      </text>
    </g>
  );
}

export const SiteMap = memo(function SiteMap({
  plots,
  mode,
  sun = null,
  matches = all,
  hovered = null,
  selected = null,
  onHover,
  onSelect,
  preview = false,
}: SiteMapProps) {
  const filtered = useMemo(() => new Set(plots.filter(matches).map((p) => p.no)), [plots, matches]);
  const night = mode === 'sunlight' && (!sun || sun.elevation <= 0);

  const plotFromEvent = (e: PointerEvent | MouseEvent) => {
    const el = (e.target as Element).closest('[data-plot]');
    return el ? Number(el.getAttribute('data-plot')) : null;
  };

  return (
    <svg
      className={`map map--${mode} ${night ? 'map--night' : ''} ${preview ? 'map--preview' : ''}`}
      viewBox={vb}
      role={preview ? 'img' : 'group'}
      aria-label="Layout plan of Madhuvan Enclave"
      onPointerMove={preview ? undefined : (e) => onHover?.(plotFromEvent(e), e)}
      onPointerLeave={preview ? undefined : () => onHover?.(null)}
      onClick={
        preview
          ? undefined
          : (e) => {
              const no = plotFromEvent(e);
              if (no !== null) onSelect?.(no);
            }
      }
    >
      <defs>
        <pattern id="map-hatch" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="0.7" height="2.4" fill="rgba(255,255,255,0.45)" />
        </pattern>
        <radialGradient id="map-light">
          <stop offset="0" stopColor="#fff2b8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffd56b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect className="map__paper" x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} />
      <polygon className="map__site" points={boundaryPoints} />

      {roads.map((r) => (
        <polygon key={r.id} className={r.main ? 'map__road map__road--main' : 'map__road'} points={toPoints(r.polygon)} />
      ))}

      {parks.map((park, i) => (
        <g key={park.id} className="map__park">
          <polygon points={toPoints(park.polygon)} />
          {park.track && (
            <ellipse className="map__track" cx={park.track.cx} cy={park.track.cy} rx={park.track.rx} ry={park.track.ry} />
          )}
          {parkTrees[i].map(([x, y], k) => (
            <circle key={k} className="map__tree" cx={x} cy={y} r={k % 3 === 0 ? 2.3 : 1.8} />
          ))}
          {park.features.map((f) => (
            <g key={f.label} transform={`translate(${f.at[0]} ${f.at[1]})`} className="map__feature">
              <circle r={2.4} />
              <text y={5.6} textAnchor="middle">
                {f.label}
              </text>
            </g>
          ))}
          <text className="map__park-label" x={park.labelAt[0]} y={park.labelAt[1]} textAnchor="middle">
            {park.name}
          </text>
          {park.area && (
            <text className="map__park-area" x={park.labelAt[0]} y={park.labelAt[1] + 4.6} textAnchor="middle">
              {park.area}
            </text>
          )}
        </g>
      ))}

      {avenueTrees.map(([x, y], i) => (
        <circle key={i} className="map__tree map__tree--avenue" cx={x} cy={y} r={1.5} />
      ))}

      {roads.flatMap((r) =>
        (r.labels ?? []).map((l) => (
          <text
            key={`${r.id}-${l.text}-${l.at[0]}`}
            className={r.main ? 'map__road-label map__road-label--main' : 'map__road-label'}
            transform={`translate(${l.at[0]} ${l.at[1]}) rotate(${l.angle})`}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {l.text}
          </text>
        )),
      )}

      <g className="map__plots">
        {plots.map((p) => {
          const dim = !filtered.has(p.no);
          const cls = ['map__plot', dim && 'is-dim', hovered === p.no && 'is-hovered', selected === p.no && 'is-selected']
            .filter(Boolean)
            .join(' ');
          return (
            <g
              key={p.no}
              className={cls}
              data-plot={p.no}
              tabIndex={preview || dim ? -1 : 0}
              role={preview ? undefined : 'button'}
              aria-label={preview ? undefined : `Plot ${p.no}, ${p.status}, ${p.sizeLabel}, facing ${p.facing}`}
              onKeyDown={
                preview
                  ? undefined
                  : (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect?.(p.no);
                      }
                    }
              }
              onFocus={preview ? undefined : () => onHover?.(p.no)}
              onBlur={preview ? undefined : () => onHover?.(null)}
            >
              <polygon points={p.points} fill={plotFill(p, mode, sun)} />
              {mode === 'availability' && p.status === 'sold' && (
                <polygon points={p.points} fill="url(#map-hatch)" className="map__hatch" />
              )}
              <text x={p.centroid[0]} y={p.centroid[1]} textAnchor="middle" dominantBaseline="central" fill={plotInk(p, mode, sun)}>
                {p.no}
              </text>
            </g>
          );
        })}
      </g>

      {night &&
        streetLights.map(([x, y], i) => (
          <circle key={i} className="map__glow" cx={x} cy={y} r={7} fill="url(#map-light)" />
        ))}
      {streetLights.map(([x, y], i) => (
        <circle key={i} className="map__light" cx={x} cy={y} r={0.9} />
      ))}

      <g className="map__gate" transform={`translate(${gate.at[0]} ${gate.at[1]})`}>
        <path d="M-6.5 -1 L-4 -9 L-2 -9 L-4 -1 Z M6.5 -1 L4 -9 L2 -9 L4 -1 Z" />
        <rect x={-1.4} y={-8} width={2.8} height={7} />
      </g>
      <g className="map__gate-label" transform={`translate(${gate.labelAt[0]} ${gate.labelAt[1]})`}>
        <rect x={-15} y={-4.2} width={30} height={8.4} rx={4.2} />
        <text textAnchor="middle" dominantBaseline="central">
          MAIN GATE
        </text>
      </g>

      <Compass />
      <ScaleBar />
      {mode === 'sunlight' && sun && <SunMarker sun={sun} />}
    </svg>
  );
});
