export type GalleryCategory = 'design' | 'site' | 'creatives' | 'progress';

export const galleryCategories: { id: GalleryCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'design', label: 'Gate & design' },
  { id: 'site', label: 'Site photos' },
  { id: 'creatives', label: 'Brochure & posts' },
  { id: 'progress', label: 'Construction updates' },
];

/** Posts from @madhuvanenclave on Instagram. */
export const galleryPosts = [
  { src: '/instagram/dream-home.jpg', alt: 'Your dream home, our promise — with the Madhuvan Enclave gate', id: 'DVKwhjkkvP_', title: 'Your dream home, our promise' },
  { src: '/instagram/bharosa.jpg', alt: 'Ghar sirf char deewari nahi hoti, ek bharosa hota hai', id: 'DUEM5WREyf6', title: 'Ek bharosa hota hai' },
  { src: '/instagram/location.jpg', alt: 'Location is everything — near Lucknow Chungi, RTO office, mall, petrol pump and hospital', id: 'DU2bQZ4Ecqh', title: 'Location is everything' },
  { src: '/instagram/chai-akhbaar.jpg', alt: 'Chai ki chuski, akhbaar ki surkhi aur Hardoi ka bharosa', id: 'DUHjyvCk3rN', title: 'हरदोई का भरोसा' },
  { src: '/instagram/land-legacy.jpg', alt: 'Your land, your legacy', id: 'DUG0bMRE7Zb', title: 'Your land, your legacy' },
];

/** Placeholders for photo sets still to come. */
export const upcoming: { category: GalleryCategory; label: string }[] = [
  { category: 'site', label: 'Main gate — site photo' },
  { category: 'site', label: 'Site office' },
  { category: 'site', label: '12 m main road' },
  { category: 'site', label: 'Central park' },
  { category: 'site', label: 'Plots & boundary wall' },
  { category: 'site', label: 'Aerial view' },
  { category: 'progress', label: 'Road work' },
  { category: 'progress', label: 'Drainage work' },
  { category: 'progress', label: 'Street lights' },
];
