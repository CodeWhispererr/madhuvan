import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { SiteLayout } from './components/layout/SiteLayout';
import { About } from './pages/About';
import { Amenities } from './pages/Amenities';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { HomeLoans } from './pages/HomeLoans';
import { HowToBuy } from './pages/HowToBuy';
import { Disclaimer, NotFound } from './pages/Legal';
import { Location } from './pages/Location';
import { Owners } from './pages/Owners';
import { Plots } from './pages/Plots';
import { TrustCenter } from './pages/TrustCenter';

// The gallery pulls in the lightbox, so it loads on demand.
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })));

// Version 2 adds the resident portal (complaints) and the admin side (plot sales, payments) as further routes.
export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="plots" element={<Plots />} />
        <Route path="amenities" element={<Amenities />} />
        <Route path="location" element={<Location />} />
        <Route path="how-to-buy" element={<HowToBuy />} />
        <Route path="home-loans" element={<HomeLoans />} />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<div className="section container">Loading gallery…</div>}>
              <Gallery />
            </Suspense>
          }
        />
        <Route path="trust-center" element={<TrustCenter />} />
        <Route path="owners" element={<Owners />} />
        <Route path="contact" element={<Contact />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
