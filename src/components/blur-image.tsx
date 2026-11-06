"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import placeholders from "@/content/placeholders.json";

const blurred = placeholders as Record<string, string>;

/** Images that have loaded once already; the browser has them cached. */
const loadedOnce = new Set<string>();

/** A tiny blurred stand-in for an image, or none if it has no placeholder. */
export const placeholderFor = (src: string): string | undefined => blurred[src];

/**
 * A `fill` image that shows a blurred low-res stand-in at once, then fades
 * the full image in over it once it has loaded. One that has loaded before
 * shows at once, so remounting it (as the binder's pages do when it opens
 * and shuts) doesn't flash the blur again.
 */
export function BlurImage({
  src,
  alt,
  className,
  onLoad,
  ...props
}: Omit<ImageProps, "src" | "fill"> & { src: string }) {
  const [seen] = useState(() => loadedOnce.has(src));
  const [loaded, setLoaded] = useState(seen);
  const placeholder = blurred[src];

  return (
    <>
      {placeholder && !seen && (
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
        data-seen={seen || undefined}
        onLoad={(event) => {
          loadedOnce.add(src);
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
}
