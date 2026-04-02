import Image from 'next/image';
import { PUBLIC_PAYLOAD_URL } from '@/constants';

export function PayloadImage({
  media,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes,
  priority = false,
  quality = 85,
}) {
  if (!media) return null;

  if (typeof media === 'string') {
    const src = media.startsWith('http')
      ? media
      : `${PUBLIC_PAYLOAD_URL}${media}`;

    if (fill) {
      return (
        <Image
          src={src}
          alt={alt ?? ''}
          fill
          unoptimized
          className={`object-cover ${className}`}
          sizes={sizes ?? '100vw'}
          priority={priority}
          quality={quality}
        />
      );
    }

    return (
      <Image
        src={src}
        alt={alt ?? ''}
        width={width ?? 800}
        height={height ?? 600}
        unoptimized
        className={className}
        sizes={sizes}
        priority={priority}
        quality={quality}
      />
    );
  }

  const src = media.url
    ? media.url.startsWith('http') ? media.url : `${PUBLIC_PAYLOAD_URL}${media.url}`
    : '';
  if (!src) return null;

  const imageAlt = alt ?? media.alt ?? '';

  if (fill) {
    return (
      <Image
        src={src}
        alt={imageAlt}
        fill
        unoptimized
        className={`object-cover ${className}`}
        sizes={sizes ?? '100vw'}
        priority={priority}
        quality={quality}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={imageAlt}
      width={width ?? media.width ?? 800}
      height={height ?? media.height ?? 600}
      unoptimized
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
    />
  );
}
