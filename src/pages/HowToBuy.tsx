import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calculator, FileText, Landmark, Plus } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { buySteps, faqs, sources } from '../data/content';
import { site } from '../data/site';
import { fmt } from '../lib/plots';
import './pages.css';
import './HowToBuy.css';

type Buyer = 'man' | 'woman' | 'joint';

const BUYERS: { id: Buyer; label: string }[] = [
  { id: 'man', label: 'Man' },
  { id: 'woman', label: 'Woman' },
  { id: 'joint', label: 'Man + woman (joint)' },
];

const WOMEN_CAP = 1_00_00_000;

/** UP stamp duty: 7%; women get 1% off on property worth up to ₹1 crore; joint (man + woman) is commonly 6.5%. */
function stampDutyRate(buyer: Buyer, value: number) {
  if (buyer === 'woman') return value <= WOMEN_CAP ? 0.06 : 0.07;
  if (buyer === 'joint') return value <= WOMEN_CAP ? 0.065 : 0.07;
  return 0.07;
}

const rupees = (n: number) => `₹${fmt(Math.round(n))}`;

function CostEstimator() {
  const [value, setValue] = useState(1500000);
  const [buyer, setBuyer] = useState<Buyer>('woman');
  const result = useMemo(() => {
    const rate = stampDutyRate(buyer, value);
    const duty = value * rate;
    const fee = value * 0.01;
    return { rate, duty, fee, total: duty + fee };
  }, [value, buyer]);

  return (
    <div className="estimator">
      <div className="estimator__form">
        <label className="field">
          <span>Property value for registry (₹)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={10000}
            value={value}
            onChange={(e) => setValue(Math.max(0, Number(e.target.value) || 0))}
          />
          <small>The higher of the circle rate and your agreed price.</small>
        </label>
        <fieldset className="estimator__buyer">
          <legend>Buyer</legend>
          {BUYERS.map((b) => (
            <label key={b.id} className={buyer === b.id ? 'is-on' : ''}>
              <input type="radio" name="buyer" checked={buyer === b.id} onChange={() => setBuyer(b.id)} />
              {b.label}
            </label>
          ))}
        </fieldset>
      </div>
      <dl className="estimator__result" aria-live="polite">
        <div>
          <dt>Stamp duty ({(result.rate * 100).toFixed(1).replace('.0', '')}%)</dt>
          <dd>{rupees(result.duty)}</dd>
        </div>
        <div>
          <dt>Registration fee (1%)</dt>
          <dd>{rupees(result.fee)}</dd>
        </div>
        <div className="estimator__total">
          <dt>Estimated total</dt>
          <dd>{rupees(result.total)}</dd>
        </div>
        <p>
          Indicative only. The joint rate is the commonly applied figure — confirm the exact amount at the Sub-Registrar
          office or on igrsup.gov.in.
        </p>
      </dl>
    </div>
  );
}

export function HowToBuy() {
  return (
    <>
      <PageHeader
        crumb="How to buy"
        eyebrow="Buyer’s guide"
        title={
          <>
            From site visit to <em>your name on the khatauni.</em>
          </>
        }
        lede="How buying a plot from us works, what it costs, and what to check — so there are no surprises."
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Step by step"
            title={
              <>
                Seven clear <em>steps.</em>
              </>
            }
          />
          <ol className="timeline">
            {buySteps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={(i % 4) * 60} className="timeline__item">
                <span className="timeline__num">{i + 1}</span>
                <div>
                  <strong>
                    {s.title}
                  </strong>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container two-col">
          <div>
            <SectionHeading
              eyebrow="Registry costs"
              title={
                <>
                  Know the cost <em>upfront.</em>
                </>
              }
              lede="In Uttar Pradesh, stamp duty is 7% for men and 6% for women — the women’s 1% concession now applies to property worth up to ₹1 crore — plus a 1% registration fee."
            />
            <Reveal className="callout">
              <Calculator size={22} />
              <p>
                <strong>Tip for families:</strong> registering in a woman’s name, or jointly, lowers the stamp duty.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <CostEstimator />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <Reveal className="info-card card">
            <span className="icon-chip icon-chip--dark">
              <Landmark size={24} strokeWidth={1.7} />
            </span>
            <h3>
              Home loan
            </h3>
            <p>
              We are supported by {site.bank.name}, {site.bank.zone}. Under RBI rules a bank can lend for a plot
              when you declare that you will build a house on it, and it finances a share of the value — the rest is your
              own contribution.
            </p>
            <p className="info-card__list-title">Banks usually ask for</p>
            <ul>
              <li>KYC — PAN and Aadhaar</li>
              <li>Income proof — salary slips or Form 16, ITRs, bank statements</li>
              <li>Property papers — agreement, title documents, approved layout</li>
            </ul>
            <Link className="link-arrow" to="/home-loans">
              Banks and loan officers <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal className="info-card card" delay={100}>
            <span className="icon-chip icon-chip--dark">
              <FileText size={24} strokeWidth={1.7} />
            </span>
            <h3>
              At the registry
            </h3>
            <p>The sale deed is registered at the Sub-Registrar office, Hardoi. Bring:</p>
            <ul>
              <li>Aadhaar and PAN of buyer and seller</li>
              <li>Passport-size photographs</li>
              <li>Proof of stamp-duty payment</li>
              <li>Two witnesses with their ID</li>
            </ul>
            <p>
              Since 1 February 2026, Aadhaar authentication of buyers, sellers and witnesses is mandatory at UP
              sub-registrar offices. After registry, apply to the Tehsildar for mutation (dakhil-kharij).
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container faq-wrap">
          <SectionHeading
            eyebrow="Questions"
            title={
              <>
                Your questions, <em>answered.</em>
              </>
            }
          />
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>
                  <span>
                    {f.q}
                  </span>
                  <Plus size={20} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="sources">
            <strong>Sources</strong>
            <ul>
              {(['stamp', 'rbi'] as const).map((k) => (
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
