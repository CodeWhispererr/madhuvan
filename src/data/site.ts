// Single source of truth for the society's public details.
// Sourced from the Instagram page (@madhuvanenclave), the on-site banner and the layout plan.

export interface Nearby {
  name: string;
  detail: string;
  kind: 'road' | 'office' | 'mall' | 'fuel' | 'hospital';
}

export const site = {
  name: 'Madhuvan Enclave',
  shortTagline: 'Your land. Your legacy.',
  hindiTagline: 'घर सिर्फ चार दीवारी नहीं होती, एक भरोसा होता है।',
  hinglishTagline: "Jahan zameen hai 'Sona'.",
  promiseHindi: 'बेहतर प्लानिंग, बेहतरीन लोकेशन, सुरक्षित भविष्य!',
  pillars: ['Well planned', 'Secure', 'Green', 'Future ready'],

  address: {
    line1: 'Near Lucknow Chungi, RTO Road',
    line2: 'In front of Anand Adhiyaan Hospital',
    city: 'Hardoi, Uttar Pradesh',
    mapQuery: 'Lucknow Chungi, RTO Road, Hardoi, Uttar Pradesh',
  },

  email: 'madhuvanenclave10@gmail.com',
  instagram: {
    handle: 'madhuvanenclave',
    url: 'https://www.instagram.com/madhuvanenclave/',
  },
  // Raj Kishor Gupta's number — every call and WhatsApp button on the site uses it.
  primaryPhone: '8090681640',

  bank: {
    name: 'Bank of India',
    zone: 'Hardoi Zone',
    note: 'We are supported by Bank of India — home-loan assistance available for buyers.',
  },

  nearby: [
    { name: 'Anand Adhiyaan Hospital', detail: 'Right opposite the enclave', kind: 'hospital' },
    { name: 'Lucknow Chungi', detail: 'Moments away on RTO Road', kind: 'road' },
    { name: 'RTO Office', detail: 'On the same road', kind: 'office' },
    { name: 'Shopping mall', detail: 'Close by', kind: 'mall' },
    { name: 'Petrol pump', detail: 'Close by', kind: 'fuel' },
  ] satisfies Nearby[],
} as const;

export const telHref = (phone: string) => `tel:+91${phone}`;
export const waHref = (phone: string, text: string) =>
  `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
export const formatPhone = (phone: string) => `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
