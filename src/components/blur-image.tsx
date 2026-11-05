"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import placeholders from "@/content/placeholders.json";

const blurred = placeholders as Record<string, string>;

/** A tiny blurred stand-in for an image, or none if it has no placeholder. */
export const placeholderFor = (src: string): string | undefined => blurred[src];

/**
 * A `fill` image that shows a blurred low-res stand-in at once, then fades
 * the full image in over it once it has loaded.
 */
export function BlurImage({
  src,
  alt,
  className,
  onLoad,
  ...props
}: Omit<ImageProps, "src" | "fill"> & { src: string }) {
  const [loaded, setLoaded] = useState(false);
  const placeholder = blurred[src];

  return (
    <>
      {placeholder && (
        <span
          className="blur-placeholder"
          style={{ backgroundImage: `url("${placeholder}")` }}
          aria-hidden
        />
      )}
      <Image
        {...props}
        src={src}
        alt={alt}
        fill
        className={className ? `blur-image ${className}` : "blur-image"}
        data-loaded={loaded || undefined}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
}
