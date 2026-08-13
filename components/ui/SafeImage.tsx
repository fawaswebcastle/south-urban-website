"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";

export interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  fallbackSrc = "/hero_banner.jpg",
  alt = "Image",
  unoptimized,
  ...props
}: SafeImageProps) {
  const initial = src || fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initial);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const isLocalhost =
    typeof imgSrc === "string" &&
    (imgSrc.startsWith("http://localhost") || imgSrc.startsWith("http://127.0.0.1"));

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      unoptimized={unoptimized ?? isLocalhost}
      onError={(e) => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
        if (props.onError) {
          props.onError(e);
        }
      }}
    />
  );
}
