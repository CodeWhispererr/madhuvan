// Madhuvan Enclave layout, traced from the approved layout plan (service plan, scale 1:100).
//
// Units are metres. x runs along RTO Road towards Lucknow Chungi, y runs into the site
// (SVG convention: y grows downwards). The main gate — where the 12 m road meets RTO Road —
// is the origin. The photo of the plan was straightened and measured; plot sizes, road widths
// and plot counts follow the plan's dimensions, and the irregular boundary follows the drawing.

export type Pt = readonly [number, number];

/** True compass bearing of the drawing's "up" direction (the RTO Road side). Set from a compass
 *  reading on site: plot 78, whose row is parallel to RTO Road, faces exactly 203°. */
export const PLAN_UP_BEARING = 23;

export type PlotSize = '9x18' | '7.5x15' | '7.5x12';

export interface PlotShape {
  no: number;
  polygon: Pt[];
  size: PlotSize;
  /** Corner plots whose shape is cut by a road or the boundary. */
  irregular?: boolean;
  /** Drawing bearing (degrees clockwise from "up") of the side that opens onto the road. */
  front: number;
  /** Extra road frontages for corner plots. */
  extraFronts?: number[];
  road: string;
  parkFacing?: boolean;
}

export interface RoadShape {
  id: string;
  name: string;
  polygon: Pt[];
  main?: boolean;
  labels?: { at: Pt; angle: number; text: string }[];
}

export interface ParkShape {
  id: string;
  name: string;
  area?: string;
  polygon: Pt[];
  labelAt: Pt;
  track?: { cx: number; cy: number; rx: number; ry: number };
  features: { at: Pt; label: string }[];
}

/* ------------------------------------------------------------------ geometry helpers */

// The 12 m road leaves RTO Road at 54.5° and runs down-left. The orange rows (13–34, 35–46),
// the 90–105 column and the diagonal 9 m road are all parallel to it.
const THETA = (54.5 * Math.PI) / 180;
const SIN = Math.sin(THETA);
const COS = Math.cos(THETA);
/** Road frame: s = distance along the 12 m road from the gate, t = perpendicular offset
 *  (positive towards plots 47 / 35 / 90). */
const P = (s: number, t: number): Pt => [-s * COS + t * SIN, s * SIN + t * COS];
/** x of the line at perpendicular offset t from the 12 m road, at a given y. */
const xAt = (t: number, y: number) => t / SIN - y / Math.tan(THETA);
/** s along the road where the line at offset t reaches a given y. */
const sAt = (t: number, y: number) => (y - t * COS) / SIN;

const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k];
/** Drawing bearing (0 = up, clockwise) of a direction vector. */
const bearingOf = ([dx, dy]: Pt) => ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;

const ROAD_12 = '12 m wide road';
const ROAD_9 = '9 m road';
const ROAD_75 = '7.5 m road';
const MAIN = 'RTO Road (main road)';

const N = 0;
const S = 180;
/** Facing of plots on the west side of the 12 m road (they look across it, towards +t). */
const ACROSS_12 = bearingOf([SIN, COS]); // 125.5°
/** Facing of plots on the east side of the 12 m road (towards −t). */
const TO_12 = (ACROSS_12 + 180) % 360; // 305.5°

/* ------------------------------------------------------------------ lines that fix the geometry */

/** Lean of the east boundary and the 57–64 column. Set so that plot 61 faces exactly 310° on
 *  site (its drawing facing of 287° plus PLAN_UP_BEARING); the plan's 83.69 m line fits this. */
const LEAN1 = (17 * Math.PI) / 180;
/** East boundary beside plots 57–64, from plot 11's corner. */
const east = (y: number) => 106 - Math.tan(LEAN1) * y;
/** Vertical 9 m road and the 57–64 column hang off that line, leaning the same way. */
const U1: Pt = [-Math.sin(LEAN1), Math.cos(LEAN1)];
/** Horizontal width of a 15 m deep plot in that leaning column. */
const COL_W = 15 / U1[1];
const vRoadRight = (y: number) => east(y) - COL_W;
const vRoadLeft = (y: number) => vRoadRight(y) - 9 / U1[1];

/** South-east boundary beside plots 120–128 (the plan's 86.49 m line). */
const E2_TOP: Pt = [16, 153.5];
const E2_BOT: Pt = [-3.5, 240.4];
const east2 = (y: number) => E2_TOP[0] + ((E2_BOT[0] - E2_TOP[0]) * (y - E2_TOP[1])) / (E2_BOT[1] - E2_TOP[1]);
const U2 = ((): Pt => {
  const dx = E2_BOT[0] - E2_TOP[0];
  const dy = E2_BOT[1] - E2_TOP[1];
  const n = Math.hypot(dx, dy);
  return [dx / n, dy / n];
})();
const COL2_W = 15 / U2[1];
const col2Left = (y: number) => east2(y) - COL2_W;
const road2Left = (y: number) => col2Left(y) - 7.7;

/** Road E (9 m) crosses the 12 m road at its lower end; the plots 106–110 face it. */
const ROAD_E = [203.5, 212.5] as const;
/** The 7.5 m road along plots 111–119 bends away from road E at the diagonal road's junction. */
const F1 = P(ROAD_E[1], 44);
const DIR2: Pt = [Math.cos((21.5 * Math.PI) / 180), Math.sin((21.5 * Math.PI) / 180)];
const PERP2: Pt = [-DIR2[1], DIR2[0]]; // into the plots (down-left)
const F3 = add(F1, DIR2, 67.5);

/* ------------------------------------------------------------------ plots */

type RowExtras = Pick<PlotShape, 'size' | 'front' | 'road'>;

/** Plots laid west → east along y. */
function rowEast(first: number, count: number, x0: number, y0: number, w: number, d: number, extra: RowExtras) {
  return Array.from({ length: count }, (_, i): PlotShape => ({
    no: first + i,
    polygon: rect(x0 + i * w, y0, x0 + (i + 1) * w, y0 + d),
    ...extra,
  }));
}

/** Plots along the 12 m road direction between offsets t0 and t1, starting at s0. */
function rowDiag(first: number, count: number, s0: number, w: number, t0: number, t1: number, extra: RowExtras) {
  return Array.from({ length: count }, (_, i): PlotShape => {
    const a = s0 + i * w;
    return { no: first + i, polygon: [P(a, t0), P(a + w, t0), P(a + w, t1), P(a, t1)], ...extra };
  });
}

/** Plots side by side along a direction `dir` from `start`, `d` deep towards `perp`. */
function rowAlong(first: number, count: number, start: Pt, dir: Pt, perp: Pt, w: number, d: number, extra: RowExtras) {
  return Array.from({ length: count }, (_, i): PlotShape => {
    const a = add(start, dir, i * w);
    const b = add(start, dir, (i + 1) * w);
    return { no: first + i, polygon: [a, b, add(b, perp, d), add(a, perp, d)], ...extra };
  });
}

/** A leaning column of plots: `right` is the line the plots back onto, moving down `u`. */
function column(first: number, count: number, topRight: Pt, u: Pt, w: number, depth: number, extra: RowExtras, reverse = false) {
  const left: Pt = [-u[1], u[0]]; // perpendicular, pointing left (towards the road)
  return Array.from({ length: count }, (_, i): PlotShape => {
    const r0 = add(topRight, u, i * w);
    const r1 = add(topRight, u, (i + 1) * w);
    return {
      no: reverse ? first + count - 1 - i : first + i,
      polygon: [add(r0, left, depth), r0, r1, add(r1, left, depth)],
      ...extra,
    };
  });
}


/** A row between the 12 m road and the vertical 9 m road: equal 7.5 m plots in the middle,
 *  with the first and last plot taking the remaining width at each end. */
function rowBetween(first: number, last: number, y0: number, y1: number, extra: RowExtras): PlotShape[] {
  const n = last - first - 1;
  const ym = (y0 + y1) / 2;
  const left = (y: number) => xAt(6, y);
  const right = (y: number) => vRoadLeft(y);
  const start = left(ym) + (right(ym) - left(ym) - n * 7.5) / 2;
  const end = start + n * 7.5;
  return [
    { no: first, polygon: [[left(y0), y0], [start, y0], [start, y1], [left(y1), y1]], irregular: true, extraFronts: [TO_12], ...extra },
    ...rowEast(first + 1, n, start, y0, 7.5, y1 - y0, extra),
    { no: last, polygon: [[end, y0], [right(y0), y0], [right(y1), y1], [end, y1]], irregular: true, extraFronts: [bearingOf([U1[1], -U1[0]])], ...extra },
  ];
}

