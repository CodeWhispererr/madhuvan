import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ExternalLink, FileText, Landmark, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { banks } from '../data/content';
import { formatPhone, site, telHref, waHref } from '../data/site';
import './pages.css';
import './HomeLoans.css';

const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const steps = [
  {
    title: 'Pick your plot',
    text: 'Choose the plot on our map. We give you the cost sheet and the plot’s papers — the approved layout and the title.',
  },
  {
    title: 'Meet the officer',
    text: 'Call the bank officer listed above. They check your eligibility and tell you the amount, the rate and the tenure.',
  },
  {
    title: 'Documents & sanction',
    text: 'Your KYC, income proof and the plot papers go to the bank. It issues a sanction letter with the amount and terms.',
  },
  {
    title: 'Registry & disbursement',
    text: 'The bank pays us at the registry, you pay the balance, and your EMIs begin. Build within the bank’s time limit.',
  },
];

/** Standard reducing-balance EMI. */
function EmiEstimator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(15);
  const r = useMemo(() => {
    const n = Math.max(1, Math.round(years * 12));
    const m = rate / 1200;
    const emi = m === 0 ? amount / n : (amount * m * (1 + m) ** n) / ((1 + m) ** n - 1);
    return { emi, total: emi * n, interest: emi * n - amount };
  }, [amount, rate, years]);

  return (
    <div className="emi">
      <div className="emi__form">
        <label className="field">
          <span>Loan amount (₹)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={50000}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
          <small>The plot price minus your own contribution.</small>
        </label>
        <div className="emi__row">
          <label className="field">
            <span>Interest rate (% a year)</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={30}
              step={0.05}
              value={rate}
              onChange={(e) => setRate(Math.min(30, Math.max(0, Number(e.target.value) || 0)))}
            />
          </label>
          <label className="field">
            <span>Tenure (years)</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
            />
          </label>
        </div>
      </div>
      <dl className="emi__result" aria-live="polite">
        <div className="emi__main">
          <dt>Monthly EMI</dt>
          <dd>{rupees(r.emi)}</dd>
        </div>
        <div>
          <dt>Total interest</dt>
          <dd>{rupees(r.interest)}</dd>
        </div>
        <div>
          <dt>Total you repay</dt>
          <dd>{rupees(r.total)}</dd>
        </div>
      </dl>
      <p className="emi__note">Indicative only. The bank’s rate, processing fee and insurance change the final numbers.</p>
    </div>
  );
}

export function HomeLoans() {
  return (
    <>
      <PageHeader
        crumb="Home loans"
        eyebrow="Home loans"
        title={
          <>
            Your plot, with a bank <em>behind you.</em>
          </>
        }
        titleHi="प्लॉट आपका, लोन की मदद हमारी।"
        lede="These banks lend for plots in Madhuvan Enclave. Call their officers directly, or tell us and we will set up the meeting."
      >
        <a className="btn btn--gold" href={telHref(site.primaryPhone)}>
          <Phone size={18} /> {formatPhone(site.primaryPhone)}
        </a>
        <a
          className="btn btn--light"
          href={waHref(site.primaryPhone, `Namaste! I'd like help with a loan for a plot in ${site.name}.`)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
      </PageHeader>

      {/* Banks */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Banks that lend here"
            title={
              <>
                Talk to the <em>bank directly.</em>
              </>
            }
            lede="For each bank we list the officer who handles Madhuvan Enclave, so you do not have to start from the front desk."
          />
          <ul className="banks">
            {banks.map((b, i) => (
              <Reveal as="li" key={b.id} delay={i * 90} className="bank card">
                <div className="bank__head">
                  <span className="bank__mark" aria-hidden="true">
                    {b.short}
                  </span>
                  <div>
                    <h3>{b.name}</h3>
                    <span className="bank__meta">
                      {b.kind} · {b.branch}
                    </span>
                  </div>
                </div>

                <p className="bank__label">What they offer</p>
                <ul className="bank__products">
                  {b.products.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>

                <p className="bank__label">Who to call</p>
                {b.officers.length > 0 ? (
                  <ul className="bank__officers">
                    {b.officers.map((o) => (
                      <li key={o.phone}>
                        <div>
                          <strong>{o.name}</strong>
                          <span>{o.role}</span>
                        </div>
                        <a className="bank__phone" href={telHref(o.phone)}>
                          {formatPhone(o.phone)}
                        </a>
                        <div className="bank__actions">
                          <a className="btn btn--sm" href={telHref(o.phone)}>
                            <Phone size={15} /> Call
                          </a>
                          <a
                            className="btn btn--sm btn--ghost"
                            href={waHref(o.phone, `Namaste ${o.name.split(' ')[0]} ji, I'd like to know about a plot loan for ${site.name}.`)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageCircle size={15} /> WhatsApp
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bank__soon">
                    <span className="mock-tag">Coming soon</span>
                    <p>We are adding the branch officer’s details. Until then, call us and we will connect you.</p>
                    <a
                      className="btn btn--sm"
                      href={waHref(site.primaryPhone, `Namaste! I'd like a ${b.name} loan for a plot in ${site.name}.`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={15} /> Ask us
                    </a>
                  </div>
                )}

                <a className="link-arrow bank__site" href={b.website} target="_blank" rel="noreferrer">
                  {b.website.replace('https://', '')} <ExternalLink size={14} />
                </a>
              </Reveal>
            ))}
          </ul>
          <p className="banks__note">
            <ShieldCheck size={18} />
            Interest rates and eligibility change. Ask the officer for today’s rate before you plan.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            center
            eyebrow="How it works"
            title={
              <>
                From plot to <em>sanction letter.</em>
              </>
            }
          />
          <ol className="loan-steps">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="card card--hover">
                <span className="loan-steps__num">{String(i + 1).padStart(2, '0')}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* EMI */}
      <section className="section">
        <div className="container two-col">
          <div>
            <SectionHeading
              eyebrow="EMI estimator"
              title={
                <>
                  Know your <em>monthly EMI.</em>
                </>
              }
              lede="Put in the loan amount, the rate the bank quotes you and the tenure. Most buyers here borrow for 10 to 20 years."
            />
          </div>
          <Reveal delay={120}>
            <EmiEstimator />
          </Reveal>
        </div>
      </section>

      {/* Documents + rules */}
      <section className="section section--mint">
        <div className="container two-col">
          <Reveal className="loan-card card">
            <span className="icon-chip icon-chip--dark">
              <FileText size={24} strokeWidth={1.7} />
            </span>
            <h3>What banks usually ask for</h3>
            <ul>
              <li>KYC — PAN and Aadhaar, with photographs</li>
              <li>Income proof — salary slips or Form 16; ITRs for the self-employed; six months of bank statements</li>
              <li>Plot papers — the agreement, the approved layout and the title chain</li>
            </ul>
            <p>
              Every paper the bank needs about the land is in our{' '}
              <Link to="/trust-center">Trust Center</Link>.
            </p>
          </Reveal>
          <Reveal className="loan-card card" delay={100}>
            <span className="icon-chip icon-chip--dark">
              <Landmark size={24} strokeWidth={1.7} />
            </span>
            <h3>Good to know</h3>
            <ul>
              <li>Under RBI rules a bank lends for a plot only when you declare that you will build a house on it.</li>
              <li>The bank finances a share of the value — typically 75–90% depending on the loan size. The rest is your own contribution.</li>
              <li>The bank pays us directly at the registry, after the sanction letter.</li>
              <li>Registering in a woman’s name, or jointly, lowers the stamp duty.</li>
            </ul>
            <Link className="link-arrow" to="/how-to-buy">
              Registry costs and the full buying guide <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
