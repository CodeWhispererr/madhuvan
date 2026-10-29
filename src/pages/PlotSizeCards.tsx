import { Reveal } from '../components/Reveal';
import { sizeFill } from '../components/explorer/mapStyle';
import type { PlotSize } from '../data/layout';
import { fmt, plotInfos } from '../lib/plots';

const SIZES: { size: PlotSize; dims: string; note: string }[] = [
  { size: '9x18', dims: '9 × 18 m', note: 'Larger plots on the 12 m road and RTO Road — room for a spacious family home.' },
  { size: '7.5x15', dims: '7.5 × 15 m', note: 'The most popular size, on 9 m and 7.5 m roads, many facing the parks.' },
  { size: '7.5x12', dims: '7.5 × 12 m', note: 'Compact plots beside the central park — an easy first step to owning land.' },
];

export function PlotSizeCards() {
  return (
    <div className="size-cards">
      {SIZES.map((s, i) => {
        const all = plotInfos.filter((p) => p.size === s.size);
        const regular = all.find((p) => !p.irregular)!;
        return (
          <Reveal key={s.size} delay={i * 90} className="card card--hover size-card">
            <span className="size-card__swatch" style={{ background: sizeFill[s.size] }} />
            <div className="size-card__dims">{s.dims}</div>
            <p className="size-card__area">
              {fmt(regular.areaSqft)} sq ft · {fmt(regular.areaGaj)} gaj
            </p>
            <span className="size-card__count">{all.length} plots</span>
            <p>{s.note}</p>
          </Reveal>
        );
      })}
    </div>
  );
}
