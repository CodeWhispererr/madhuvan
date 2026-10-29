import { Camera, UserRound } from 'lucide-react';
import './ui.css';

/** Stand-in for a photo we don't have yet. Swap for an <img> once the real picture arrives. */
export function MockPhoto({
  kind = 'site',
  label,
  className = '',
}: {
  kind?: 'site' | 'person';
  label?: string;
  className?: string;
}) {
  const Icon = kind === 'person' ? UserRound : Camera;
  return (
    <div className={`mock-photo mock-photo--${kind} ${className}`} role="img" aria-label={label ?? 'Photo coming soon'}>
      <Icon size={kind === 'person' ? 54 : 30} strokeWidth={1.4} />
      {label && (
        <span className="mock-photo__label">{label}</span>
      )}
    </div>
  );
}
