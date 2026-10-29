// Page content. Facts about Hardoi, registration and loans come from the sources listed in
// `sources` (checked October 2026).

/* ---------------------------------------------------------------- Amenities */

export type AmenityIcon =
  | 'shield'
  | 'guard'
  | 'cctv'
  | 'road'
  | 'drain'
  | 'water'
  | 'light'
  | 'park'
  | 'track'
  | 'play'
  | 'approved'
  | 'title'
  | 'bank'
  | 'pin';

export interface Amenity {
  icon: AmenityIcon;
  title: string;
  text: string;
}

export const amenityGroups: { title: string; items: Amenity[] }[] = [
  {
    title: 'Safety & security',
    items: [
      { icon: 'shield', title: 'Gated society', text: 'One controlled entrance with separate in and out lanes and boom barriers.' },
      { icon: 'guard', title: '24×7 guard', text: 'Guard cabins at the main gate, staffed round the clock.' },
      { icon: 'cctv', title: '24×7 CCTV', text: 'Cameras covering the entrance and the internal roads.' },
    ],
  },
  {
    title: 'Roads & infrastructure',
    items: [
      { icon: 'road', title: '12 m wide main road', text: 'A 12 m avenue from the gate, with 9 m and 7.5 m paved internal roads.' },
      { icon: 'drain', title: 'Underground drainage', text: 'Covered drains planned along the road network.' },
      { icon: 'water', title: 'Water supply', text: 'Water supply planned for every plot.' },
      { icon: 'light', title: 'Solar street lights', text: 'Solar-powered lighting on every road.' },
    ],
  },
  {
    title: 'Green & lifestyle',
    items: [
      { icon: 'park', title: 'Two landscaped parks', text: 'A 3,162 m² central park and a second park with play equipment.' },
      { icon: 'track', title: 'Jogging path', text: 'A walking and jogging loop inside the central park.' },
      { icon: 'play', title: "Kids' play area", text: 'Safe, open play spaces close to home.' },
    ],
  },
  {
    title: 'Peace of mind',
    items: [
      { icon: 'approved', title: 'Govt. approved layout', text: 'Our planned residential layout; approval documents in our Trust Center.' },
      { icon: 'title', title: 'Clear legal titles', text: 'Clear title and a hassle-free registry process.' },
      { icon: 'bank', title: 'Bank loan support', text: 'We are supported by Bank of India, Hardoi Zone.' },
      { icon: 'pin', title: 'Prime location', text: 'On RTO Road, near Lucknow Chungi, opposite Anand Adhiyaan Hospital.' },
    ],
  },
];

/* ---------------------------------------------------------------- Location */

export const distances = [
  { place: 'Lucknow', km: '110 km', note: 'by road' },
  { place: 'Sitapur', km: '72 km', note: 'by road' },
  { place: 'Kanpur', km: '140 km', note: 'by road' },
  { place: 'Delhi', km: '394 km', note: 'by road' },
];

export const connectivity = [
  {
    title: 'Ganga Expressway',
    text: 'The 594 km, six-lane Meerut–Prayagraj expressway passes through Hardoi district. It was inaugurated on 29 April 2026.',
    source: 'newsonair',
  },
  {
    title: 'NH-731',
    text: 'The Lucknow–Hardoi–Shahjahanpur national highway, being widened to four lanes.',
    source: 'jagran',
  },
  {
    title: 'Hardoi Railway Station',
    text: 'On the Lucknow–Moradabad–Delhi main line of Northern Railway, with direct trains to Lucknow and Delhi.',
    source: 'railway',
  },
  {
    title: 'Lucknow State Capital Region',
    text: 'Hardoi is one of six districts in the Lucknow State Capital Region, notified in July 2024 for planned growth.',
    source: 'scr',
  },
  {
    title: 'Healthcare',
    text: 'Anand Adhiyaan Hospital is right opposite the enclave; the Autonomous State Medical College, Hardoi has run since 2021.',
    source: 'medical',
  },
  {
    title: 'Nearest airport',
    text: 'Chaudhary Charan Singh International Airport, Lucknow.',
    source: 'district',
  },
];

/* ---------------------------------------------------------------- How to buy */

