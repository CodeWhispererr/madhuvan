import type { PlotSize } from '../../data/layout';
import type { PlotStatus } from '../../data/plotStatus';

export type MapMode = 'availability' | 'size' | 'sunlight';

export const statusFill: Record<PlotStatus, string> = {
  available: '#2f8f4e',
  booked: '#e6a532',
  sold: '#c4533f',
};

export const statusInk: Record<PlotStatus, string> = {
  available: '#ffffff',
  booked: '#1a211d',
  sold: '#ffffff',
};

// Validated categorical set (orange / blue / plum) — echoes the colours on the approved plan.
export const sizeFill: Record<PlotSize, string> = {
  '9x18': '#d9773a',
  '7.5x15': '#3f7fc0',
  '7.5x12': '#b0469a',
};

const SHADE: [number, number, number] = [0xd3, 0xd8, 0xd6];
const LOW: [number, number, number] = [0xf6, 0xe7, 0xc4];
const HIGH: [number, number, number] = [0xe0, 0x86, 0x14];

const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

/** Single-hue amber ramp: grey when the front is in shade, light → deep amber as the sun hits it more squarely. */
export function sunFill(intensity: number) {
  if (intensity <= 0.02) return mix(SHADE, SHADE, 0);
  return mix(LOW, HIGH, Math.min(1, intensity / 0.85));
}

export const SUN_RAMP_CSS = `linear-gradient(90deg, rgb(${SHADE.join(',')}) 0 14%, rgb(${LOW.join(',')}) 14%, rgb(${HIGH.join(',')}))`;
export const NIGHT_FILL = '#33424f';
