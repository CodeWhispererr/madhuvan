import { Compass, CornerDownRight, Trees } from 'lucide-react';
import { PlotExplorer } from '../components/explorer/PlotExplorer';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { plotInfos } from '../lib/plots';
import { PlotSizeCards } from './PlotSizeCards';
import './pages.css';

const tips = [
  {
    icon: Compass,
    en: 'Facing',
    text: 'The direction a plot’s road side looks towards, set from compass readings taken on site (plot 78 faces 203°, plot 61 faces 310°). The main gate is on the north side.',
  },
  {
    icon: CornerDownRight,
    en: 'Corner plots',
    text: 'Plots with two road frontages, or with a side shaped by the 12 m road — more light, air and access.',
  },
  {
    icon: Trees,
    en: 'Park-facing',
    text: 'Plots that look across the road onto one of the two parks.',
  },
];

export function Plots() {
  return (
    <>
      <PageHeader
        crumb="Plot map & sizes"
        eyebrow="Master plan"
        title={
          <>
            All {plotInfos.length} plots, <em>live.</em>
          </>
        }
        lede="Tap any plot for its availability, size, facing and sunlight. Switch to 3D to walk around the layout."
      />

      <section className="section section--tint">
        <div className="container">
          <PlotExplorer />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Plot sizes"
            title={
              <>
                Choose the size <em>that fits.</em>
              </>
            }
          />
          <PlotSizeCards />

          <ul className="card-grid" style={{ marginTop: 40 }}>
            {tips.map(({ icon: Icon, en, text }, i) => (
              <Reveal as="li" key={en} delay={i * 80} className="card value-card">
                <span className="icon-chip">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <h3>{en}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
