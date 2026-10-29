import {
  BadgeCheck,
  Cctv,
  Droplet,
  Droplets,
  FerrisWheel,
  Footprints,
  Lamp,
  Landmark,
  MapPin,
  Route,
  ScrollText,
  ShieldCheck,
  Trees,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import type { AmenityIcon as IconName } from '../../data/content';

const ICONS: Record<IconName, LucideIcon> = {
  shield: ShieldCheck,
  guard: UserCheck,
  cctv: Cctv,
  road: Route,
  drain: Droplets,
  water: Droplet,
  light: Lamp,
  park: Trees,
  track: Footprints,
  play: FerrisWheel,
  approved: BadgeCheck,
  title: ScrollText,
  bank: Landmark,
  pin: MapPin,
};

export function AmenityIcon({ name, size = 24 }: { name: IconName; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={1.7} />;
}
