export type PlotStatus = 'available' | 'booked' | 'sold';

/** Set to false once `statusOverrides` reflects the site office's real booking register. */
export const STATUS_IS_SAMPLE = true;

const sold = [
  1, 2, 3, 5, 8, 12, 13, 14, 15, 18, 19, 21, 24, 26, 27, 30, 35, 36, 38, 41, 47, 48, 50, 52, 57, 58, 60, 66, 67,
  69, 72, 78, 79, 81, 84, 90, 91, 93, 96, 99, 106, 107, 109, 112, 120, 121, 123, 129, 130, 131, 133, 136, 142, 143,
];
const booked = [4, 10, 20, 29, 40, 55, 62, 70, 86, 101, 115, 125, 138, 146];

/** Every plot not listed here is available. In version 2 this comes from the admin panel. */
export const statusOverrides: Record<number, PlotStatus> = Object.fromEntries([
  ...sold.map((n) => [n, 'sold'] as const),
  ...booked.map((n) => [n, 'booked'] as const),
]);

export const statusLabel: Record<PlotStatus, string> = {
  available: 'Available',
  booked: 'Booked',
  sold: 'Sold',
};