const rawPlots: PlotShape[] = [
  // RTO Road frontage. Plot 1's west side follows the 12 m road, plot 11's east side the boundary.
  { no: 1, polygon: [[xAt(6, 0), 0], [16, 0], [16, 18], [xAt(6, 18), 18]], size: '9x18', irregular: true, front: N, extraFronts: [TO_12], road: MAIN },
  ...rowEast(2, 9, 16, 0, 9, 18, { size: '9x18', front: N, road: MAIN }),
  { no: 11, polygon: [[97, 0], [106, 0], [east(18), 18], [97, 18]], size: '9x18', irregular: true, front: N, road: MAIN },
  // Plot 12 is the wedge between RTO Road and plot 13; 13–34 are regular plots down the west side of the 12 m road
  { no: 12, polygon: [[xAt(-24, 0), 0], [xAt(-6, 0), 0], P(25, -6), P(25, -24)], size: '9x18', irregular: true, front: N, extraFronts: [ACROSS_12], road: MAIN },
  ...rowDiag(13, 22, 25, 9, -6, -24, { size: '9x18', front: ACROSS_12, road: ROAD_12 }),
  // East side of the 12 m road, below road B
  { no: 35, polygon: [P(sAt(6, 81), 6), P(sAt(24, 81), 24), P(104, 24), P(104, 6)], size: '9x18', irregular: true, front: TO_12, road: ROAD_12 },
  ...rowDiag(36, 11, 104, 9, 6, 24, { size: '9x18', front: TO_12, road: ROAD_12 }),
  // Rows parallel to RTO Road: equal 7.5 m plots in the middle, the corner plots at both ends
  // take whatever is left between the 12 m road and the vertical 9 m road.
  ...rowBetween(47, 56, 18, 33, { size: '7.5x15', front: S, road: ROAD_9 }),
  ...rowBetween(65, 76, 42, 57, { size: '7.5x15', front: N, road: ROAD_9 }),
  ...rowBetween(77, 89, 57, 72, { size: '7.5x15', front: S, road: ROAD_9 }),
  // Leaning column on the east boundary, facing the vertical 9 m road. 57 fills the space under
  // plot 11 and 64 the space down to the park; 58–63 are regular between them.
  {
    no: 57,
    polygon: [[vRoadRight(18), 18], [east(18), 18], add([east(21), 21], U1, 7.5), add(add([east(21), 21], U1, 7.5), [-U1[1], U1[0]], 15)],
    size: '7.5x15',
    irregular: true,
    front: bearingOf([-U1[1], U1[0]]),
    road: ROAD_9,
  },
  ...column(58, 6, add([east(21), 21], U1, 7.5), U1, 7.5, 15, { size: '7.5x15', front: bearingOf([-U1[1], U1[0]]), road: ROAD_9 }),
  {
    no: 64,
    polygon: [add(add([east(21), 21], U1, 52.5), [-U1[1], U1[0]], 15), add([east(21), 21], U1, 52.5), [east(81), 81], [vRoadRight(81), 81]],
    size: '7.5x15',
    irregular: true,
    front: bearingOf([-U1[1], U1[0]]),
    road: ROAD_9,
  },
  // Column facing the diagonal 9 m road, backing onto 35–46
  { no: 90, polygon: [P(sAt(24, 81), 24), P(sAt(39, 81), 39), P(90.5, 39), P(90.5, 24)], size: '7.5x15', irregular: true, front: ACROSS_12, road: ROAD_9 },
  ...rowDiag(91, 15, 90.5, 7.5, 24, 39, { size: '7.5x15', front: ACROSS_12, road: ROAD_9 }),
  // Plots along road E and the bent 7.5 m road, backing onto the nala
  ...rowAlong(106, 5, P(ROAD_E[1], 6.5), [SIN, COS], [-COS, SIN], 7.5, 15, { size: '7.5x15', front: bearingOf([COS, -SIN]), road: ROAD_9 }),
  ...rowAlong(111, 9, F1, DIR2, PERP2, 7.5, 15, { size: '7.5x15', front: bearingOf([-PERP2[0], -PERP2[1]]), road: ROAD_75 }),
  // Leaning column on the south-east boundary: 128 fills the wedge under road D, 127–120 run below it
  {
    no: 128,
    polygon: [
      [col2Left(171.5), 171.5],
      [east2(171.5), 171.5],
      add([east2(174.5), 174.5], U2, 7.5),
      add(add([east2(174.5), 174.5], U2, 7.5), [-U2[1], U2[0]], 15),
    ],
    size: '7.5x15',
    irregular: true,
    front: bearingOf([-U2[1], U2[0]]),
    extraFronts: [N],
    road: ROAD_75,
  },
  ...column(120, 8, add([east2(174.5), 174.5], U2, 7.5), U2, 7.5, 15, { size: '7.5x15', front: bearingOf([-U2[1], U2[0]]), road: ROAD_75 }, true),
  // Rows below the central park
  { no: 129, polygon: [[xAt(48, 140), 140], [-30, 140], [-30, 152], [xAt(48, 152), 152]], size: '7.5x12', irregular: true, front: N, extraFronts: [ACROSS_12], road: ROAD_75 },
  ...rowEast(130, 12, -30, 140, 7.5, 12, { size: '7.5x12', front: N, road: ROAD_75 }),
  { no: 142, polygon: [[xAt(48, 152), 152], [-38.5, 152], [-38.5, 164], [xAt(48, 164), 164]], size: '7.5x12', irregular: true, front: S, extraFronts: [ACROSS_12], road: ROAD_75 },
  ...rowEast(143, 6, -38.5, 152, 7.5, 12, { size: '7.5x12', front: S, road: ROAD_75 }),
  { no: 149, polygon: [[6.5, 152], [east2(152), 152], [east2(164), 164], [6.5, 164]], size: '7.5x12', irregular: true, front: S, road: ROAD_75 },
];

