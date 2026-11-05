"use client";

import { useEffect, useRef, useState } from "react";
import { ThreeDS } from "@/components/three-ds/three-ds";

type Props = { photo: string; alt: string; stamp: string };

/**
 * The 3DS as a real 3D model that can be turned by dragging. The CSS
 * drawing stands in while three.js loads (and stays if WebGL can't run),
 * then the model fades in over it in the same place.
 */
export function ThreeDSViewer(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let scene: { dispose: () => void } | undefined;

    (async () => {
      try {
        // Loaded only here, so the rest of the page never waits on it
        const { createDS } = await import("./scene");
        const css = getComputedStyle(document.documentElement);
        const built = await createDS(host, {
          photo: props.photo,
          stamp: props.stamp,
          labelFont: css.getPropertyValue("--font-space-mono") || "monospace",
          roundedFont: css.getPropertyValue("--font-rounded") || "sans-serif",
        });
        if (disposed) return built.dispose();
        scene = built;
        setReady(true);
      } catch {
        // No WebGL: the drawing stays.
      }
    })();

    return () => {
      disposed = true;
      scene?.dispose();
    };
  }, [props.photo, props.stamp]);

  return (
    <div className="ds-viewer" data-ready={ready || undefined}>
      <ThreeDS {...props} />
      <div
        ref={hostRef}
        className="ds-canvas"
        role="img"
        aria-label={`A 3DS showing a photo: ${props.alt}. Drag to turn it.`}
      />
      <p className="ds-hint" aria-hidden>
        Drag to turn
      </p>
    </div>
  );
}
