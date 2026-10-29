# Madhuvan Enclave — website (v1)

Bilingual (English + Hindi) website for Madhuvan Enclave, a govt.-approved residential layout on RTO Road near
Lucknow Chungi, Hardoi.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero with the gate, at-a-glance facts, previews of every section |
| `/about` | About the project, values, gate design, plot sizes |
| `/plots` | Interactive plot map (2D plan + 3D view), filters, plot details |
| `/amenities` | Amenities, grouped |
| `/location` | Map, nearby places, distances and connectivity (with sources) |
| `/how-to-buy` | 7-step buyer's guide, registry cost estimator, loans, FAQ |
| `/home-loans` | Banks that lend here with their loan officers, how a plot loan works, EMI estimator |
| `/gallery` | Gate drawings, master plan, Instagram posts, placeholders for site photos |
| `/trust-center` | Document list (uploads pending), official portals to verify records, safety tips |
| `/owners` | Owner profiles and founder's message — **placeholders** |
| `/contact` | Owners’ numbers, enquiry form (WhatsApp / email), site office and map |
| `/disclaimer` | Disclaimer & privacy |

Because this is a single-page app, the host must send every route to `index.html`.
`netlify.toml` already does this (plus the build command and publish folder), so on Netlify it is
"Add new site → Import from GitHub → pick this repo → Deploy" with no settings to fill in.
On Vercel, add a rewrite to `/index.html`.

## Where to edit content

| What | File |
| --- | --- |
| Address, phones, email, Instagram, bank, nearby places | `src/data/site.ts` |
| Amenities, distances, buying steps, FAQ, Trust Center documents, owners, banks & loan officers, sources | `src/data/content.ts` |
| Which plots are sold / booked | `src/data/plotStatus.ts` (set `STATUS_IS_SAMPLE` to `false` once real) |
| Plot shapes, roads, parks, compass direction | `src/data/layout.ts` |
| “Life at Madhuvan” cards (home) | `src/components/LifeDeck.tsx` — `cards[]`; `photo` ids are **Unsplash placeholders** until we have site photos |
| Gallery items | `src/pages/galleryData.ts` + images in `public/instagram/` |

**Placeholders to replace:** contact photos, site photos and construction updates in the gallery, and each Trust Center
document (set its `status` and add a PDF link). Owners live in `content.ts` → `owners` with photos in `public/assets/`.

The plot map is traced from a straightened photo of the approved layout plan (metres): the 12 m road leaves RTO Road
at 54.5°, the 57–64 and 120–128 columns lean ~12°, and the boundary, park notch and the bent road along plots 106–119
follow the drawing. Plot sizes, counts and road widths use the plan's dimensions. `PLAN_UP_BEARING = 23` sets true north from
the compass reading at plot 78 (203°), and the east column's lean is set so plot 61 reads 310°; facings use a 16-point
compass. The sunlight view (`src/lib/sun.ts`) computes the sun's position over Hardoi for any month and time and
how squarely it strikes each plot's front.

The 3D view (three.js) and the gallery lightbox load only when opened, so the first page load stays light.

## Version 2 (planned)

- Resident side: log in, raise and track complaints.
- Admin side: mark plots sold / booked, record payments (bank vs cash), manage complaints.
- `plotStatus.ts` is the seam: replace the static list with data from the admin API and the map updates as-is.
