import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { useMedia } from '../lib/useMedia';
import './LifeDeck.css';

interface DeckCard {
  title: string;
  text: string;
  /** Unsplash photo id — stand-ins until we shoot the site itself. */
  photo: string;
  alt: string;
}

const cards: DeckCard[] = [
  {
    title: 'Tree-lined roads',
    text: 'Every plot opens onto a paved road. The main avenue is 12 m wide, with trees planted on both sides.',
    photo: '1476231682828-37e571bc172f',
    alt: 'A road winding through dense green trees, seen from above',
  },
  {
    title: 'The central park',
    text: '3,162 m² of lawn and shade in the middle of the colony, with a jogging path around it and benches under the trees.',
    photo: '1519331379826-f10be5486c6f',
    alt: 'A park path under large old trees, with a bench in the shade',
  },
  {
    title: 'A place for the kids',
    text: 'A play area inside the gate, where children can run around while you watch from your doorstep.',
    photo: '1472162072942-cd5147eb3902',
    alt: 'A laughing child sitting on a bench in a sunny park',
  },
  {
    title: 'Solar street lights',
    text: 'Streets lit every night without an electricity bill, a guard at the gate and CCTV.',
    photo: '1509391366360-2e959784a276',
    alt: 'Solar panels under a blue sky with clouds',
  },
  {
    title: 'Your home, your design',
    text: 'Plots from 969 to 1,744 sq ft. Build the house you have in mind, in your own time.',
    photo: '1600585154340-be6161a56a0c',
    alt: 'A modern house with warm lights under a big tree at dusk',
  },
  {
    title: 'Papers in your hand',
    text: 'A government-approved layout and a registered sale deed. We help with the mutation after the registry.',
    photo: '1560518883-ce09059eeffa',
    alt: 'House keys resting beside a small model house',
  },
  {
    title: 'Land that stays yours',
    text: 'Open land in Hardoi, inside the Lucknow State Capital Region. Something you pass on.',
    photo: '1500382017468-9049fed747ef',
    alt: 'A golden field at sunrise',
  },
];

const N = cards.length;
/** Cards fanned out behind the top one; the rest wait invisibly at the back. */
const VISIBLE = 4;
const INTERVAL = 5000;
/** Drag distance (px) that counts as a swipe; anything under TAP is a click. */
const SWIPE = 60;
const TAP = 6;

const img = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const pad = (i: number) => String(i + 1).padStart(2, '0');

type Dir = 'next' | 'prev';
interface Anim {
  idx: number;
  kind: 'out' | 'in';
  dx: number;
}
type DeckStyle = CSSProperties & Record<`--${string}`, string | number>;

