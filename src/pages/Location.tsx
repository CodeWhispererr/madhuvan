import { Building2, Fuel, Hospital, MapPin, Navigation, ShoppingBag } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { connectivity, distances, sources } from '../data/content';
import { site, type Nearby } from '../data/site';
import './pages.css';
import './Location.css';

const nearbyIcon: Record<Nearby['kind'], typeof MapPin> = {
  hospital: Hospital,
  road: Navigation,
  office: Building2,
  mall: ShoppingBag,
  fuel: Fuel,
};

export function Location() {
  const q = encodeURIComponent(site.address.mapQuery);
  const used = Array.from(new Set(connectivity.map((c) => c.source)));

  return (
    <>
      <PageHeader
        crumb="Location"
        eyebrow="Location advantages"
        title={
          <>
            Location is <em>everything.</em>
          </>
        }
        lede="Near Lucknow Chungi on RTO Road, opposite Anand Adhiyaan Hospital — with the RTO office, a mall and a petrol pump close by."
      >
        <a className="btn btn--gold" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer">
          <Navigation size={17} /> Get directions
        </a>
      </PageHeader>

      <section className="section">
        <div className="container loc-grid">
          <Reveal className="loc-map gold-frame">
            <iframe
              title={`Map showing ${site.name}, ${site.address.city}`}
              src={`https://www.google.com/maps?q=${q}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
          <div>
            <SectionHeading eyebrow="Right next door" title={<>Everyday needs, <em>minutes away.</em></>} />
            <ul className="nearby">
              {site.nearby.map((n, i) => {
                const Icon = nearbyIcon[n.kind];
                return (
                  <Reveal as="li" key={n.name} delay={i * 60}>
                    <span className="icon-chip">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span>
                      <strong>{n.name}</strong>
                      <small>{n.detail}</small>
                    </span>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Connectivity"
            title={
              <>
                Hardoi is <em>on the move.</em>
              </>
            }
          />
          <div className="dist">
            {distances.map((d, i) => (
              <Reveal key={d.place} delay={i * 70} className="dist__item">
                <strong>{d.km}</strong>
                <span>
                  {d.place} · {d.note}
                </span>
              </Reveal>
            ))}
          </div>
          <ul className="card-grid" style={{ marginTop: 20 }}>
            {connectivity.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 3) * 70} className="card value-card">
                <h3 style={{ marginTop: 0 }}>{c.title}</h3>
                <p>{c.text}</p>
              </Reveal>
            ))}
          </ul>
          <div className="sources">
            <strong>Sources</strong> — distances from Hardoi city as published by the district administration.
            <ul>
              {used.map((k) => (
                <li key={k}>
                  <a href={sources[k].url} target="_blank" rel="noreferrer">
                    {sources[k].label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
