"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Game } from "@/content/games";

const SLOTS = 12;
// Fingertip position inside the 40×48 cursor artwork.
const HOTSPOT = { x: 17, y: 2 };
const ITCH_PROFILE = "https://dylsub.itch.io/";

type WiiScreenProps = {
  games: Game[];
  on: boolean;
  view: "menu" | "channel";
  selected: number;
  slide: number;
  onHover: (index: number) => void;
  onOpen: (index: number) => void;
  onBack: () => void;
  onSlide: (index: number) => void;
};

export function WiiScreen({
  games,
  on,
  view,
  selected,
  slide,
  onHover,
  onOpen,
  onBack,
  onSlide,
}: WiiScreenProps) {
  const [showHelp, setShowHelp] = useState(false);
  const game = games[selected];
  const slides = [game.cover, ...game.screenshots];

  return (
    <div className="wii-screen" data-off={!on || undefined}>
      <PointerCursor />

      {view === "menu" ? (
        <div className="wii-menu">
          <div className="wii-grid">
            {Array.from({ length: SLOTS }, (_, i) => {
              const g = games[i];
              if (!g)
                return (
                  <div key={i} className="wii-tile" data-empty aria-hidden />
                );
              return (
                <button
                  key={g.id}
                  type="button"
                  className="wii-tile"
                  data-selected={i === selected || undefined}
                  aria-label={g.title}
                  onPointerEnter={() => onHover(i)}
                  onFocus={() => onHover(i)}
                  onClick={() => onOpen(i)}
                >
                  <Image
                    src={g.cover}
                    alt=""
                    fill
                    sizes="(min-width: 64rem) 220px, 25vw"
                  />
                  <span className="wii-tile-label">{g.title}</span>
                </button>
              );
            })}
          </div>

          <div className="wii-bar">
            <svg
              className="wii-bar-shape"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path d="M0 64 C 240 64 290 22 500 22 C 710 22 760 64 1000 64 V 200 H 0 Z" />
              <path
                className="wii-bar-line"
                d="M0 64 C 240 64 290 22 500 22 C 710 22 760 64 1000 64"
              />
            </svg>
            <a
              className="wii-round wii-round-left"
              href={ITCH_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
            >
              itch.io
            </a>
            <Clock />
            <button
              type="button"
              className="wii-round wii-round-right"
              aria-label="How to use"
              aria-expanded={showHelp}
              onClick={() => setShowHelp((s) => !s)}
            >
              ?
            </button>
            {showHelp && (
              <p className="wii-help">
                Click a channel to open it, or use the remote: the D-pad moves,
                A opens, B goes back.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="wii-channel">
          <div className="wii-channel-art">
            {slides.map((src, i) => (
              <div
                key={src}
                className="wii-slide"
                data-active={i === slide || undefined}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="10vw"
                  className="wii-slide-backdrop"
                />
                <Image
                  src={src}
                  alt={
                    i === 0
                      ? `${game.title} cover`
                      : `${game.title} screenshot ${i}`
                  }
                  fill
                  sizes="(min-width: 64rem) 900px, 100vw"
                  className="wii-slide-image"
                />
              </div>
            ))}
            <div className="wii-channel-heading">
              <h3>{game.title}</h3>
              <p>{game.tagline}</p>
              {game.note && <p className="wii-channel-note">{game.note}</p>}
            </div>
            {slides.length > 1 && (
              <div className="wii-dots">
                {slides.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`Show image ${i + 1}`}
                    data-active={i === slide || undefined}
                    onClick={() => onSlide(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="wii-channel-actions">
            <button type="button" className="wii-pill" onClick={onBack}>
              Menu
            </button>
            <a
              className="wii-pill"
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Play
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return <div className="wii-clock" />;
  const [time, period] = now
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .split(" ");
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });

  return (
    <div className="wii-clock">
      <time dateTime={now.toISOString()}>
        {time}
        <small>{period}</small>
      </time>
      <span>{date.replace(",", "")}</span>
    </div>
  );
}

/**
 * Pointing-hand cursor that replaces the mouse pointer inside the screen and
 * tilts a little as it moves across, like a remote being turned.
 */
function PointerCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    const screen = cursor?.parentElement;
    if (!cursor || !screen) return;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = screen.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const tilt = (x / rect.width - 0.5) * 18;
      // The artwork scales with the screen; scale the hotspot to match.
      const scale = cursor.offsetWidth / 40;
      cursor.style.transform = `translate(${x - HOTSPOT.x * scale}px, ${y - HOTSPOT.y * scale}px) rotate(${tilt}deg)`;
      cursor.dataset.visible = "";
    };
    const leave = () => delete cursor.dataset.visible;

    screen.addEventListener("pointermove", move);
    screen.addEventListener("pointerleave", leave);
    return () => {
      screen.removeEventListener("pointermove", move);
      screen.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="wii-cursor" aria-hidden>
      <svg viewBox="0 0 40 48">
        <g className="wii-cursor-outline">
          <HandShapes />
        </g>
        <g className="wii-cursor-fill">
          <HandShapes />
        </g>
        <text x="22.5" y="36.5" textAnchor="middle">
          1
        </text>
      </svg>
    </div>
  );
}

function HandShapes() {
  return (
    <>
      <rect x="13" y="2" width="8" height="24" rx="4" />
      <rect x="20" y="14" width="7" height="12" rx="3.5" />
      <rect x="26" y="16.5" width="7" height="11" rx="3.5" />
      <rect x="9" y="18" width="24" height="24" rx="8" />
      <ellipse
        cx="9.5"
        cy="28"
        rx="4.5"
        ry="7.5"
        transform="rotate(-28 9.5 28)"
      />
    </>
  );
}
