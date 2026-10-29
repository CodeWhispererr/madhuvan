import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { GateIllustration } from '../GateIllustration';
import './ui.css';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  /** An optional Hindi line — for a real tagline, not a translation. */
  titleHi?: string;
  lede?: ReactNode;
  crumb: string;
  children?: ReactNode;
}

/** Banner for inner pages: faded gate scene, centred bilingual title and breadcrumb, stepped clip-path edge. */
export function PageHeader({ eyebrow, title, titleHi, lede, crumb, children }: PageHeaderProps) {
  return (
    <header className="page-header clip-steps">
      <div className="page-header__scene" aria-hidden="true">
        <GateIllustration framing="wide" />
      </div>
      <div className="page-header__haze" aria-hidden="true" />
      <div className="corner-glass" aria-hidden="true" />
      <div className="container page-header__inner">
        <span className="eyebrow eyebrow--center">{eyebrow}</span>
        <h1 className="page-header__title">{title}</h1>
        {titleHi && <p className="page-header__hi hindi">{titleHi}</p>}
        {lede && <p className="page-header__lede">{lede}</p>}
        {children && <div className="page-header__actions">{children}</div>}
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ArrowRight size={14} />
          <span aria-current="page">{crumb}</span>
        </nav>
      </div>
    </header>
  );
}
