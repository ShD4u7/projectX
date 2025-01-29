import Image from 'next/image';
import { useState, useEffect } from 'react';

// Кастомный компонент изображения с оптимизацией
export function OptimizedImage({
  src, 
  alt, 
  width, 
  height, 
  quality = 75,
  priority = false,
  placeholder = 'blur',
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  // Генерация placeholder
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      paddingBottom: `${(height / width) * 100}%` 
    }}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={quality}
        priority={priority}
        placeholder={isLoaded ? 'empty' : 'blur'}
        blurDataURL={blurDataURL}
        onError={() => setImageSrc('/placeholder.png')}
        style={{ 
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out'
        }}
        {...props}
      />
    </div>
  );
}

// Утилита для создания shimmer эффекта
function shimmer(w: number, h: number) {
  return `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
}

// Утилита для конвертации в base64
function toBase64(str: string) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
}
