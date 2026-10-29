import { useEffect, useState, type FormEvent } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Reveal } from './Reveal';
import { formatPhone, site, telHref, waHref } from '../data/site';
import './Enquiry.css';

interface EnquiryProps {
  /** Plot picked on the map, if any. Changes each time a new plot is chosen. */
  plotNo: number | null;
}

export function Enquiry({ plotNo }: EnquiryProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plot, setPlot] = useState('');
  const [visit, setVisit] = useState('');
  const [message, setMessage] = useState('');
  const [via, setVia] = useState<'whatsapp' | 'email'>('whatsapp');

  useEffect(() => {
    if (plotNo !== null) setPlot(String(plotNo));
  }, [plotNo]);

  const body = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    plot && `Interested in plot: ${plot}`,
    visit && `Preferred site-visit date: ${visit}`,
    message && `Message: ${message}`,
  ]
    .filter(Boolean)
    .join('\n');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Hello ${site.name} team,\n\n${body}`;
    if (via === 'whatsapp') {
      window.open(waHref(site.primaryPhone, text), '_blank', 'noopener');
    } else {
      const subject = plot ? `Enquiry — Plot ${plot}` : 'Site visit enquiry';
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section id="enquiry" className="section section--tint enquiry">
      <div className="container enquiry__grid">
        <Reveal className="enquiry__intro">
          <span className="eyebrow">
            Book a site visit
          </span>
          <h2 className="display enquiry__title">
            Send us <em>your details.</em>
          </h2>
          <p className="enquiry__lede">
            Walk the roads, stand on your plot and see the gate for yourself. Share a few details and we will
            get back to you the same day.
          </p>
          <ul className="enquiry__direct">
            <li>
              <Phone size={18} />
              <a href={telHref(site.primaryPhone)}>{formatPhone(site.primaryPhone)}</a>
            </li>
            <li>
              <Mail size={18} />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
          <p className="hindi enquiry__hindi">घर लेने का सोच रहे हो हरदोई में? मधुवन एन्क्लेव पे भरोसा करके देखो।</p>
        </Reveal>

        <Reveal className="enquiry__card gold-frame gold-frame--right" delay={120}>
          <form onSubmit={submit} className="form">
            <div className="form__row">
              <label className="field">
                <span>Your name</span>
                <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="field">
                <span>Mobile number</span>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[0-9+\s-]{10,15}"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>
            <div className="form__row">
              <label className="field">
                <span>Plot number (optional)</span>
                <input
                  inputMode="numeric"
                  placeholder="e.g. 23"
                  value={plot}
                  onChange={(e) => setPlot(e.target.value.replace(/\D/g, '').slice(0, 3))}
                />
              </label>
              <label className="field">
                <span>Site visit on (optional)</span>
                <input type="date" min={today} value={visit} onChange={(e) => setVisit(e.target.value)} />
              </label>
            </div>
            <label className="field">
              <span>Message (optional)</span>
              <textarea
                rows={3}
                placeholder="Plot size you're looking for, budget, questions about loans…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <fieldset className="form__via">
              <legend>Send my enquiry on</legend>
              <label className={via === 'whatsapp' ? 'is-on' : ''}>
                <input type="radio" name="via" checked={via === 'whatsapp'} onChange={() => setVia('whatsapp')} />
                <MessageCircle size={16} /> WhatsApp
              </label>
              <label className={via === 'email' ? 'is-on' : ''}>
                <input type="radio" name="via" checked={via === 'email'} onChange={() => setVia('email')} />
                <Mail size={16} /> Email
              </label>
            </fieldset>

            <button type="submit" className="btn btn--gold form__submit">
              Send enquiry
            </button>
            <p className="form__fine">
              Opens {via === 'whatsapp' ? 'WhatsApp' : 'your email app'} with your details filled in — nothing is stored
              on this website.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
