import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ArrowUp, MessageCircle, Phone } from 'lucide-react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { site, telHref, waHref } from '../../data/site';
import './SiteLayout.css';

const TITLES: Record<string, string> = {
  '/': 'Govt. Approved Residential Plots in Hardoi',
  '/about': 'About the Project',
  '/plots': 'Plot Map & Sizes',
  '/amenities': 'Amenities',
  '/location': 'Location — RTO Road, Hardoi',
  '/how-to-buy': 'How to Buy a Plot',
  '/home-loans': 'Home Loans — Banks & Loan Officers',
  '/gallery': 'Gallery',
  '/trust-center': 'Trust Center — Documents',
  '/owners': 'Owners',
  '/contact': 'Contact & Site Visit',
  '/disclaimer': 'Disclaimer & Privacy',
};

/** Page shell: top bar + navigation, the routed page, footer and quick-contact buttons. */
export function SiteLayout() {
  const { pathname, hash } = useLocation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.title = `${TITLES[pathname] ?? 'Page not found'} · ${site.name}`;
    if (hash) {
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView());
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />

      <div className="quick-contact" aria-label="Quick contact">
        <a
          className="quick-contact__btn quick-contact__btn--wa"
          href={waHref(site.primaryPhone, `Namaste! I'd like to know more about ${site.name}.`)}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
        <a className="quick-contact__btn" href={telHref(site.primaryPhone)} aria-label="Call us">
          <Phone size={20} />
        </a>
        <button
          type="button"
          className={`quick-contact__btn quick-contact__btn--top ${showTop ? 'is-visible' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </>
  );
}
