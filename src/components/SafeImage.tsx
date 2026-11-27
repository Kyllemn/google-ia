import React, { useState } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  fallbackName: string;
  className?: string;
  fallbackClassName?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackName,
  className = 'w-9 h-9 rounded-full object-cover',
  fallbackClassName = 'w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center shrink-0',
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={fallbackClassName} title={alt} aria-label={alt}>
        {getInitials(fallbackName)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
