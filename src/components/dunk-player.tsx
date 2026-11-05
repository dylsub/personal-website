"use client";

import { useEffect, useRef, useState } from "react";
import type { Dunk } from "@/content/dunks";
import { placeholderFor } from "@/components/blur-image";
import { FilmGrain } from "@/components/film-grain";
import { IPod } from "@/components/ipod";

const BURST_MS = 420;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const pad = (n: number) => String(n).padStart(2, "0");

export function DunkPlayer({ dunks }: { dunks: Dunk[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Off-screen or in a background tab, the clip pauses to save decoding work.
  // A pause the viewer chose sticks; only one we made is undone when the clip
  // comes back into view. Nothing plays until the viewer presses play.
  const inViewRef = useRef(true);
  const userPausedRef = useRef(true);
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState({ elapsed: 0, duration: 0 });
  // Starts on so the page opens with a flash of static.
  const [burst, setBurst] = useState(true);

  const dunk = dunks[active];
  const canPlay = () => inViewRef.current && !document.hidden;

  useEffect(() => {
    if (!burst) return;
    const timeout = setTimeout(() => setBurst(false), BURST_MS);
    return () => clearTimeout(timeout);
  }, [burst]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      if (!canPlay()) video.pause();
      else if (!userPausedRef.current) video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (canPlay() && !userPausedRef.current)
      videoRef.current?.play().catch(() => {});
  }, [active]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    if (canPlay()) video.play().catch(() => {});
  };

  const playDunk = (index: number) => {
    userPausedRef.current = false;
    setCursor(index);
    setBurst(true);
    if (index === active) restart();
    else setActive(index);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    userPausedRef.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const syncTime = () => {
    const video = videoRef.current;
    if (video)
      setTime({ elapsed: video.currentTime, duration: video.duration || 0 });
  };

  return (
    <>
      {/* The poster's blurred stand-in shows until the poster itself loads */}
      <section
        className="reel-film film"
        style={{
          backgroundImage: placeholderFor(dunk.poster)
            ? `url("${placeholderFor(dunk.poster)}")`
            : undefined,
          backgroundPosition: dunk.position ?? "center",
        }}
      >
        <video
          ref={videoRef}
          className="film-video absolute inset-0 size-full object-cover"
          style={{ objectPosition: dunk.position ?? "center" }}
          src={dunk.src}
          poster={dunk.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={dunk.title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={syncTime}
          onLoadedMetadata={syncTime}
        />
        <div className="film-vignette" />
        {!playing && (
          <button
            type="button"
            className="film-play"
            aria-label={`Play ${dunk.title}`}
            onClick={togglePlay}
          >
            {/* Shifted so the triangle's centroid, not its box, sits dead centre */}
            <svg viewBox="0.3 0 24 24" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          </button>
        )}
        <FilmGrain burst={burst} />

        <p className="reel-count">
          <span className="sr-only">
            Dunk {active + 1} of {dunks.length}
          </span>
          <span aria-hidden>
            <span className="reel-count-now">{pad(active + 1)}</span>
            <span className="reel-count-total"> / {pad(dunks.length)}</span>
          </span>
          <span className="reel-count-ticks" aria-hidden>
            {dunks.map((d, i) => (
              <i key={d.id} data-passed={i <= active || undefined} />
            ))}
          </span>
        </p>

        <div className="caption" aria-live="polite">
          <h2 className="caption-title">{dunk.title}</h2>
          <p className="caption-date">
            <time dateTime={dunk.date}>
              {dateFormat.format(new Date(dunk.date))}
            </time>
          </p>
        </div>
      </section>

      <section className="reel-deck">
        <IPod
          dunks={dunks}
          active={active}
          cursor={cursor}
          playing={playing}
          muted={muted}
          elapsed={time.elapsed}
          duration={time.duration}
          onScroll={(delta) =>
            setCursor((c) => Math.min(Math.max(c + delta, 0), dunks.length - 1))
          }
          onSelect={playDunk}
          onPrev={() => playDunk((active - 1 + dunks.length) % dunks.length)}
          onNext={() => playDunk((active + 1) % dunks.length)}
          onTogglePlay={togglePlay}
          onToggleSound={() => setMuted((m) => !m)}
        />
      </section>
    </>
  );
}
