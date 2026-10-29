import { Link } from 'react-router';
import {
  ArrowUpRight,
  Clock,
  Download,
  FileText,
  Hourglass,
  Landmark,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Store,
  UserCheck,
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { trustGroups, verifyPortals, type DocStatus } from '../data/content';
import { site, telHref } from '../data/site';
import './pages.css';
import './TrustCenter.css';

const statusText: Record<DocStatus, string> = {
  soon: 'Uploading soon',
  office: 'View at site office',
};

const totalDocs = trustGroups.reduce((n, g) => n + g.docs.length, 0);

const safety = [
  { icon: UserCheck, en: 'Deal only with listed contacts', text: 'Talk only to the people listed on our Contact page.' },
  { icon: Receipt, en: 'Get a receipt for every payment', text: 'Every rupee you pay should be acknowledged on a signed receipt.' },
  { icon: Landmark, en: 'Pay into the named account', text: 'Pay only into the account written on your allotment letter.' },
  { icon: ShieldAlert, en: 'Verify before you pay', text: 'Check the khatauni and registered deeds yourself on the portals below.' },
];

export function TrustCenter() {
  return (
    <>
      <PageHeader
        crumb="Trust Center"
        eyebrow="Trust Center"
        title={
          <>
            Nothing hidden. <em>Every paper, in one place.</em>
          </>
        }
        lede="Approvals, land title, bank support and every document you will sign — in one place, before you pay."
      >
        <a className="btn btn--gold" href="#documents">
          <FileText size={18} /> See the documents
        </a>
        <a className="btn btn--light" href="#verify">
          <ShieldCheck size={18} /> Verify it yourself
        </a>
      </PageHeader>

      <section className="section" id="documents">
        <div className="container">
          <Reveal className="notice">
            <Hourglass size={22} />
            <div>
              <strong>We are uploading the documents — this page will be complete soon.</strong>
              <p>
                Below is the full list of papers we will publish. Until each one is online, you can see the originals at
                our site office — just call us on{' '}
                <a href={telHref(site.primaryPhone)}>{site.primaryPhone}</a> to fix a time.
              </p>
            </div>
          </Reveal>

          <div className="trust-summary">
            <div>
              <strong>{totalDocs}</strong>
              <span>documents listed</span>
            </div>
            <div>
              <strong>{trustGroups.length}</strong>
              <span>categories</span>
            </div>
            <div>
              <strong>0</strong>
              <span>online so far</span>
            </div>
          </div>

          {trustGroups.map((g) => (
            <div key={g.id} className="doc-group">
              <h2 className="amenity-group__title">
                {g.title}
              </h2>
              <ul className="doc-list">
                {g.docs.map((d, i) => (
                  <Reveal as="li" key={d.title} delay={(i % 3) * 60} className="doc">
                    <span className="doc__icon">
                      <FileText size={22} strokeWidth={1.7} />
                    </span>
                    <div className="doc__body">
                      <strong>{d.title}</strong>
                      <p>{d.what}</p>
                      <small>Issued by: {d.issuer}</small>
                    </div>
                    <div className="doc__side">
                      <span className={`doc__status doc__status--${d.status}`}>
                        {d.status === 'office' ? <Store size={14} /> : <Clock size={14} />}
                        {statusText[d.status]}
                      </span>
                      <button type="button" className="btn btn--sm btn--ghost" disabled aria-disabled="true">
                        <Download size={15} /> PDF
                      </button>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tint" id="verify">
        <div className="container">
          <SectionHeading
            eyebrow="Verify it yourself"
            title={
              <>
                Don’t just trust us — <em>check.</em>
              </>
            }
            lede="Don’t take our word for it. These official Government of Uttar Pradesh portals let anyone check land records and registered deeds — free of cost."
          />
          <ul className="portal-grid">
            {verifyPortals.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 70}>
                <a className="portal card card--hover" href={p.url} target="_blank" rel="noreferrer">
                  <span className="portal__name">
                    {p.name}
                  </span>
                  <p>{p.text}</p>
                  <span className="portal__url">
                    {p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} <ArrowUpRight size={15} />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Stay safe"
            title={
              <>
                Four rules for a <em>safe purchase.</em>
              </>
            }
          />
          <ul className="card-grid">
            {safety.map(({ icon: Icon, en, text }, i) => (
              <Reveal as="li" key={en} delay={i * 70} className="card value-card">
                <span className="icon-chip">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <h3>{en}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ul>
          <p className="center-link">
            <Link className="btn" to="/contact">
              Ask for a document
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
