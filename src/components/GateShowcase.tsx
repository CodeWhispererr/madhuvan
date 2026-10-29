import { useState } from 'react';
import { GateIllustration } from './GateIllustration';
import { Reveal } from './Reveal';
import './GateShowcase.css';

// Hotspots sit on points of the gate drawing (x 0–1200, y 100–600 in its viewBox).
const features = [
  {
    x: 600,
    y: 250,
    title: 'Slatted feature wall',
    text: 'A tall wall of vertical fins carries the Madhuvan emblem at the heart of the entrance.',
  },
  {
    x: 350,
    y: 147,
    title: 'Louvred canopies',
    text: 'Cantilevered white frames with warm timber louvres shade both the entry and exit lanes.',
  },
  {
    x: 505,
    y: 330,
    title: 'Twin slanted pylons',
    text: 'Two sculpted white pylons lean outward in a V — the signature silhouette you see from RTO Road.',
  },
  {
    x: 600,
    y: 476,
    title: 'Landscaped median',
    text: 'A clipped hedge and sculptural agaves separate incoming and outgoing traffic.',
  },
  {
    x: 260,
    y: 420,
    title: 'Guard cabins',
    text: 'Security cabins on both lanes keep a watch on every vehicle, day and night.',
  },
  {
    x: 410,
    y: 459,
    title: 'Boom barriers',
    text: 'Separate, barrier-controlled lanes for residents and visitors.',
  },
  {
    x: 712,
    y: 200,
    title: '24×7 CCTV',
    text: 'Cameras on the pylons cover the entrance round the clock.',
  },
  {
    x: 1050,
    y: 244,
    title: 'Solar street lights',
    text: 'Solar-powered lighting along the boundary and every internal road.',
  },
];

export function GateShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section id="gate" className="section showcase">
      <div className="container">
        <Reveal className="showcase__head">
          <span className="eyebrow">
            The entrance
          </span>
          <h2 className="display showcase__title">
            A gateway that tells you
            <br />
            <em>you’ve arrived home.</em>
          </h2>
          <p className="lede showcase__lede">
            The first thing every resident and guest sees on RTO Road. Hover the points to see how it is designed.
          </p>
        </Reveal>

        <Reveal className="showcase__stage" delay={100}>
          <div className="showcase__drawing gold-frame">
            <div className="showcase__canvas">
              <GateIllustration variant="blueprint" title="Architectural elevation of the main gate" />
              {features.map((f, i) => (
                <button
                  key={f.title}
                  type="button"
                  className={`showcase__spot ${active === i ? 'is-active' : ''}`}
                  style={{ left: `${(f.x / 1200) * 100}%`, top: `${((f.y - 100) / 500) * 100}%` }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={f.title}
                  aria-pressed={active === i}
                >
                  <span>{i + 1}</span>
                </button>
              ))}
              <span className="showcase__dim showcase__dim--a" aria-hidden="true">
                ENTRY
              </span>
              <span className="showcase__dim showcase__dim--b" aria-hidden="true">
                EXIT
              </span>
            </div>
          </div>

          <ol className="showcase__list">
            {features.map((f, i) => (
              <li key={f.title} className={active === i ? 'is-active' : ''}>
                <button type="button" onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}>
                  <span className="showcase__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <strong>{f.title}</strong>
                    <span className="showcase__text">{f.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
