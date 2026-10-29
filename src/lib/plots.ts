import { PLAN_UP_BEARING, plots as plotShapes, type PlotShape, type PlotSize, type Pt } from '../data/layout';
import { statusOverrides, type PlotStatus } from '../data/plotStatus';
import { sunProfile, type SunProfile } from './sun';

const SQFT_PER_M2 = 10.7639;
const SQYD_PER_M2 = 1.19599;

// 16-point compass, so site readings like "SSW" and "NW" come out exactly.
const DIRECTIONS = [
  'North', 'North-North-East', 'North-East', 'East-North-East',
  'East', 'East-South-East', 'South-East', 'South-South-East',
  'South', 'South-South-West', 'South-West', 'West-South-West',
  'West', 'West-North-West', 'North-West', 'North-North-West',
];
export const SHORT = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

const normalise = (bearing: number) => ((bearing % 360) + 360) % 360;
export const directionIndex = (bearing: number) => Math.round(normalise(bearing) / 22.5) % 16;
export const directionName = (bearing: number) => DIRECTIONS[directionIndex(bearing)];
export const directionShort = (bearing: number) => SHORT[directionIndex(bearing)];

// What the sun does on each kind of front (by 45° sector of the main facing).
const SUN_NOTES: string[] = [
  'Soft, glare-free daylight most of the year. The front gets direct sun only on summer mornings and evenings, so it stays cooler in Hardoi’s hot months. Considered auspicious in Vastu.',
  'Gentle morning sun with a cool, shaded front through the afternoon. North-east is the most favoured direction in Vastu.',
  'Fresh morning sun all year and a shaded front in the afternoon heat. Considered auspicious in Vastu.',
  'Sun from early morning to early afternoon all year — bright and warm in winter.',
  'The sunniest front: long, warm winter sun. The high summer sun is easy to shade with a chhajja (overhang).',
  'Late-morning to evening sun; the front warms up on summer afternoons, so plan for shading.',
  'Afternoon and evening sun. Warm on summer evenings — a verandah or trees on the front help.',
  'Afternoon and evening sun in summer, gentle light in winter.',
];

export const sizeLabel: Record<PlotSize, string> = {
  '9x18': '9 × 18 m',
  '7.5x15': '7.5 × 15 m',
  '7.5x12': '7.5 × 12 m',
};

export interface PlotInfo {
  no: number;
  polygon: Pt[];
  points: string;
  centroid: Pt;
  size: PlotSize;
  sizeLabel: string;
  irregular: boolean;
  areaM2: number;
  areaSqft: number;
  areaGaj: number;
  status: PlotStatus;
  road: string;
  /** True compass bearings (degrees) of the road-facing side(s). */
  bearings: number[];
  /** Bearing of the main front, rounded, e.g. 308. */
  bearing: number;
  facing: string;
  facingShort: string;
  corner: boolean;
  parkFacing: boolean;
  sun: SunProfile;
  sunNote: string;
}

function polygonArea(poly: readonly Pt[]) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

export function centroid(poly: readonly Pt[]): Pt {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    const cross = x1 * y2 - x2 * y1;
    a += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  return [cx / (3 * a), cy / (3 * a)];
}

export const toPoints = (poly: readonly Pt[]) => poly.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

function build(shape: PlotShape): PlotInfo {
  const areaM2 = polygonArea(shape.polygon);
  const fronts = [shape.front, ...(shape.extraFronts ?? [])];
  const bearings = fronts.map((b) => normalise(b + PLAN_UP_BEARING));
  const corner = fronts.length > 1;
  const names = Array.from(new Set(bearings.map(directionName)));
  return {
    no: shape.no,
    polygon: shape.polygon,
    points: toPoints(shape.polygon),
    centroid: centroid(shape.polygon),
    size: shape.size,
    sizeLabel: shape.irregular ? `${sizeLabel[shape.size]} · corner` : sizeLabel[shape.size],
    irregular: Boolean(shape.irregular),
    areaM2,
    areaSqft: areaM2 * SQFT_PER_M2,
    areaGaj: areaM2 * SQYD_PER_M2,
    status: statusOverrides[shape.no] ?? 'available',
    road: shape.road,
    bearings,
    bearing: Math.round(bearings[0]),
    facing: names.join(' + '),
    facingShort: directionShort(bearings[0]),
    corner,
    parkFacing: Boolean(shape.parkFacing),
    sun: sunProfile(bearings),
    sunNote: SUN_NOTES[Math.round(normalise(bearings[0]) / 45) % 8],
  };
}

export const plotInfos: PlotInfo[] = plotShapes.map(build);
export const plotByNo = new Map(plotInfos.map((p) => [p.no, p]));

export function countByStatus(list: readonly PlotInfo[] = plotInfos) {
  const counts: Record<PlotStatus, number> = { available: 0, booked: 0, sold: 0 };
  for (const p of list) counts[p.status] += 1;
  return counts;
}

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits });
