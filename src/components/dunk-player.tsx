"use client";

import { useEffect, useRef, useState } from "react";
import type { Dunk } from "@/content/dunks";
import { FilmGrain } from "@/components/film-grain";
import { IPod } from "@/components/ipod";

const BURST_MS = 420;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
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

  const actions = {
    scroll: (delta: number) =>
      setCursor((c) => Math.min(Math.max(c + delta, 0), dunks.length - 1)),
    select: playDunk,
    prev: () => playDunk((active - 1 + dunks.length) % dunks.length),
    next: () => playDunk((active + 1) % dunks.length),
    togglePlay: () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    },
    toggleSound: () => setMuted((m) => !m),
  };

  // Keyboard shortcuts mirror the wheel.
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  });
  const cursorRef = useRef(cursor);
  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const onButton = (event.target as HTMLElement).closest("button");
      const a = actionsRef.current;
      const handlers: Record<string, () => void> = {
        ArrowUp: () => a.scroll(-1),
        ArrowDown: () => a.scroll(1),
        ArrowLeft: a.prev,
        ArrowRight: a.next,
        m: a.toggleSound,
      };
      // Enter and space already activate a focused button.
      if (!onButton) {
        handlers.Enter = () => a.select(cursorRef.current);
        handlers[" "] = a.togglePlay;
      }
      const handler = handlers[event.key];
      if (!handler) return;
      event.preventDefault();
      handler();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const syncTime = () => {
    const video = videoRef.current;
    if (video)
      setTime({ elapsed: video.currentTime, duration: video.duration || 0 });
  };

  return (
    <main className="grid min-h-svh grid-cols-1 lg:h-svh lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
      <h1 className="sr-only">Dunks</h1>

      <section className="film relative h-[72svh] overflow-hidden lg:h-full">
        <video
          ref={videoRef}
          className="film-video absolute inset-0 size-full object-cover object-center"
          src={dunk.src}
          poster={dunk.poster}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-label={dunk.title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={syncTime}
          onLoadedMetadata={syncTime}
          onEnded={actions.next}
        />
        <div className="film-tint" />
        <div className="film-vignette" />
        <FilmGrain burst={burst} />
        <div className="film-flicker" />
        <div className="film-scratch" />

        <div className="caption" aria-live="polite">
          <h2 className="caption-title">{dunk.title}</h2>
          <p className="caption-date">
            <time dateTime={dunk.date}>
              {dateFormat.format(new Date(dunk.date))}
            </time>
          </p>
        </div>
      </section>

      <section className="deck grid place-items-center px-4 py-14 lg:py-0">
        <IPod
          dunks={dunks}
          active={active}
          cursor={cursor}
          playing={playing}
          muted={muted}
          elapsed={time.elapsed}
          duration={time.duration}
          onScroll={actions.scroll}
          onSelect={actions.select}
          onPrev={actions.prev}
          onNext={actions.next}
          onTogglePlay={actions.togglePlay}
          onToggleSound={actions.toggleSound}
        />
      </section>
    </main>
  );
}
