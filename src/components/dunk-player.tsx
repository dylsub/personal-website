"use client";

import { useEffect, useRef, useState } from "react";
import type { Dunk } from "@/content/dunks";
import { FilmGrain } from "@/components/film-grain";
import { IPod } from "@/components/ipod";

const BURST_MS = 420;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function DunkPlayer({ dunks }: { dunks: Dunk[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState({ elapsed: 0, duration: 0 });
  // Starts on so the page opens with a flash of static.
  const [burst, setBurst] = useState(true);

  const dunk = dunks[active];

  useEffect(() => {
    if (!burst) return;
    const timeout = setTimeout(() => setBurst(false), BURST_MS);
    return () => clearTimeout(timeout);
  }, [burst]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [active]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const playDunk = (index: number) => {
    setCursor(index);
    setBurst(true);
    if (index === active) restart();
    else setActive(index);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const syncTime = () => {
    const video = videoRef.current;
    if (video)
      setTime({ elapsed: video.currentTime, duration: video.duration || 0 });
  };

  return (
    <main className="reel">
      <h1 className="sr-only">Dunks</h1>

      <section className="reel-film film">
        <video
          ref={videoRef}
          className="film-video absolute inset-0 size-full object-cover"
          style={{ objectPosition: dunk.position ?? "center" }}
          src={dunk.src}
          poster={dunk.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={dunk.title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={syncTime}
          onLoadedMetadata={syncTime}
        />
        <div className="film-tint" />
        <div className="film-vignette" />
        <FilmGrain burst={burst} />
        <div className="film-flicker" />

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
    </main>
  );
}
