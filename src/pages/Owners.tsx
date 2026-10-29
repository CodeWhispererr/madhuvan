import { Link } from 'react-router';
import { ArrowRight, MessageCircle, Phone, Quote } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { owners } from '../data/content';
import { formatPhone, site, telHref, waHref } from '../data/site';
import './pages.css';
import './Owners.css';

export function Owners() {
  return (
    <>
      <PageHeader
        crumb="Owners"
        eyebrow="Owners"
        title={
          <>
            We are <em>Madhuvan Enclave.</em>
          </>
        }
        lede="We are two people from Hardoi. We own and run Madhuvan Enclave, and we will be here long after the last plot is sold."
      />

      <section className="section">
        <div className="container">
          <ul className="owner-grid">
            {owners.map((o, i) => (
              <Reveal as="li" key={o.name} delay={i * 90} className="owner card">
                <img className="owner__photo" src={o.photo} alt={o.name} width={640} height={640} />
                <div className="owner__body">
                  <span className="owner__role">{o.role}</span>
                  <h3>{o.name}</h3>
                  <a className="owner__phone" href={telHref(o.phone)}>
                    {formatPhone(o.phone)}
                  </a>
                  <div className="owner__actions">
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

      <section className="section section--tint">
        <div className="container message">
          <Reveal className="message__card">
            <Quote size={40} className="message__quote" />
            <span className="eyebrow">Our message to you</span>
            <p className="message__hi hindi">
              “घर सिर्फ चार दीवारी नहीं होती, एक भरोसा होता है। मधुवन एन्क्लेव में हमारा वादा है — साफ़ कागज़ात, अच्छी सड़कें,
              हरियाली और सुरक्षा, ताकि हरदोई का हर परिवार बिना किसी चिंता के अपने सपनों का घर बना सके।”
            </p>
            <p className="message__en">
              “A home is more than four walls — it is trust. Our promise at Madhuvan Enclave is simple: clear papers, good
              roads, greenery and security, so that every family in Hardoi can build the home of its dreams without worry.”
            </p>
            <div className="message__sign">
              <strong>{owners.map((o) => o.name).join(' & ')}</strong>
              <span>Owners, {site.name}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            center
            eyebrow="Our commitment"
            title={
              <>
                Answerable to <em>every buyer.</em>
              </>
            }
            titleHi="हमारा वादा — आपका भरोसा"
            lede="Every document in our Trust Center, every payment on a signed receipt, and we are a phone call away."
          />
          <p className="center-link" style={{ marginTop: 0 }}>
            <Link className="btn" to="/trust-center">
              See the documents <ArrowRight size={18} />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
