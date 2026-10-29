import { Link } from 'react-router';
import { ArrowRight, Compass, MessageCircle, Ruler, Star, Trees, X } from 'lucide-react';
import { statusLabel } from '../../data/plotStatus';
import { site, waHref } from '../../data/site';
import { fmt, type PlotInfo } from '../../lib/plots';
import { SunBars } from './SunBars';
import { SEASONS, SunPath } from './SunPath';

export function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={15} strokeWidth={1.8} className={i < value ? 'is-on' : ''} />
      ))}
    </span>
  );
}

export function PlotPanel({ plot, onClose }: { plot: PlotInfo; onClose: () => void }) {
  const enquiryText = `Namaste, I'm interested in Plot ${plot.no} (${plot.sizeLabel}, ${plot.facing} facing) at ${site.name}. Please share details.`;

  return (
    <div className="panel panel--plot">
      <div className="panel__head">
        <div>
          <span className="panel__kicker">Plot</span>
          <h3 className="panel__plot-no">{plot.no}</h3>
        </div>
        <span className={`pill pill--${plot.status}`}>
          {statusLabel[plot.status]}
        </span>
        <button type="button" className="panel__close" onClick={onClose} aria-label="Close plot details">
          <X size={18} />
        </button>
      </div>

      <dl className="panel__facts">
        <div>
          <dt>
            <Ruler size={14} /> Size
          </dt>
          <dd>{plot.sizeLabel}</dd>
        </div>
        <div>
          <dt>Area</dt>
          <dd>
            {fmt(plot.areaSqft)} sq ft · {fmt(plot.areaGaj)} gaj
            <span className="panel__muted"> ({fmt(plot.areaM2)} m²)</span>
          </dd>
        </div>
        <div>
          <dt>
            <Compass size={14} /> Facing
          </dt>
          <dd>
            {plot.facing} · {plot.bearing}°
          </dd>
        </div>
        <div>
          <dt>Road</dt>
          <dd>{plot.road}</dd>
        </div>
      </dl>

      {(plot.corner || plot.parkFacing) && (
        <div className="panel__tags">
          {plot.corner && <span className="tag">Corner plot</span>}
          {plot.parkFacing && (
            <span className="tag">
              <Trees size={13} /> Park-facing
            </span>
          )}
        </div>
      )}

      <div className="panel__sun">
        <div className="panel__sun-head">
          <span>
            Sunlight on the front
          </span>
          <Stars value={plot.sun.rating} />
        </div>
        <SunBars monthly={plot.sun.monthly} annual={plot.sun.annual} />
        <div className="panel__sunpath">
          <SunPath bearings={plot.bearings} />
          <ul className="panel__sunpath-legend">
            {SEASONS.map((s) => (
              <li key={s.cls}>
                <i className={`swatch swatch--${s.cls}`} />
                {s.label}
              </li>
            ))}
            <li>
              <i className="swatch swatch--front" />
              Sky in front of the plot
            </li>
          </ul>
        </div>
        <p className="panel__note">{plot.sunNote}</p>
      </div>

      <div className="panel__actions">
        <Link className="btn" to={`/contact?plot=${plot.no}`}>
          Enquire about plot {plot.no} <ArrowRight size={17} />
        </Link>
        <a className="btn btn--ghost" href={waHref(site.primaryPhone, enquiryText)} target="_blank" rel="noreferrer">
          <MessageCircle size={17} /> WhatsApp
        </a>
      </div>
    </div>
  );
}