const corners: Record<number, number[]> = {
  110: [ACROSS_12],
  141: [90],
};
const parkFacing = new Set([64, ...range(78, 89), ...range(90, 105), ...range(129, 141), ...range(111, 119), ...range(120, 128)]);

function range(a: number, b: number) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

export const plots: PlotShape[] = rawPlots
  .map((p) => ({
    ...p,
    extraFronts: p.extraFronts ?? corners[p.no],
    parkFacing: parkFacing.has(p.no) || undefined,
  }))
  .sort((a, b) => a.no - b.no);

/* ------------------------------------------------------------------ roads */

const ROAD_END = 229; // the 12 m road runs a little past plot 34 to the nala

export const roads: RoadShape[] = [
  {
    id: 'main',
    name: MAIN,
    main: true,
    polygon: rect(-80, -13, 134, 0),
    labels: [
      { at: [52, -6.5], angle: 0, text: 'RTO ROAD' },
      { at: [-58, -6.5], angle: 0, text: '← TO RTO CHAURAHA' },
      { at: [113, -6.5], angle: 0, text: 'TO LUCKNOW CHUNGI →' },
    ],
  },
  {
    id: 'r12',
    name: ROAD_12,
    polygon: [P(sAt(6, 0), 6), P(sAt(-6, 0), -6), P(ROAD_END, -6), P(ROAD_END, 6)],
    labels: [
      { at: P(58, 0), angle: -54.5, text: '12 M WIDE ROAD' },
      { at: P(160, 0), angle: -54.5, text: '12 M WIDE ROAD' },
    ],
  },
  {
    id: 'ra',
    name: ROAD_9,
    polygon: [[xAt(6, 33), 33], [vRoadRight(33), 33], [vRoadRight(42), 42], [xAt(6, 42), 42]],
    labels: [{ at: [30, 37.5], angle: 0, text: '9 M ROAD' }],
  },
  {
    id: 'rv',
    name: ROAD_9,
    polygon: [[vRoadLeft(18), 18], [vRoadRight(18), 18], [vRoadRight(81), 81], [vRoadLeft(81), 81]],
    labels: [{ at: [(vRoadLeft(60) + vRoadRight(60)) / 2, 60], angle: -78.5, text: '9 M ROAD' }],
  },
  {
    id: 'rb',
    name: ROAD_9,
    polygon: [[xAt(6, 72), 72], [vRoadRight(72), 72], [vRoadRight(81), 81], [xAt(6, 81), 81]],
    labels: [{ at: [26, 76.5], angle: 0, text: '9 M ROAD' }],
  },
  {
    id: 'rd',
    name: ROAD_9,
    polygon: [P(sAt(39, 81), 39), P(sAt(48, 81), 48), P(ROAD_E[0], 48), P(ROAD_E[0], 39)],
    labels: [{ at: P(150, 43.5), angle: -54.5, text: '9 M ROAD' }],
  },
  {
    id: 're',
    name: ROAD_9,
    polygon: [P(ROAD_E[0], 6), P(ROAD_E[0], 48), P(ROAD_E[1], 48), P(ROAD_E[1], 6)],
    labels: [{ at: P(208, 24), angle: 35.5, text: '9 M ROAD' }],
  },
  {
    id: 'rs',
    name: ROAD_75,
    polygon: [P(ROAD_E[0], 48), [-20.3, 216.7], F3, F1],
    labels: [{ at: [-52, 206], angle: 21.5, text: '7.5 M ROAD' }],
  },
  {
    id: 'rc',
    name: ROAD_75,
    polygon: [[xAt(48, 131), 131], [60, 131], [60, 140], [xAt(48, 140), 140]],
    labels: [{ at: [12, 135.5], angle: 0, text: '7.5 M ROAD' }],
  },
  {
    id: 'rdd',
    name: ROAD_75,
    polygon: [[xAt(48, 164), 164], [east2(164), 164], [east2(171.5), 171.5], [xAt(48, 171.5), 171.5]],
    labels: [{ at: [-28, 167.75], angle: 0, text: '7.5 M ROAD' }],
  },
  {
    id: 'r2',
    name: ROAD_75,
    polygon: [[road2Left(171.5), 171.5], [col2Left(171.5), 171.5], [col2Left(240), 240], [road2Left(240), 240]],
    labels: [{ at: [(road2Left(205) + col2Left(205)) / 2, 205], angle: -77.5, text: '7.5 M ROAD' }],
  },
];

