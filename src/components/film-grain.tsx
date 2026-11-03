"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 8;
const FPS = 18;
// Noise is rendered at a fraction of the display size, which keeps it cheap
// and gives the grain a slightly coarse, analog texture when scaled up.
const RESOLUTION = 0.5;

/**
 * Animated film static. Pre-renders a handful of noise frames and cycles
 * through them. `burst` cranks it up into full TV static for a moment.
 */
export function FilmGrain({ burst = false }: { burst?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frames: ImageData[] = [];
    let frame = 0;
    let raf = 0;
    let lastDraw = 0;

    const build = () => {
      const width = Math.max(1, Math.ceil(canvas.clientWidth * RESOLUTION));
      const height = Math.max(1, Math.ceil(canvas.clientHeight * RESOLUTION));
      if (width === canvas.width && height === canvas.height && frames.length)
        return;
      canvas.width = width;
      canvas.height = height;
      frames = Array.from({ length: FRAME_COUNT }, () => {
        const image = ctx.createImageData(width, height);
        const data = image.data;
        for (let i = 0; i < data.length; i += 4) {
          const value = Math.random() * 255;
          data[i] = data[i + 1] = data[i + 2] = value;
          data[i + 3] = 255;
        }
        return image;
      });
      ctx.putImageData(frames[0], 0, 0);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - lastDraw < 1000 / FPS) return;
      lastDraw = now;
      frame = (frame + 1) % FRAME_COUNT;
      ctx.putImageData(frames[frame], 0, 0);
    };

    const observer = new ResizeObserver(build);
    observer.observe(canvas);
    build();
    if (!reduceMotion) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="film-grain"
      data-burst={burst || undefined}
      aria-hidden
    />
  );
}
