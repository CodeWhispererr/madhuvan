import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  as?: 'div' | 'li' | 'section' | 'article' | 'figure';
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Fades its children up the first time they scroll into view. */
export function Reveal({ as = 'div', delay = 0, className = '', children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as 'div';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
