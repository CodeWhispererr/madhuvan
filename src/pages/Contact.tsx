import { useSearchParams } from 'react-router';
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { Enquiry } from '../components/Enquiry';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { owners } from '../data/content';
import { formatPhone, site, telHref, waHref } from '../data/site';
import './pages.css';
import './Contact.css';

export function Contact() {
  const [params] = useSearchParams();
  const plot = Number(params.get('plot')) || null;
  const q = encodeURIComponent(site.address.mapQuery);

  return (
    <>
      <PageHeader
        crumb="Contact"
        eyebrow="Contact & site visit"
        title={
          <>
            Come see your <em>future address.</em>
          </>
        }
        lede="Call, WhatsApp or send the form. We reply the same day and fix a time for your visit."
      >
        <a className="btn btn--gold" href={telHref(site.primaryPhone)}>
          <Phone size={18} /> {formatPhone(site.primaryPhone)}
        </a>
        <a className="btn btn--light" href={waHref(site.primaryPhone, `Namaste! I'd like to visit ${site.name}.`)} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> WhatsApp
        </a>
      </PageHeader>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Owners"
            title={
              <>
                Talk to <em>us.</em>
              </>
            }
          />
          <ul className="people people--owners">
            {owners.map((o, i) => (
              <Reveal as="li" key={o.name} delay={i * 90} className="person card">
                <span className="person__img">
                  <img
                    src={o.photo}
                    alt={o.name}
                    width={640}
                    height={640}
                    loading="lazy"
                    style={{ objectPosition: o.focus, transformOrigin: o.focus, transform: `scale(${Math.max(1, o.zoom - 0.6)})` }}
                  />
                </span>
                <div className="person__body">
                  <span className="person__role">{o.role}</span>
                  <h3>{o.name}</h3>
                  <a className="person__phone" href={telHref(o.phone)}>
                    {formatPhone(o.phone)}
                  </a>
                  <div className="person__actions">
                    <a className="btn btn--sm" href={telHref(o.phone)}>
                      <Phone size={15} /> Call
                    </a>
                    <a
                      className="btn btn--sm btn--ghost"
                      href={waHref(o.phone, `Namaste ${o.name.split(' ')[0]} ji, I'd like to know more about ${site.name}.`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Enquiry plotNo={plot} />

      <section className="section">
        <div className="container office">
          <Reveal className="office__map">
            <iframe
              title={`Map showing ${site.name}`}
              src={`https://www.google.com/maps?q=${q}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
          <Reveal className="office__card card" delay={100}>
            <h3>
              Site office
            </h3>
            <p className="office__line">
              <MapPin size={18} />
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.city}
              </span>
            </p>
            <p className="office__line">
              <Phone size={18} />
              <a href={telHref(site.primaryPhone)}>{formatPhone(site.primaryPhone)}</a>
            </p>
            <p className="office__line">
              <Mail size={18} />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className="office__line">
              <Clock size={18} />
              <span>Open every day — please call before you come so someone can walk you around.</span>
            </p>
            <a className="btn" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer">
              <Navigation size={17} /> Get directions
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
