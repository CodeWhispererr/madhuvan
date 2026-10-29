import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { AmenityIcon } from '../components/ui/AmenityIcon';
import { PageHeader } from '../components/ui/PageHeader';
import { amenityGroups } from '../data/content';
import './pages.css';

export function Amenities() {
  return (
    <>
      <PageHeader
        crumb="Amenities"
        eyebrow="Features & amenities"
        title={
          <>
            Sukoon, suraksha <em>aur suvidha.</em>
          </>
        }
        titleHi="मधुवन एन्क्लेव, जहाँ सुकून, सुरक्षा और सुविधा तीनों मिलते हैं।"
        lede="Everything a good society should have — planned into our layout from day one, not promised for later."
      />

      <section className="section">
        <div className="container">
          {amenityGroups.map((g) => (
            <div key={g.title} className="amenity-group">
              <h2 className="amenity-group__title">
                {g.title}
              </h2>
              <ul className="card-grid">
                {g.items.map((a, i) => (
                  <Reveal as="li" key={a.title} delay={i * 70} className="card card--hover amenity-tile">
                    <span className="icon-chip">
                      <AmenityIcon name={a.icon} />
                    </span>
                    <div>
                      <strong>{a.title}</strong>
                      <p>{a.text}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
          <p className="center-link">
            <Link className="btn" to="/plots">
              Find your plot <ArrowRight size={18} />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
