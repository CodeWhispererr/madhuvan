import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { Logo } from '../Logo';
import { formatPhone, site, telHref } from '../../data/site';
import './Navbar.css';

interface NavItem {
  to: string;
  label: string;
  children?: { to: string; label: string; text: string }[];
}

export const NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  {
    to: '/about',
    label: 'Project',
    children: [
      { to: '/about', label: 'About the project', text: 'Overview, vision and the gate' },
      { to: '/plots', label: 'Plot map & sizes', text: 'All 149 plots, live availability' },
      { to: '/amenities', label: 'Amenities', text: 'Security, roads, parks and more' },
      { to: '/location', label: 'Location', text: 'RTO Road, Hardoi — connectivity' },
      { to: '/home-loans', label: 'Home loans', text: 'Banks, loan officers and EMI' },
    ],
  },
  { to: '/how-to-buy', label: 'How to buy' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/trust-center', label: 'Trust Center' },
  { to: '/owners', label: 'Owners' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProjectOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const projectActive = NAV[1].children!.some((c) => c.to === pathname);

  return (
      <header className={`nav ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label={`${site.name} — home`}>
            <Logo tone={scrolled || open ? 'light' : 'dark'} />
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className={`nav__drop ${projectOpen ? 'is-open' : ''}`}
                  onMouseEnter={() => setProjectOpen(true)}
                  onMouseLeave={() => setProjectOpen(false)}
                >
                  <button
                    type="button"
                    className={`nav__link ${projectActive ? 'is-active' : ''}`}
                    aria-expanded={projectOpen}
                    onClick={() => setProjectOpen((v) => !v)}
                  >
                    {item.label} <ChevronDown size={15} />
                  </button>
                  <div className="nav__menu" role="menu">
                    {item.children.map((c) => (
                      <NavLink key={c.to} to={c.to} role="menuitem" className="nav__menu-item">
                        <span className="nav__menu-title">
                          {c.label}
                        </span>
                        <span className="nav__menu-text">{c.text}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} end className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="nav__actions">
            <a className="nav__phone" href={telHref(site.primaryPhone)} aria-label={`Call ${formatPhone(site.primaryPhone)}`}>
              <Phone size={17} />
            </a>
            <Link className="btn btn--sm nav__cta" to="/contact">
              Book site visit
            </Link>
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div id="mobile-menu" className="nav__sheet" hidden={!open}>
          <nav aria-label="Mobile">
            {NAV.flatMap((item) => (item.children ? item.children : [item])).map((item) => (
              <NavLink key={item.to + item.label} to={item.to} end className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <a className="btn btn--gold" href={telHref(site.primaryPhone)}>
            <Phone size={18} /> Call {formatPhone(site.primaryPhone)}
          </a>
        </div>
      </header>
  );
}
