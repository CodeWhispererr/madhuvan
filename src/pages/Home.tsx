import { Link } from 'react-router';
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  Landmark,
  MapPin,
  Ruler,
  ShieldCheck,
  Route,
  Trees,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { LifeDeck } from '../components/LifeDeck';
import { LogoMark } from '../components/Logo';
import { Reveal } from '../components/Reveal';
import { SiteMap } from '../components/explorer/SiteMap';
import { statusFill } from '../components/explorer/mapStyle';
import { AmenityIcon } from '../components/ui/AmenityIcon';
import { SectionHeading } from '../components/ui/SectionHeading';
import { amenityGroups, buySteps, distances, owners, trustGroups } from '../data/content';
import { statusLabel, type PlotStatus } from '../data/plotStatus';
import { formatPhone, site } from '../data/site';
import { countByStatus, plotInfos } from '../lib/plots';
import { galleryPosts } from './galleryData';
import './Home.css';

const glance = [
  { icon: MapPin, label: 'Where', value: 'RTO Road, near Lucknow Chungi, Hardoi', sub: 'Opposite Anand Adhiyaan Hospital' },
  { icon: Ruler, label: 'What', value: `${plotInfos.length} residential plots`, sub: '969 – 1,744 sq ft · 108 – 194 gaj' },
  { icon: BadgeCheck, label: 'Approval', value: 'Govt. approved layout', sub: 'Papers in our Trust Center' },
  { icon: Landmark, label: 'Loans', value: 'Bank of India support', sub: 'Hardoi Zone · home-loan assistance' },
  { icon: ShieldCheck, label: 'Security', value: 'Gated, 24×7 guard & CCTV', sub: 'One controlled entrance' },
  { icon: Trees, label: 'Green', value: 'Two parks, 3,162 m² central', sub: 'Jogging path & kids’ play area' },
];

const intro = [
  { icon: BadgeCheck, en: 'Government-approved layout with clear titles' },
  { icon: ShieldCheck, en: 'Gated entrance, 24×7 guard and CCTV' },
  { icon: Trees, en: 'Two parks, jogging path and kids’ play area' },
  { icon: Landmark, en: 'Home-loan support from Bank of India' },
];

const STATUSES: PlotStatus[] = ['available', 'booked', 'sold'];
const featured = amenityGroups.flatMap((g) => g.items).slice(0, 8);