/** "Life at Madhuvan": a stack of photo cards. The top card flicks away to the back and the next one rises. */
export function LifeDeck() {
  const [active, setActive] = useState(0);
  const [anim, setAnim] = useState<Anim | null>(null);
  const [drag, setDrag] = useState<{ x: number; dx: number } | null>(null);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const activeRef = useRef(0);
  const busyUntil = useRef(0);
  const animTimer = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const indexRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)');

  const go = useCallback((target: number, dir: Dir, dx = 0) => {
    const now = performance.now();
    if (now < busyUntil.current) return;
    const from = activeRef.current;
    const to = ((target % N) + N) % N;
    if (to === from) return;
    busyUntil.current = now + 420;
    activeRef.current = to;
    setActive(to);
    setAnim(dir === 'next' ? { idx: from, kind: 'out', dx } : { idx: to, kind: 'in', dx });
    window.clearTimeout(animTimer.current);
    animTimer.current = window.setTimeout(() => setAnim(null), 720);
  }, []);
  const next = useCallback((dx = 0) => go(activeRef.current + 1, 'next', dx), [go]);
  const prev = useCallback(() => go(activeRef.current - 1, 'prev'), [go]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(animTimer.current), []);

  // Auto-advance only while the deck is on screen and nobody is interacting with it.
  const autoplay = inView && !hover && !focus && !drag && !reduceMotion;
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => next(), INTERVAL);
    return () => window.clearTimeout(t);
  }, [autoplay, active, next]);

  // Keep the active chip in view when the index scrolls sideways (phones).
  useEffect(() => {
    const list = indexRef.current;
    const btn = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !btn || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: btn.offsetLeft - (list.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ x: e.clientX, dx: 0 });
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag) setDrag({ x: drag.x, dx: e.clientX - drag.x });
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    setDrag(null);
    if (dx < -SWIPE) next(dx);
    else if (dx > SWIPE) prev();
    else if (Math.abs(dx) < TAP) next();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };
  // Pause for keyboard focus only; a mouse click should not stop the deck.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => setFocus(e.currentTarget.matches(':focus-visible'));

  return (
    <section ref={sectionRef} className="section deck" style={{ '--deck-interval': `${INTERVAL}ms` } as DeckStyle}>
      <div className="container deck__grid">
        <div className="deck__copy">
          <SectionHeading
            eyebrow="Life at Madhuvan"
            title={
              <>
                Picture your mornings <em>here.</em>
              </>
            }
            titleHi="सुबह की चाय, अपने घर के आँगन में।"
            lede="Seven things we are building into Madhuvan Enclave, and what they will feel like once you live here. Tap the cards to shuffle through."
          />
        </div>

        <div className="deck__nav">
          <ol className="deck__index" ref={indexRef}>
            {cards.map((c, i) => (
              <li key={c.title}>
                <button
                  type="button"
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => go(i, i > active ? 'next' : 'prev')}
                >
                  <i>{pad(i)}</i>
                  <span>{c.title}</span>
                  {i === active && autoplay && <b className="deck__progress" />}
                </button>
              </li>
            ))}
          </ol>
          <div className="deck__controls">
            <button type="button" className="deck__arrow" onClick={() => prev()} aria-label="Previous card">
              <ArrowLeft size={20} />
            </button>
            <button type="button" className="deck__arrow" onClick={() => next()} aria-label="Next card">
              <ArrowRight size={20} />
            </button>
            <span className="deck__count" aria-live="polite">
              <strong>{pad(active)}</strong> / {pad(N - 1)}
            </span>
            <span className="mock-tag">Sample photos</span>
          </div>
        </div>

        <Reveal className="deck__stage gold-frame gold-frame--right" delay={120}>
          <div
            className={`deck__cards ${drag ? 'is-dragging' : ''}`}
            role="group"
            aria-roledescription="carousel"
            aria-label="Life at Madhuvan Enclave"
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDrag(null)}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
            onPointerLeave={() => setHover(false)}
            onFocus={onFocus}
            onBlur={() => setFocus(false)}
            onKeyDown={onKeyDown}
          >
            {cards.map((c, i) => {
              const o = (i - active + N) % N;
              const isTop = o === 0;
              const kind = anim && anim.idx === i ? anim.kind : null;
              const style: DeckStyle = { '--o': o };
              if (kind === 'out') {
                style['--dx'] = `${anim!.dx}px`;
                style['--dr'] = `${anim!.dx / 18}deg`;
              }
              if (isTop && drag) {
                style.transform = `translate(${drag.dx}px, ${Math.abs(drag.dx) * 0.06}px) rotate(${drag.dx / 18}deg)`;
                style.transition = 'none';
              }
              const cls = ['deck__card'];
              if (o >= VISIBLE) cls.push('is-hidden');
              if (kind === 'out') cls.push('is-leaving');
              if (kind === 'in') cls.push('is-entering');
              return (
                <article key={c.title} className={cls.join(' ')} style={style} aria-hidden={!isTop}>
                  <img
                    src={img(c.photo, 900)}
                    srcSet={`${img(c.photo, 600)} 600w, ${img(c.photo, 900)} 900w, ${img(c.photo, 1400)} 1400w`}
                    sizes="(max-width: 1000px) calc(100vw - 72px), 540px"
                    alt={c.alt}
                    width={900}
                    height={1080}
                    loading={o < 2 ? 'eager' : 'lazy'}
                    draggable={false}
                  />
                  <span className="deck__num">{pad(i)}</span>
                  <div className="deck__caption">
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
