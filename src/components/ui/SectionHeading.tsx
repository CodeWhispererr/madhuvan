import type { ReactNode } from 'react';
import { Reveal } from '../Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  titleHi?: string;
  lede?: ReactNode;
  center?: boolean;
  light?: boolean;
}

/** Section heading: small label, bold title, optional Hindi tagline beneath. */
export function SectionHeading({ eyebrow, title, titleHi, lede, center, light }: SectionHeadingProps) {
  return (
    <Reveal className={`heading ${center ? 'heading--center' : ''}`}>
      <span className={`eyebrow ${center ? 'eyebrow--center' : ''} ${light ? 'eyebrow--light' : ''}`}>
        {eyebrow}
      </span>
      <h2 className="display">{title}</h2>
      {titleHi && <span className="display-hi">{titleHi}</span>}
      {lede && <p className="lede">{lede}</p>}
    </Reveal>
  );
}
