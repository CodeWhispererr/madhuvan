import { Link } from 'react-router';
import { ArrowRight, Eye, HeartHandshake, Leaf, ShieldCheck } from 'lucide-react';
import { GateShowcase } from '../components/GateShowcase';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { site } from '../data/site';
import { plotInfos } from '../lib/plots';
import { PlotSizeCards } from './PlotSizeCards';
import './pages.css';

const facts = [
  ['Project', site.name],
  ['Location', `${site.address.line1}, ${site.address.city}`],
  ['Landmark', 'Opposite Anand Adhiyaan Hospital'],
  ['Type', 'Residential plotted development'],
  ['Total plots', `${plotInfos.length}`],
  ['Plot sizes', '9 × 18 m · 7.5 × 15 m · 7.5 × 12 m'],
  ['Roads', '12 m main road · 9 m & 7.5 m internal roads'],
  ['Open spaces', 'Central park (3,162.42 m²) + a second park'],
  ['Layout', 'Government approved'],
  ['Home loans', `${site.bank.name}, ${site.bank.zone}`],
];

const values = [
  { icon: Eye, en: 'Transparency', text: 'Every approval, title paper and buyer document published in our Trust Center — before you pay.' },
  { icon: ShieldCheck, en: 'Security', text: 'A gated community with one controlled entrance, guards and CCTV around the clock.' },
  { icon: Leaf, en: 'Green living', text: 'Two parks, an avenue of trees, a jogging path and solar-powered street lights.' },
  { icon: HeartHandshake, en: 'Community', text: 'A neighbourhood planned for families — safe roads, play areas and open spaces.' },
];

export function About() {
  return (
    <>
      <PageHeader
        crumb="About the project"
        eyebrow="About the project"
        title={
          <>
            Better planning, <em>a better address.</em>
          </>
        }
        titleHi={site.promiseHindi}
        lede="Our government-approved layout of 149 plots on RTO Road, Hardoi — for families who want land with clear papers, wide roads and green, secure surroundings."
      />

      <section className="section">
        <div className="container two-col">
          <div>
            <SectionHeading
              eyebrow="Overview"
              title={
                <>
                  Jahan zameen hai <em>‘Sona’.</em>
                </>
              }
            />
            <Reveal className="prose">
              <p>
                We are just off RTO Road near Lucknow Chungi, right opposite Anand Adhiyaan Hospital, with the RTO office,
                a mall and a petrol pump close by. A 12 m wide road runs in from our main gate, and every plot opens onto a
                paved internal road.
              </p>
              <p>
                We offer three plot sizes — from 969 sq ft (108 gaj) to 1,744 sq ft (194 gaj) — so you can choose what
                fits your plans and budget. Underground drainage, water supply and solar street lighting are
                part of our plan, along with a 3,162 m² central park and a second park for children.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <dl className="fact-table">
              <div className="fact-table__head">
                Project at a glance
              </div>
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Our values"
            title={
              <>
                What we <em>stand for.</em>
              </>
            }
          />
          <ul className="card-grid">
            {values.map(({ icon: Icon, en, text }, i) => (
              <Reveal as="li" key={en} delay={i * 80} className="card card--hover value-card">
                <span className="icon-chip">
                  <Icon size={24} strokeWidth={1.7} />
                </span>
                <h3>{en}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <GateShowcase />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Plot sizes"
            title={
              <>
                Three sizes, <em>one standard.</em>
              </>
            }
          />
          <PlotSizeCards />
          <p className="center-link">
            <Link className="btn" to="/plots">
              See every plot on the map <ArrowRight size={18} />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
