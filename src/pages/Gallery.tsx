import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { ArrowUpRight, Expand, ImagePlus } from 'lucide-react';
import { GateIllustration } from '../components/GateIllustration';
import { InstagramIcon } from '../components/InstagramIcon';
import { Reveal } from '../components/Reveal';
import { SiteMap } from '../components/explorer/SiteMap';
import { MockPhoto } from '../components/ui/MockPhoto';
import { PageHeader } from '../components/ui/PageHeader';
import { site } from '../data/site';
import { plotInfos } from '../lib/plots';
import { galleryCategories, galleryPosts, upcoming, type GalleryCategory } from './galleryData';
import './pages.css';
import './Gallery.css';

type Tile =
  | { kind: 'post'; category: GalleryCategory; index: number }
  | { kind: 'design'; category: GalleryCategory; id: 'gate' | 'blueprint' | 'plan'; title: string; to: string }
  | { kind: 'mock'; category: GalleryCategory; label: string };

const post = (index: number): Tile => ({ kind: 'post', category: 'creatives', index });

// Real artwork first, then the placeholders for photos still to come.
const tiles: Tile[] = [
  { kind: 'design', category: 'design', id: 'gate', title: 'Main gate — front elevation', to: '/about#gate' },
  post(0),
  { kind: 'design', category: 'design', id: 'plan', title: 'Master plan — 149 plots', to: '/plots' },
  post(1),
  post(2),
  { kind: 'design', category: 'design', id: 'blueprint', title: 'Gate — architectural drawing', to: '/about#gate' },
  post(3),
  post(4),
  ...upcoming.map((u): Tile => ({ kind: 'mock', category: u.category, label: u.label })),
];

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | 'all'>('all');
  const [open, setOpen] = useState(-1);
  const visible = useMemo(() => tiles.filter((t) => filter === 'all' || t.category === filter), [filter]);
  const slides = galleryPosts.map((p) => ({ src: p.src, alt: p.alt, title: p.title, width: 720, height: 900 }));

  return (
    <>
      <PageHeader
        crumb="Gallery"
        eyebrow="Gallery"
        title={
          <>
            Madhuvan, <em>in pictures.</em>
          </>
        }
        lede="The gate design, the master plan, our posters — and soon, photos from the site."
      >
        <a className="btn btn--light" href={site.instagram.url} target="_blank" rel="noreferrer">
          <InstagramIcon size={18} /> Follow @{site.instagram.handle}
        </a>
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className="notice gallery__notice">
            <ImagePlus size={22} />
            <div>
              <strong>Site photos and construction updates are coming soon.</strong>
            </div>
          </div>

          <div className="tabs" role="tablist" aria-label="Gallery categories">
            {galleryCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                className={filter === c.id ? 'is-active' : ''}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ul className="mosaic">
            {visible.map((t, i) => (
              <Reveal as="li" key={`${t.kind}-${i}-${filter}`} delay={(i % 3) * 70} className={`mosaic__item mosaic__item--${t.kind}`}>
                {t.kind === 'post' && (
                  <button type="button" className="mosaic__btn" onClick={() => setOpen(t.index)} aria-label={`Open: ${galleryPosts[t.index].title}`}>
                    <img src={galleryPosts[t.index].src} alt={galleryPosts[t.index].alt} loading="lazy" width={720} height={900} />
                    <span className="mosaic__icon">
                      <Expand size={18} />
                    </span>
                  </button>
                )}
                {t.kind === 'design' && (
                  <Link to={t.to} className={`mosaic__design mosaic__design--${t.id}`}>
                    <div className="mosaic__art">
                      {t.id === 'gate' && <GateIllustration />}
                      {t.id === 'blueprint' && <GateIllustration variant="blueprint" />}
                      {t.id === 'plan' && <SiteMap plots={plotInfos} mode="size" preview />}
                    </div>
                    <span className="mosaic__caption">
                      <span>
                        {t.title}
                      </span>
                      <ArrowUpRight size={18} />
                    </span>
                  </Link>
                )}
                {t.kind === 'mock' && <MockPhoto label={`${t.label} — coming soon`} />}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Lightbox
        open={open >= 0}
        index={open}
        close={() => setOpen(-1)}
        slides={slides}
        plugins={[Captions, Zoom]}
        styles={{ container: { backgroundColor: 'rgba(8, 24, 16, 0.94)' } }}
      />
    </>
  );
}
