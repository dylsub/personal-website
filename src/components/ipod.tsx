"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Dunk } from "@/content/dunks";
import { InstagramIcon } from "@/components/instagram-icon";
import { site } from "@/content/site";

// How far the wheel has to turn (in radians) to move the selection one row.
const STEP = Math.PI / 6;

type IPodProps = {
  dunks: Dunk[];
  active: number;
  cursor: number;
  playing: boolean;
  muted: boolean;
  elapsed: number;
  duration: number;
  onScroll: (delta: number) => void;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleSound: () => void;
};

export function IPod({
  dunks,
  active,
  cursor,
  playing,
  muted,
  elapsed,
  duration,
  onScroll,
  onSelect,
  onPrev,
  onNext,
  onTogglePlay,
  onToggleSound,
}: IPodProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  // Set when a press turned into a scroll, so the button under the finger
  // doesn't also fire when it's released.
  const scrolledRef = useRef(false);
  const listRef = useRef<HTMLUListElement>(null);
  // The visible window of the list, as fractions of its full height.
  const [view, setView] = useState({ top: 0, size: 1 });

  const measure = () => {
    const list = listRef.current;
    if (!list) return;
    setView({
      top: list.scrollTop / list.scrollHeight,
      size: list.clientHeight / list.scrollHeight,
    });
  };

  // Keep the highlighted row on screen as the list grows past what fits.
  useEffect(() => {
    const list = listRef.current;
    const row = list?.children[cursor] as HTMLElement | undefined;
    if (!list || !row) return;
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
    else if (
      row.offsetTop + row.offsetHeight >
      list.scrollTop + list.clientHeight
    )
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
  }, [cursor]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() =>
      setView({
        top: list.scrollTop / list.scrollHeight,
        size: list.clientHeight / list.scrollHeight,
      }),
    );
    observer.observe(list);
    // The mouse wheel scrolls the list, and hands back to the page once the
    // list can't go any further that way.
    const wheel = (event: WheelEvent) => {
      const max = list.scrollHeight - list.clientHeight;
      const atEnd =
        event.deltaY < 0 ? list.scrollTop <= 0 : list.scrollTop >= max - 1;
      if (max <= 0 || atEnd) return;
      event.preventDefault();
      list.scrollTop += event.deltaY;
    };
    const browser = list.parentElement!;
    browser.addEventListener("wheel", wheel, { passive: false });
    return () => {
      observer.disconnect();
      browser.removeEventListener("wheel", wheel);
    };
  }, []);

  // Dragging the thumb keeps hold of the spot it was grabbed by; pressing the
  // track centres the thumb there first, then drags from the middle.
  const dragScrollbar = (event: ReactPointerEvent<HTMLDivElement>) => {
    const list = listRef.current;
    const track = event.currentTarget;
    const thumb = track.firstElementChild as HTMLElement;
    if (!list || event.button !== 0) return;
    event.preventDefault();
    const rect = track.getBoundingClientRect();
    const grab =
      event.target === thumb
        ? event.clientY - thumb.getBoundingClientRect().top
        : thumb.offsetHeight / 2;
    const scrollTo = (y: number) => {
      list.scrollTop =
        ((y - rect.top - grab) / rect.height) * list.scrollHeight;
    };
    scrollTo(event.clientY);

    track.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) => scrollTo(e.clientY);
    const up = () => {
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
    };
    track.addEventListener("pointermove", move);
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
  };

  const angleFrom = (x: number, y: number) => {
    const rect = wheelRef.current!.getBoundingClientRect();
    return Math.atan2(
      y - (rect.top + rect.height / 2),
      x - (rect.left + rect.width / 2),
    );
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest("[data-center]")) return;

    let last = angleFrom(event.clientX, event.clientY);
    let turned = 0;
    scrolledRef.current = false;

    const move = (e: PointerEvent) => {
      const angle = angleFrom(e.clientX, e.clientY);
      let delta = angle - last;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      last = angle;
      turned += delta;
      // Clockwise moves down the list, like the real thing.
      while (Math.abs(turned) >= STEP) {
        const direction = Math.sign(turned);
        onScroll(direction);
        turned -= direction * STEP;
        scrolledRef.current = true;
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      // The click event lands after pointerup; clear the flag once it has.
      setTimeout(() => (scrolledRef.current = false));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const unlessScrolled = (action: () => void) => () => {
    if (!scrolledRef.current) action();
  };

  const progress = duration ? Math.min(elapsed / duration, 1) : 0;

  return (
    <div className="ipod">
      <div className="ipod-window">
        <div className="lcd">
          <div className="lcd-titlebar">
            <span className="lcd-glyph">
              {playing ? <PixelPlay /> : <PixelPause />}
            </span>
            <span>Dunks</span>
            <span className="lcd-glyph">
              <PixelSpeaker muted={muted} />
            </span>
          </div>

          <div className="lcd-browser">
            <ul
              ref={listRef}
              className="lcd-list"
              aria-label="Dunks"
              onScroll={measure}
            >
              {dunks.map((dunk, index) => (
                <li key={dunk.id}>
                  <button
                    type="button"
                    className="lcd-row"
                    data-highlighted={index === cursor || undefined}
                    aria-current={index === active || undefined}
                    onClick={() => onSelect(index)}
                  >
                    <span className="truncate">{dunk.title}</span>
                    {index === active && (
                      <span className="lcd-glyph">
                        <PixelPlay />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {view.size < 1 && (
              <div
                className="lcd-scrollbar"
                aria-hidden
                onPointerDown={dragScrollbar}
              >
                <div
                  style={{
                    top: `${view.top * 100}%`,
                    height: `${view.size * 100}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="lcd-footer" aria-hidden>
            <div className="lcd-progress">
              <div style={{ width: `${progress * 100}%` }} />
            </div>
            <div className="lcd-times">
              <span>{formatTime(elapsed)}</span>
              <span>-{formatTime(Math.max(duration - elapsed, 0))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ipod-lower">
        <div ref={wheelRef} className="wheel" onPointerDown={handlePointerDown}>
          <button
            type="button"
            className="wheel-btn wheel-top"
            aria-label="Sound"
            aria-pressed={!muted}
            onClick={unlessScrolled(onToggleSound)}
          >
            <SpeakerIcon muted={muted} />
          </button>
          <button
            type="button"
            className="wheel-btn wheel-left"
            aria-label="Previous dunk"
            onClick={unlessScrolled(onPrev)}
          >
            <SkipIcon />
          </button>
          <button
            type="button"
            className="wheel-btn wheel-right"
            aria-label="Next dunk"
            onClick={unlessScrolled(onNext)}
          >
            <SkipIcon forward />
          </button>
          <button
            type="button"
            className="wheel-btn wheel-bottom"
            aria-label={playing ? "Pause" : "Play"}
            onClick={unlessScrolled(onTogglePlay)}
          >
            <PlayPauseIcon />
          </button>
          <button
            type="button"
            className="wheel-center"
            data-center
            aria-label={`Play ${dunks[cursor]?.title}`}
            onClick={() => onSelect(cursor)}
          />
        </div>
      </div>
      <a
        className="ipod-handle"
        href={`https://www.instagram.com/${site.instagram}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon />
        <span>@{site.instagram}</span>
      </a>
    </div>
  );
}

function formatTime(seconds: number) {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* Wheel icons */

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="m16.5 9.5 5 5m0-5-5 5" strokeLinecap="round" />
      ) : (
        <path
          d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function SkipIcon({ forward = false }: { forward?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      style={forward ? { transform: "scaleX(-1)" } : undefined}
    >
      <rect x="3" y="6" width="2.2" height="12" rx="0.5" />
      <path d="M13 6v12L5.5 12zM21 6v12l-7.5-6z" />
    </svg>
  );
}

function PlayPauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6v12l8-6z" />
      <rect x="14" y="6" width="2.6" height="12" rx="0.5" />
      <rect x="19" y="6" width="2.6" height="12" rx="0.5" />
    </svg>
  );
}

/* Screen glyphs, drawn on a pixel grid */

function PixelPlay() {
  return (
    <svg viewBox="0 0 7 7" fill="currentColor" shapeRendering="crispEdges">
      <path d="M1 0h1v7H1zM2 1h1v5H2zM3 2h1v3H3zM4 3h1v1H4z" />
    </svg>
  );
}

function PixelPause() {
  return (
    <svg viewBox="0 0 7 7" fill="currentColor" shapeRendering="crispEdges">
      <path d="M1 0h2v7H1zM4 0h2v7H4z" />
    </svg>
  );
}

function PixelSpeaker({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 11 7" fill="currentColor" shapeRendering="crispEdges">
      <path d="M0 2h2v3H0zM2 1h1v5H2zM3 0h1v7H3z" />
      {muted ? (
        <path d="M6 1h1v1H6zM9 1h1v1H9zM7 2h1v1H7zM8 2h1v1H8zM7 3h2v1H7zM7 4h1v1H7zM8 4h1v1H8zM6 5h1v1H6zM9 5h1v1H9z" />
      ) : (
        <path d="M6 2h1v3H6zM8 0h1v1H8zM9 1h1v5H9zM8 6h1v1H8z" />
      )}
    </svg>
  );
}