/* ------------------------------------------------------------------ parks & boundary */

export const parks: ParkShape[] = [
  {
    id: 'central',
    name: 'Central Park',
    area: '3,162.42 m²',
    polygon: [[xAt(48, 81), 81], [east(81), 81], [41, 90], [41, 107], [60, 111], [60, 131], [xAt(48, 131), 131]],
    labelAt: [12, 104],
    track: { cx: 12, cy: 105, rx: 30, ry: 13 },
    features: [
      { at: [48, 97], label: 'W.H' },
      { at: [-16, 118], label: "Kids' play" },
    ],
  },
  {
    id: 'park2',
    name: 'Park',
    area: '1,982.42 m²',
    polygon: [[xAt(48, 171.5), 171.5], [road2Left(171.5), 171.5], [-20.3, 216.7], P(ROAD_E[0], 48)],
    labelAt: [-44, 190],
    features: [{ at: [-66, 184], label: 'W.H' }],
  },
];

const back = (no: number, i: number) => plots.find((p) => p.no === no)!.polygon[i];

// Clockwise from the gate: RTO Road, the east boundary, the notch beside the central park,
// the south-east line, the nala along plots 119–106 and the back of plots 34–13.
export const boundary: Pt[] = [
  [xAt(-24, 0), 0],
  [106, 0],
  back(64, 2),
  [41, 90],
  [41, 107],
  [60, 111],
  [60, 153.5],
  E2_TOP,
  E2_BOT,
  back(120, 3),
  back(119, 2),
  back(111, 3),
  back(110, 2),
  back(106, 3),
  P(ROAD_END, 6),
  P(ROAD_END, -6),
  P(223, -6),
  P(223, -24),
];

export const gate: { at: Pt; labelAt: Pt } = { at: [0, 0], labelAt: [0, -19] };

/** Avenue trees along the 12 m road. */
export const avenueTrees: Pt[] = range(0, 15).map((i) => P(14 + i * 13, i % 2 ? 5.3 : -5.3));

/** Solar street lights, spaced along the road centrelines. */
export const streetLights: Pt[] = [
  ...range(0, 7).map((i) => P(20 + i * 26, i % 2 ? 4.6 : -4.6)),
  ...range(0, 3).map((i) => [-8 + i * 26, 37.5] as Pt),
  ...range(0, 4).map((i) => [-36 + i * 26, 76.5] as Pt),
  ...range(0, 2).map((i) => [(vRoadLeft(30 + i * 25) + vRoadRight(30 + i * 25)) / 2, 30 + i * 25] as Pt),
  ...range(0, 4).map((i) => P(88 + i * 28, 43.5)),
  ...range(0, 3).map((i) => [-30 + i * 28, 135.5] as Pt),
  ...range(0, 2).map((i) => [-52 + i * 28, 167.75] as Pt),
  ...range(0, 2).map((i) => [(road2Left(185 + i * 30) + col2Left(185 + i * 30)) / 2, 185 + i * 30] as Pt),
  ...range(0, 2).map((i) => add(add(F1, DIR2, 20 + i * 28), PERP2, -3.75)),
  P(ROAD_E[0] + 4.5, 25),
];

export const viewBox = { x: -162, y: -30, w: 304, h: 285 };
