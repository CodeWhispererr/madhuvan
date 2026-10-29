import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Box, Map as MapIcon, Moon, Pause, Play, Search, Sunrise, Sunset } from 'lucide-react';
import { viewBox, type PlotSize } from '../../data/layout';
import { STATUS_IS_SAMPLE, statusLabel, type PlotStatus } from '../../data/plotStatus';
import { SHORT, countByStatus, directionName, directionShort, fmt, plotByNo, plotInfos, type PlotInfo } from '../../lib/plots';
import { MONTHS, dayOfYear, formatClock, sunPosition, sunTimes } from '../../lib/sun';
import { PlotPanel, Stars } from './PlotPanel';
import { SiteMap } from './SiteMap';
import { SUN_RAMP_CSS, sizeFill, statusFill, type MapMode } from './mapStyle';
import './explorer.css';

// three.js is only downloaded when someone opens the 3D view.
const Site3D = lazy(() => import('./Site3D'));

const SIZE_OPTIONS: { value: PlotSize; label: string }[] = [
  { value: '9x18', label: '9 × 18 m' },
  { value: '7.5x15', label: '7.5 × 15 m' },
  { value: '7.5x12', label: '7.5 × 12 m' },
];
const STATUSES: PlotStatus[] = ['available', 'booked', 'sold'];
const FACINGS = Array.from(new Set(plotInfos.flatMap((p) => p.bearings.map(directionShort)))).sort(
  (a, b) => SHORT.indexOf(a) - SHORT.indexOf(b),
);
const MODES: { value: MapMode; label: string }[] = [
  { value: 'availability', label: 'Availability' },
  { value: 'size', label: 'Plot sizes' },
  { value: 'sunlight', label: 'Sunlight' },
];

interface HoverState {
  no: number;
  x: number;
  y: number;
  /** Canvas width, used to flip the tooltip near the right edge. */
  w: number;
}

