// Solar geometry for Hardoi, used to show how much direct sun each plot's front receives.
// NOAA-style approximation (declination + equation of time), accurate to a few minutes —
// plenty for comparing plot orientations.

export const HARDOI = { lat: 27.3966, lon: 80.1253 };
const IST_MERIDIAN = 82.5;
const RAD = Math.PI / 180;

const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dayOfYear = (month: number, day = 21) => MONTH_START[month] + day;

function solarTerms(doy: number) {
  const b = (360 / 365) * (doy - 81) * RAD;
  const equationOfTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const declination = 23.45 * Math.sin(b) * RAD;
  // Minutes between IST clock time and local solar time in Hardoi.
  const correction = 4 * (HARDOI.lon - IST_MERIDIAN) + equationOfTime;
  return { declination, correction };
}

export interface SunPosition {
  /** Degrees above the horizon. */
  elevation: number;
  /** Compass bearing in degrees, clockwise from true north. */
  azimuth: number;
}

/** Sun position for a day of the year at an IST clock time (decimal hours). */
export function sunPosition(doy: number, clockHours: number): SunPosition {
  const { declination, correction } = solarTerms(doy);
  const lat = HARDOI.lat * RAD;
  const hourAngle = 15 * (clockHours + correction / 60 - 12) * RAD;
  const sinEl =
    Math.sin(declination) * Math.sin(lat) + Math.cos(declination) * Math.cos(lat) * Math.cos(hourAngle);
  const el = Math.asin(sinEl);
  const cosAz =
    (Math.sin(declination) * Math.cos(lat) - Math.cos(declination) * Math.sin(lat) * Math.cos(hourAngle)) /
    Math.cos(el);
  let az = Math.acos(Math.min(1, Math.max(-1, cosAz))) / RAD;
  if (hourAngle > 0) az = 360 - az;
  return { elevation: el / RAD, azimuth: az };
}

/** Sunrise and sunset as IST decimal hours. */
export function sunTimes(doy: number) {
  const { declination, correction } = solarTerms(doy);
  const lat = HARDOI.lat * RAD;
  const h0 = Math.acos(-Math.tan(lat) * Math.tan(declination)) / RAD / 15;
  return { sunrise: 12 - h0 - correction / 60, sunset: 12 + h0 - correction / 60 };
}

export const formatClock = (hours: number) => {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
};

/** How squarely the sun strikes a vertical wall facing `bearing` (0 = edge-on or behind, 1 = head-on, low sun). */
export function facadeIncidence(sun: SunPosition, bearing: number) {
  if (sun.elevation <= 0) return 0;
  const facing = Math.cos((sun.azimuth - bearing) * RAD);
  return facing > 0 ? facing * Math.cos(sun.elevation * RAD) : 0;
}

const STEP_HOURS = 1 / 12; // 5-minute steps
const hoursCache = new Map<string, number>();

/** Hours of direct sun on any of the given wall bearings on one day (nothing in the way). */
export function directSunHours(doy: number, bearings: readonly number[]) {
  const key = `${doy}|${bearings.map((b) => b.toFixed(1)).join(',')}`;
  const cached = hoursCache.get(key);
  if (cached !== undefined) return cached;
  const { sunrise, sunset } = sunTimes(doy);
  let lit = 0;
  for (let t = sunrise; t <= sunset; t += STEP_HOURS) {
    const sun = sunPosition(doy, t);
    // Ignore the first few degrees above the horizon, which neighbouring houses and trees block anyway.
    if (sun.elevation < 4) continue;
    if (bearings.some((b) => Math.cos((sun.azimuth - b) * RAD) > 0.05)) lit += STEP_HOURS;
  }
  hoursCache.set(key, lit);
  return lit;
}

export interface SunProfile {
  /** Average hours of direct sun on the front per day, across the year. */
  annual: number;
  winter: number;
  summer: number;
  monthly: number[];
  rating: 1 | 2 | 3 | 4 | 5;
}

export function sunProfile(bearings: readonly number[]): SunProfile {
  const monthly = MONTHS.map((_, m) => directSunHours(dayOfYear(m), bearings));
  const annual = monthly.reduce((a, b) => a + b, 0) / 12;
  const rating = annual >= 8.6 ? 5 : annual >= 7.2 ? 4 : annual >= 5.6 ? 3 : annual >= 4 ? 2 : 1;
  return { annual, winter: monthly[11], summer: monthly[5], monthly, rating };
}
