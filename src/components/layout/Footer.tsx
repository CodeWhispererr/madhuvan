import { Link } from 'react-router';
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { InstagramIcon } from '../InstagramIcon';
import { Logo } from '../Logo';
import { formatPhone, site, telHref } from '../../data/site';
import './Footer.css';

const explore = [
  { to: '/about', label: 'About the project' },
  { to: '/plots', label: 'Plot map & sizes' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/location', label: 'Location' },
  { to: '/gallery', label: 'Gallery' },
];

const useful = [
  { to: '/how-to-buy', label: 'How to buy' },
  { to: '/home-loans', label: 'Home loans' },
  { to: '/trust-center', label: 'Trust Center' },
  { to: '/owners', label: 'Owners' },
  { to: '/contact', label: 'Contact & site visit' },
  { to: '/disclaimer', label: 'Disclaimer & privacy' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__cta">
        <div>
          <p className="hindi footer__cta-hi">अपने सपनों का प्लॉट आज ही देखें।</p>
          <h2>See your future plot this week.</h2>
        </div>
        <div className="footer__cta-actions">
          <Link className="btn btn--gold" to="/contact">
            Book a site visit <ArrowRight size={18} />
          </Link>
          <a className="btn btn--light" href={telHref(site.primaryPhone)}>
            <Phone size={17} /> {formatPhone(site.primaryPhone)}
          </a>
        </div>
      </div>

      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo tone="light" />
          <p className="footer__tagline">{site.shortTagline}</p>
          <p className="hindi footer__hindi">{site.promiseHindi}</p>
          <a className="footer__social" href={site.instagram.url} target="_blank" rel="noreferrer">
            <InstagramIcon size={18} /> @{site.instagram.handle}
          </a>
        </div>

        <div>
          <h3>Explore</h3>
          <ul className="footer__links">
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>
                  <ArrowRight size={15} /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Useful links</h3>
          <ul className="footer__links">
            {useful.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>
                  <ArrowRight size={15} /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Visit our site office</h3>
          <p className="footer__line">
            <MapPin size={16} />
            <span>
              {site.address.line1}, {site.address.line2}, {site.address.city}
            </span>
          </p>
          <a className="footer__line" href={telHref(site.primaryPhone)}>
            <Phone size={16} /> {formatPhone(site.primaryPhone)}
          </a>
          <a className="footer__line" href={`mailto:${site.email}`}>
            <Mail size={16} /> {site.email}
          </a>
        </div>
      </div>

      <div className="container footer__notice">
        <ShieldCheck size={18} />
        <p>
          This is our official website. Please deal only with the contacts listed here and collect a signed receipt
          for every payment.
        </p>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {site.name}, Hardoi. All rights reserved.</p>
        <p>
          Plans, images and illustrations are indicative. Final layout, dimensions and availability as per the approved
          plan and our site office.
        </p>
      </div>
    </footer>
  );
}