export function PlotExplorer() {
  const [view, setView] = useState<'2d' | '3d'>('2d');
  const [mode, setMode] = useState<MapMode>('availability');
  const [statuses, setStatuses] = useState<Set<PlotStatus>>(() => new Set(STATUSES));
  const [size, setSize] = useState<PlotSize | 'all'>('all');
  const [facing, setFacing] = useState<string>('all');
  const [hover, setHover] = useState<HoverState | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [hour, setHour] = useState(10);
  const [playing, setPlaying] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const matches = useCallback(
    (p: PlotInfo) =>
      statuses.has(p.status) &&
      (size === 'all' || p.size === size) &&
      (facing === 'all' || p.bearings.some((b) => directionShort(b) === facing)),
    [statuses, size, facing],
  );
  const matching = useMemo(() => plotInfos.filter(matches), [matches]);
  const counts = useMemo(() => countByStatus(), []);

  const doy = dayOfYear(month);
  const times = useMemo(() => sunTimes(doy), [doy]);
  const sun = useMemo(() => (mode === 'sunlight' ? sunPosition(doy, hour) : null), [mode, doy, hour]);

  // "Play the day": sweep the clock from dawn to dusk and loop.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      setHour((h) => (h >= 19.5 ? 5.5 : h + 0.04));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    if (!hover) return;
    const clear = () => setHover(null);
    window.addEventListener('scroll', clear, { passive: true });
    return () => window.removeEventListener('scroll', clear);
  }, [hover]);

  const handleHover = useCallback((no: number | null, e?: PointerEvent) => {
    if (no === null) return setHover(null);
    if (e?.pointerType === 'touch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (e) {
      setHover({ no, x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width });
    } else {
      const p = plotByNo.get(no);
      if (!p) return;
      setHover({
        no,
        x: ((p.centroid[0] - viewBox.x) / viewBox.w) * rect.width,
        y: ((p.centroid[1] - viewBox.y) / viewBox.h) * rect.height,
        w: rect.width,
      });
    }
  }, []);

  const select = useCallback((no: number) => {
    setSelected((cur) => (cur === no ? null : no));
    if (window.matchMedia('(max-width: 960px)').matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, []);

  const toggleStatus = (s: PlotStatus) =>
    setStatuses((cur) => {
      const next = new Set(cur);
      if (next.has(s) && next.size > 1) next.delete(s);
      else next.add(s);
      return next;
    });

  const submitSearch = () => {
    const no = Number(query.trim());
    if (plotByNo.has(no)) {
      setSelected(no);
      setQuery('');
    }
  };

  const hovered = hover ? plotByNo.get(hover.no) : undefined;
  const selectedPlot = selected !== null ? plotByNo.get(selected) : undefined;

  return (
    <div className="explorer">
      <div className="explorer__bar" role="toolbar" aria-label="Map view and filters">
        <div className="explorer__switches">
          <div className="segmented" role="tablist" aria-label="View">
            <button type="button" role="tab" aria-selected={view === '2d'} className={view === '2d' ? 'is-active' : ''} onClick={() => setView('2d')}>
              <MapIcon size={15} /> 2D plan
            </button>
            <button type="button" role="tab" aria-selected={view === '3d'} className={view === '3d' ? 'is-active' : ''} onClick={() => setView('3d')}>
              <Box size={15} /> 3D view
            </button>
          </div>
          <div className="segmented segmented--light" role="tablist" aria-label="Colour plots by">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                role="tab"
                aria-selected={mode === m.value}
                className={mode === m.value ? 'is-active' : ''}
                onClick={() => {
                  setMode(m.value);
                  if (m.value !== 'sunlight') setPlaying(false);
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="explorer__filters">
          <div className="chips" aria-label="Filter by status">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${statuses.has(s) ? 'is-on' : ''}`}
                aria-pressed={statuses.has(s)}
                onClick={() => toggleStatus(s)}
              >
                <i className={`dot dot--${s}`} />
                {statusLabel[s]} <span className="chip__count">{counts[s]}</span>
              </button>
            ))}
          </div>
          <label className="select">
            <span className="visually-hidden">Plot size</span>
            <select value={size} onChange={(e) => setSize(e.target.value as PlotSize | 'all')}>
              <option value="all">All sizes</option>
              {SIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="select">
            <span className="visually-hidden">Facing</span>
            <select value={facing} onChange={(e) => setFacing(e.target.value)}>
              <option value="all">Any facing</option>
              {FACINGS.map((f) => (
                <option key={f} value={f}>
                  {directionName(SHORT.indexOf(f) * 22.5)} ({f}) facing
                </option>
              ))}
            </select>
          </label>
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <Search size={16} />
            <input
              inputMode="numeric"
              placeholder="Plot no."
              aria-label="Go to plot number"
              value={query}
              onChange={(e) => setQuery(e.target.value.replace(/\D/g, '').slice(0, 3))}
            />
          </form>
        </div>
      </div>

      {mode === 'sunlight' && (
        <div className="sunbar">
          <div className="sunbar__months" role="radiogroup" aria-label="Month">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={month === i}
                className={month === i ? 'is-active' : ''}
                onClick={() => setMonth(i)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="sunbar__time">
            <button
              type="button"
              className="sunbar__play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause the day' : 'Play the day'}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <input
              type="range"
              min={5.5}
              max={19.5}
              step={0.25}
              value={hour}
              onChange={(e) => {
                setPlaying(false);
                setHour(Number(e.target.value));
              }}
              aria-label="Time of day"
            />
            <output className="sunbar__clock">{formatClock(hour)}</output>
          </div>
          <p className="sunbar__readout">
            <span>
              <Sunrise size={15} /> {formatClock(times.sunrise)}
            </span>
            <span>
              <Sunset size={15} /> {formatClock(times.sunset)}
            </span>
            {sun && sun.elevation > 0 ? (
              <span>
                Sun in the {directionName(sun.azimuth)}, {fmt(sun.elevation)}° above the horizon
              </span>
            ) : (
              <span>
                <Moon size={15} /> After dark — solar street lights on
              </span>
            )}
          </p>
        </div>
      )}

      <div className="explorer__layout">
        <div className="explorer__frame">
          <p className="explorer__swipe" aria-hidden="true">
            {view === '2d' ? 'Swipe sideways to see the whole layout · tap a plot for details' : 'Drag to rotate · pinch or scroll to zoom'}
          </p>
          {view === '2d' ? (
            <div className="explorer__scroll">
              <div className="explorer__canvas" ref={canvasRef}>
                <SiteMap
                  plots={plotInfos}
                  mode={mode}
                  sun={sun}
                  matches={matches}
                  hovered={hover?.no ?? null}
                  selected={selected}
                  onHover={handleHover}
                  onSelect={select}
                />
                {hovered && hover && (
                  <div
                    className={`tooltip ${hover.x > hover.w - 280 ? 'tooltip--left' : ''} ${hover.y < 160 ? 'tooltip--below' : ''}`}
                    style={{ left: hover.x, top: hover.y }}
                    role="status"
                  >
                    <div className="tooltip__head">
                      <strong>Plot {hovered.no}</strong>
                      <span className={`pill pill--${hovered.status}`}>{statusLabel[hovered.status]}</span>
                    </div>
                    <dl>
                      <dt>Size</dt>
                      <dd>{hovered.sizeLabel}</dd>
                      <dt>Area</dt>
                      <dd>
                        {fmt(hovered.areaSqft)} sq ft · {fmt(hovered.areaGaj)} gaj
                      </dd>
                      <dt>Facing</dt>
                      <dd>
                        {hovered.facing} · {hovered.bearing}°
                      </dd>
                      <dt>Sunlight</dt>
                      <dd className="tooltip__sun">
                        <Stars value={hovered.sun.rating} /> {hovered.sun.annual.toFixed(1)} h/day
                      </dd>
                    </dl>
                    {(hovered.corner || hovered.parkFacing) && (
                      <p className="tooltip__tags">
                        {[hovered.corner && 'Corner plot', hovered.parkFacing && 'Park-facing'].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="tooltip__hint">Click for full details</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="explorer__3d">
              <Suspense fallback={<div className="explorer__loading">Loading 3D view…</div>}>
                <Site3D mode={mode} matches={matches} selected={selected} onSelect={select} />
              </Suspense>
            </div>
          )}
          <p className="explorer__note">
            {STATUS_IS_SAMPLE
              ? 'Availability shown is a preview sample — please confirm the latest status with us.'
              : 'We update availability regularly — please confirm with us before booking.'}{' '}
            Layout redrawn from the approved plan; not to scale for registry purposes.
          </p>
        </div>

        <aside className="explorer__panel" ref={panelRef} aria-live="polite">
          {selectedPlot ? (
            <PlotPanel plot={selectedPlot} onClose={() => setSelected(null)} />
          ) : (
            <SummaryPanel mode={mode} matchingCount={matching.length} />
          )}
        </aside>
      </div>
    </div>
  );
}

function SummaryPanel({ mode, matchingCount }: { mode: MapMode; matchingCount: number }) {
  const counts = countByStatus();
  const total = plotInfos.length;

  return (
    <div className="panel">
      <span className="panel__kicker">
        {matchingCount === total ? `All ${total} plots` : `${matchingCount} of ${total} plots match`}
      </span>

      {mode === 'availability' ? (
        <>
          <h3 className="panel__title">
            Availability
          </h3>
          <ul className="legend">
            {STATUSES.map((s) => (
              <li key={s}>
                <i className={`legend__swatch legend__swatch--${s}`} style={{ background: statusFill[s] }} />
                <span>{statusLabel[s]}</span>
                <strong>{counts[s]}</strong>
                <span className="legend__bar">
                  <span style={{ width: `${(counts[s] / total) * 100}%`, background: statusFill[s] }} />
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : mode === 'size' ? (
        <>
          <h3 className="panel__title">
            Plot sizes
          </h3>
          <ul className="legend">
            {SIZE_OPTIONS.map((o) => {
              const list = plotInfos.filter((p) => p.size === o.value && !p.irregular);
              const count = plotInfos.filter((p) => p.size === o.value).length;
              return (
                <li key={o.value}>
                  <i className="legend__swatch" style={{ background: sizeFill[o.value] }} />
                  <span>
                    {o.label}
                    <small>
                      {fmt(list[0]?.areaSqft ?? 0)} sq ft · {fmt(list[0]?.areaGaj ?? 0)} gaj
                    </small>
                  </span>
                  <strong>{count}</strong>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <h3 className="panel__title">
            Sunlight on the front
          </h3>
          <div className="ramp" style={{ background: SUN_RAMP_CSS }} />
          <div className="ramp__labels">
            <span>In shade</span>
            <span>Glancing sun</span>
            <span>Full sun</span>
          </div>
          <p className="panel__text">
            Colours show how directly the sun strikes the front of each plot at the chosen month and time, calculated
            for Hardoi (27.4° N) from the plot bearings measured on site. Press play to watch a whole day.
          </p>
        </>
      )}

      <div className="panel__how">
        <p>
          <strong>Hover</strong> a plot for a quick look, <strong>click</strong> to pin its details — size in sq ft and
          gaj, facing and a one-tap enquiry.
        </p>
        <Link className="link-arrow" to="/contact">
          Prefer to talk? Book a site visit <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
