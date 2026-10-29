import { Link } from 'react-router';
import { PageHeader } from '../components/ui/PageHeader';
import { site } from '../data/site';
import './pages.css';

export function Disclaimer() {
  return (
    <>
      <PageHeader
        crumb="Disclaimer & privacy"
        eyebrow="Legal"
        title={<>Disclaimer & privacy</>}
      />
      <section className="section">
        <div className="container prose" style={{ maxWidth: 820 }}>
          <h2 className="amenity-group__title">Disclaimer</h2>
          <p>
            This is our official website — {site.name}, Hardoi. The plans, layout drawings, 3D views, illustrations and
            images on this website are indicative and for general information only. The final layout, plot dimensions,
            specifications and availability are as per the approved plan and the records at our site office.
          </p>
          <p>
            We update plot availability on the map periodically and it may change at any time. Please confirm the
            latest status, price and terms in writing with us before making any payment.
          </p>
          <p>
            We provide the information about stamp duty, registration, loans and government portals in good faith from
            public sources; it may change. It is not legal or financial advice — please verify with the relevant authority, your
            bank or a lawyer.
          </p>
          <h2 className="amenity-group__title" style={{ marginTop: 40 }}>
            Privacy
          </h2>
          <p>
            We do not store the details you type into the enquiry form. Sending an enquiry opens WhatsApp or
            your email app with your details filled in; you choose whether to send it. The location map is provided by
            Google Maps, which has its own privacy policy.
          </p>
          <p>
            Questions? <Link to="/contact">Contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="section" style={{ paddingTop: 'calc(var(--nav-h) + 80px)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="eyebrow eyebrow--center">404</p>
        <h1 className="display">This page doesn’t exist.</h1>
        <p className="lede" style={{ marginInline: 'auto' }}>
          The link may be old. Head back home or open the plot map.
        </p>
        <p className="center-link">
          <Link className="btn" to="/">
            Go home
          </Link>{' '}
          <Link className="btn btn--ghost" to="/plots">
            Plot map
          </Link>
        </p>
      </div>
    </section>
  );
}