export function Home() {
  const counts = countByStatus();

  return (
    <>
      <Hero />
      <LifeDeck />

      {/* At a glance */}
      <section className="section glance">
        <div className="container">
          <SectionHeading
            center
            eyebrow="At a glance"
            title={
              <>
                Everything you need to know, <em>in one look.</em>
              </>
            }
          />
          <ul className="glance__grid">
            {glance.map(({ icon: Icon, label, value, sub }, i) => (
              <Reveal as="li" key={label} delay={i * 70} className="glance__item card card--hover">
                <span className="icon-chip">
                  <Icon size={24} strokeWidth={1.7} />
                </span>
                <div>
                  <span className="glance__label">
                    {label}
                  </span>
                  <strong>{value}</strong>
                  <small>{sub}</small>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* About + numbers */}
      <section className="section home-about">
        <LogoMark className="watermark" />
        <div className="container">
          <SectionHeading
            center
            eyebrow="About Madhuvan Enclave"
            title={
              <>
                Jahan zameen hai <em>‘Sona’.</em>
              </>
            }
            lede="Every plot opens onto a paved road. Drainage, water supply, solar street lights and two parks are part of our plan from day one."
          />
          <Reveal>
            <dl className="stats">
              <div>
                <dd>{plotInfos.length}</dd>
                <dt>
                  Residential plots
                </dt>
              </div>
              <div>
                <dd>
                  12<sup>m</sup>
                </dd>
                <dt>
                  Wide main road
                </dt>
              </div>
              <div>
                <dd>
                  3,162<sup>m²</sup>
                </dd>
                <dt>
                  Central park
                </dt>
              </div>
              <div>
                <dd>3</dd>
                <dt>
                  Plot sizes
                </dt>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Why Madhuvan — image on a gold angled panel */}
      <section className="section section--tint intro">
        <div className="container intro__grid">
          <Reveal className="intro__media gold-frame">
            <img
              src="/instagram/land-legacy.jpg"
              alt="A family looking over open land, planning their future home"
              width={720}
              height={900}
              loading="lazy"
            />
            <span className="intro__badge">
              <strong>{counts.available}</strong>
              <span>
                plots available
              </span>
            </span>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Why Madhuvan"
              title={
                <>
                  Better planning, <em>a safer future.</em>
                </>
              }
              titleHi={site.promiseHindi}
              lede="Stop dreaming about owning land. Start building your future in Hardoi — part of the Lucknow State Capital Region, with the new Ganga Expressway through the district."
            />
            <ul className="intro__points">
              {intro.map(({ icon: Icon, en }) => (
                <li key={en}>
                  <Icon size={22} strokeWidth={1.8} />
                  <span>
                    {en}
                  </span>
                </li>
              ))}
            </ul>
            <Link className="btn" to="/about">
              Discover the project <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Plot map teaser */}
      <section className="section map-teaser">
        <div className="container map-teaser__grid">
          <div>
            <SectionHeading
              eyebrow="Plot map"
              title={
                <>
                  See every plot, <em>live.</em>
                </>
              }
              lede="All 149 plots: what is available, the size in sq ft and gaj, which way each one faces and how much sun it gets. In 2D or 3D."
            />
            <ul className="map-teaser__counts">
              {STATUSES.map((s) => (
                <li key={s}>
                  <i style={{ background: statusFill[s] }} />
                  <strong>{counts[s]}</strong> {statusLabel[s]}
                </li>
              ))}
            </ul>
            <Link className="btn btn--gold" to="/plots">
              Open the interactive map <ArrowRight size={18} />
            </Link>
          </div>
          <Reveal className="map-teaser__map gold-frame gold-frame--right" delay={120}>
            <Link to="/plots" aria-label="Open the interactive plot map">
              <SiteMap plots={plotInfos} mode="availability" preview />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Amenities */}
      <section className="section section--mint">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Amenities"
            title={
              <>
                Sukoon, suraksha <em>aur</em> suvidha.
              </>
            }
          />
          <ul className="amen-grid">
            {featured.map((a, i) => (
              <Reveal as="li" key={a.title} delay={(i % 4) * 70} className="amen-card card card--hover">
                <span className="icon-chip">
                  <AmenityIcon name={a.icon} />
                </span>
                <strong>{a.title}</strong>
              </Reveal>
            ))}
          </ul>
          <p className="center-link">
            <Link className="link-arrow" to="/amenities">
              See all amenities <ArrowRight size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* How to buy */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How to buy"
            title={
              <>
                Buying a plot, <em>made simple.</em>
              </>
            }
          />
          <ol className="steps">
            {buySteps.slice(0, 4).map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="steps__item card card--hover">
                <span className="steps__num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
          <p className="center-link">
            <Link className="link-arrow" to="/how-to-buy">
              Full guide: loan, registry costs & mutation <ArrowRight size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* Trust */}
      <section className="section trust-teaser">
        <div className="container trust-teaser__grid">
          <SectionHeading
            eyebrow="Trust Center"
            title={
              <>
                Nothing hidden. <em>Every paper, in one place.</em>
              </>
            }
            lede="Layout approval, land title, bank support and every buyer document — read them before you pay a rupee."
          />
          <Reveal className="trust-teaser__list gold-frame gold-frame--right" delay={120}>
            {trustGroups.slice(0, 2).flatMap((g) => g.docs).slice(0, 5).map((d) => (
              <div key={d.title} className="trust-teaser__doc">
                <FileCheck2 size={20} />
                <span>
                  <strong>{d.title}</strong>
                </span>
                <em>{d.status === 'office' ? 'At site office' : 'Coming soon'}</em>
              </div>
            ))}
            <Link className="btn" to="/trust-center">
              Visit the Trust Center <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Location */}
      <section className="section section--tint">
        <div className="container loc-teaser">
          <SectionHeading
            eyebrow="Location"
            title={
              <>
                Location is <em>everything.</em>
              </>
            }
            lede={`${site.address.line1}, right opposite Anand Adhiyaan Hospital — close to the RTO office, a mall and a petrol pump.`}
          />
          <Reveal className="loc-teaser__cards" delay={100}>
            {distances.map((d) => (
              <div key={d.place} className="loc-teaser__card">
                <strong>{d.km}</strong>
                <span>{d.place}</span>
              </div>
            ))}
            <div className="loc-teaser__card loc-teaser__card--wide">
              <Route size={20} />
              <span>
                <strong>Ganga Expressway</strong> now runs through Hardoi district — opened 29 April 2026.
              </span>
            </div>
            <Link className="link-arrow" to="/location">
              Location & connectivity <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          <div className="row-head">
            <SectionHeading eyebrow="Gallery" title={<>A glimpse of Madhuvan.</>} />
            <Link className="btn btn--ghost" to="/gallery">
              View gallery <ArrowRight size={18} />
            </Link>
          </div>
          <ul className="strip">
            {galleryPosts.slice(0, 4).map((p, i) => (
              <Reveal as="li" key={p.src} delay={i * 70}>
                <Link to="/gallery" className="strip__item">
                  <img src={p.src} alt={p.alt} loading="lazy" width={720} height={900} />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Owners */}
      <section className="section section--tint">
        <div className="container owners-teaser">
          <SectionHeading
            eyebrow="Who we are"
            title={
              <>
                A promise, <em>from us to you.</em>
              </>
            }
            titleHi="हमारा वादा — आपका भरोसा"
            lede="We are two people from Hardoi who own and run Madhuvan Enclave. Here is our promise to every family that buys here."
          />
          <Reveal className="owners-teaser__card card" delay={100}>
            <ul className="owners-teaser__list">
              {owners.map((o) => (
                <li key={o.name}>
                  <span className="owners-teaser__avatar">
                    <img
                      src={o.photo}
                      alt={o.name}
                      width={640}
                      height={640}
                      loading="lazy"
                      style={{ objectPosition: o.focus, transformOrigin: o.focus, transform: `scale(${o.zoom})` }}
                    />
                  </span>
                  <div>
                    <strong>{o.name}</strong>
                    <span>
                      {o.role} · {formatPhone(o.phone)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="owners-teaser__quote">
              “Clear papers, good roads, greenery and security — so that every family in Hardoi can build the home of
              its dreams without worry.”
            </p>
            <Link className="link-arrow" to="/owners">
              Meet us <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