export const buySteps = [
  {
    title: 'Visit the site',
    text: 'Call or WhatsApp to fix a time. See the gate, walk the roads and stand on the plot you like.',
  },
  {
    title: 'Choose your plot',
    text: 'Use the plot map to compare size, facing and availability. We confirm the latest status.',
  },
  {
    title: 'Check the documents',
    text: 'See the papers in our Trust Center and verify land records yourself on UP Bhulekh and IGRS UP.',
  },
  {
    title: 'Book & get allotment',
    text: 'Pay the booking amount against our signed receipt and receive your allotment letter and payment schedule.',
  },
  {
    title: 'Arrange your loan',
    text: 'Bank of India, Hardoi Zone supports the project. Plot loans need a declaration that you will build a house.',
  },
  {
    title: 'Registry',
    text: 'The sale deed is registered at the Sub-Registrar office, Hardoi. Stamp duty and a 1% registration fee apply.',
  },
  {
    title: 'Mutation',
    text: 'Apply to the Tehsildar to enter your name in the khatauni. Undisputed cases are expected to finish in about 45 days.',
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Is the layout government approved?',
    a: 'Yes — our layout is a government-approved residential layout. We are publishing the approval papers in our Trust Center; until then you can see the originals at our site office.',
  },
  {
    q: 'Can I get a bank loan for a plot?',
    a: 'Yes. We are supported by Bank of India, Hardoi Zone. Under RBI rules, banks lend for a plot only when you declare that you will build a house on it, and they finance part of the value (the loan-to-value limit) — the rest is your own contribution.',
  },
  {
    q: 'What will the registry cost?',
    a: 'In Uttar Pradesh, stamp duty is 7% for men and 6% for women (the women’s concession applies to property worth up to ₹1 crore), plus a 1% registration fee. Duty is charged on the higher of the circle rate and the agreed price. Use the estimator on this page for a quick figure.',
  },
  {
    q: 'How much do I pay at booking?',
    a: 'We share the booking amount and payment schedule in writing at our site office.',
  },
  {
    q: 'How do I check the land records myself?',
    a: 'Search the khatauni on upbhulekh.gov.in by district, tehsil and village; search registered deeds and the encumbrance certificate on igrsup.gov.in; and check for revenue-court cases on vaad.up.nic.in. Online copies are for reference — certified copies come from the tehsil.',
  },
  {
    q: 'What is mutation (dakhil-kharij)?',
    a: 'After registry, the buyer’s name replaces the seller’s in the khatauni. The Tehsildar orders it under the UP Revenue Code, 2006; undisputed cases are expected to be done in about 45 days.',
  },
  {
    q: 'Which documents do I need for the registry?',
    a: 'Aadhaar and PAN, photographs, proof of stamp-duty payment and two witnesses. Since 1 February 2026, Aadhaar authentication of buyers, sellers and witnesses is mandatory at UP sub-registrar offices.',
  },
];

/* ---------------------------------------------------------------- Trust Center */

export type DocStatus = 'soon' | 'office';

export interface TrustDoc {
  title: string;
  what: string;
  issuer: string;
  status: DocStatus;
}

export const trustGroups: { id: string; title: string; docs: TrustDoc[] }[] = [
  {
    id: 'approvals',
    title: 'Approvals & registration',
    docs: [
      { title: 'Approved layout plan', what: 'The government-approved plan showing every plot, road and park.', issuer: 'Approving authority, Hardoi', status: 'office' },
      { title: 'Layout approval / NOC letter', what: 'The letter approving the layout for residential plotting.', issuer: 'Regulated Area authority, Hardoi', status: 'soon' },
      { title: 'Land-use declaration (Section 80)', what: 'Declares the land for non-agricultural (residential) use.', issuer: 'SDM, under the UP Revenue Code 2006', status: 'soon' },
      { title: 'Utility & access NOCs', what: 'No-objection certificates for services and road access, where applicable.', issuer: 'Respective departments', status: 'soon' },
    ],
  },
  {
    id: 'land',
    title: 'Land & title',
    docs: [
      { title: 'Title deeds (chain)', what: 'Registered sale deeds showing how the land came to the current owner.', issuer: 'Sub-Registrar, Hardoi', status: 'office' },
      { title: 'Certified khatauni', what: 'Current record of rights showing the owner and land class.', issuer: 'Tehsil, Hardoi', status: 'office' },
      { title: 'Encumbrance certificate (12 years)', what: 'Shows the land is free of registered loans or claims.', issuer: 'IGRS UP', status: 'soon' },
      { title: 'Revenue-court search', what: 'Printout showing no pending revenue-court case on the land.', issuer: 'RCCMS (vaad.up.nic.in)', status: 'soon' },
    ],
  },
  {
    id: 'bank',
    title: 'Bank & pricing',
    docs: [
      { title: 'Bank of India support letter', what: 'The bank’s project approval / tie-up for buyer home loans.', issuer: 'Bank of India, Hardoi Zone', status: 'soon' },
      { title: 'Circle-rate extract', what: 'The government circle rate for the area, used for stamp duty.', issuer: 'District administration / IGRS UP', status: 'soon' },
    ],
  },
  {
    id: 'buyer',
    title: 'Buyer documents (formats)',
    docs: [
      { title: 'Booking form & allotment letter', what: 'The forms you sign and receive when you book a plot.', issuer: 'Madhuvan Enclave', status: 'soon' },
      { title: 'Draft agreement for sale', what: 'Terms of sale, payment schedule and possession, before you commit.', issuer: 'Madhuvan Enclave', status: 'soon' },
      { title: 'Draft sale deed', what: 'The deed that will be registered in your name.', issuer: 'Madhuvan Enclave', status: 'soon' },
      { title: 'Payment receipt format', what: 'Every payment you make is acknowledged on this signed receipt.', issuer: 'Madhuvan Enclave', status: 'soon' },
    ],
  },
];

