import { Link } from 'react-router';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { GateIllustration } from './GateIllustration';
import { site } from '../data/site';
import { plotInfos } from '../lib/plots';
import { useMedia } from '../lib/useMedia';
import './Hero.css';

export function Hero() {
  const wideScreen = useMedia('(min-width: 1100px)', true);

  return (
    <section className="hero clip-steps">
      <div className="hero__sky" aria-hidden="true">
        <span className="hero__sun" />
        <span className="hero__cloud hero__cloud--a" />
        <span className="hero__cloud hero__cloud--b" />
        <span className="hero__cloud hero__cloud--c" />
      </div>

      <div className="hero__scene">
        <GateIllustration className="hero__gate" framing={wideScreen ? 'hero' : 'wide'} />
      </div>
      <div className="hero__haze" aria-hidden="true" />
      <div className="corner-glass" aria-hidden="true" />

      <div className="container hero__content">
        <p className="hero__badge">
          <BadgeCheck size={16} />
          Govt. approved layout
        </p>
        <h1 className="hero__title">
          Your land.
          <br />
          <em>Your legacy.</em>
        </h1>
        <p className="hindi hero__hindi">{site.hindiTagline}</p>
        <p className="hero__lede">
          {plotInfos.length} plots from 969 to 1,744 sq ft on RTO Road, near Lucknow Chungi, Hardoi. Gated, green and
          backed by {site.bank.name} for home loans.
        </p>
        <div className="hero__actions">
          <Link className="btn" to="/plots">
            View plots <ArrowRight size={18} />
          </Link>
          <Link className="btn btn--outline" to="/contact">
            Book a site visit
          </Link>
        </div>
      </div>
    </section>
  );
}
