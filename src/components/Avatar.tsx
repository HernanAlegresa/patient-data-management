import { useState } from 'react';
import { isValidImageUrl } from '../lib/urlUtils';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

interface AvatarProps {
  src: string;
  name: string;
}

export function Avatar({ src, name }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !imgError && isValidImageUrl(src);
  const initials = getInitials(name) || '?';

  return (
    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium shrink-0 overflow-hidden select-none">
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-label={`${name} initials`}>{initials}</span>
      )}
    </div>
  );
}