export const verifyPortals = [
  {
    name: 'UP Bhulekh',
    url: 'https://upbhulekh.gov.in/',
    text: 'Pick district, tehsil and village, then search the khatauni by khasra number or owner name.',
  },
  {
    name: 'IGRS UP',
    url: 'https://igrsup.gov.in/',
    text: 'Search registered deeds, get the encumbrance certificate and check circle rates.',
  },
  {
    name: 'RCCMS (Vaad)',
    url: 'https://vaad.up.nic.in/',
    text: 'Check whether any revenue-court case is pending on the land.',
  },
];

/* ---------------------------------------------------------------- Owners */

export interface Owner {
  name: string;
  role: string;
  phone: string;
  photo: string;
  /** Where the face sits in the photo (CSS object-position / transform-origin) and how much to zoom
   *  in when the photo is shown small. */
  focus: string;
  zoom: number;
}

/** Both owners are listed equally. */
export const owners: Owner[] = [
  { name: 'Raj Kishor Gupta', role: 'Owner', phone: '8090681640', photo: '/assets/raj-kishor-gupta.jpg', focus: '74% 70%', zoom: 2.4 },
  { name: 'Lucky', role: 'Owner', phone: '9415149512', photo: '/assets/lucky.jpg', focus: '48% 30%', zoom: 1.5 },
];

/* ---------------------------------------------------------------- Sources */

export const sources: Record<string, { label: string; url: string }> = {
  district: { label: 'District Hardoi — How to reach', url: 'https://hardoi.nic.in/how-to-reach/' },
  newsonair: { label: 'All India Radio — Ganga Expressway inaugurated', url: 'https://newsonair.gov.in/pm-modi-inaugurates-594-km-long-ganga-expressway-connecting-meerut-to-prayagraj/' },
  jagran: { label: 'Daily Jagran — Lucknow–Bareilly highway four-laning', url: 'https://www.thedailyjagran.com/uttar-pradesh/lucknowbareilly-highway-rs-4584-cr-four-lane-project-to-cut-travel-time-completion-by-midaugust-10254448' },
  railway: { label: 'Hardoi railway station', url: 'https://en.wikipedia.org/wiki/Hardoi_railway_station' },
  scr: { label: 'Business Today — Lucknow State Capital Region', url: 'https://www.businesstoday.in/amp/india/story/up-constitutes-lucknow-state-capital-region-on-lines-of-delhi-ncr-to-boost-urban-development-decongest-city-437911-2024-07-20' },
  medical: { label: 'Autonomous State Medical College, Hardoi', url: 'https://en.wikipedia.org/wiki/Autonomous_State_Medical_College,_Hardoi' },
  stamp: { label: 'All India Radio — women’s stamp-duty concession up to ₹1 crore', url: 'https://www.newsonair.gov.in/up-cabinet-approves-1-stamp-duty-exemption-for-women-on-property-worth-up-to-1-crore-rupees' },
  rbi: { label: 'RBI — Master Circular on housing finance', url: 'https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12824' },
};

/* ---------- Banks that lend for plots here (Home loans page) ---------- */
export interface BankOfficer {
  name: string;
  role: string;
  phone: string;
}

export interface Bank {
  id: string;
  name: string;
  /** Short form shown in the card's monogram. */
  short: string;
  kind: string;
  branch: string;
  website: string;
  products: string[];
  /** Officers who handle Madhuvan Enclave buyers — from our site banner. Empty until we have the branch contact. */
  officers: BankOfficer[];
}

export const banks: Bank[] = [
  {
    id: 'boi',
    name: 'Bank of India',
    short: 'BOI',
    kind: 'Public sector bank',
    branch: 'Hardoi Zone',
    website: 'https://bankofindia.co.in',
    products: ['Plot loan, with a declaration that you will build a house', 'Home loan for the construction afterwards'],
    officers: [
      { name: 'Amrendra Kumar', role: 'RBC Head (Retail Business Centre)', phone: '8957326126' },
      { name: 'Pallavi Shekhar', role: 'Chief Manager', phone: '8439436264' },
    ],
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    short: 'SBI',
    kind: 'Public sector bank',
    branch: 'Hardoi',
    website: 'https://sbi.co.in',
    products: ['Plot loan, with a declaration that you will build a house', 'Home loan for the construction afterwards'],
    officers: [],
  },
];
