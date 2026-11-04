"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { slidesFor, type Game } from "@/content/games";

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
  onPlay: () => void;
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
  onPlay,
}: WiiScreenProps) {
  const [showHelp, setShowHelp] = useState(false);
  const game = games[selected];
  const slides = slidesFor(game);

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
                    src === game.cover
                      ? `${game.title} cover`
                      : `${game.title} screenshot ${i + 1}`
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
            {game.embed ? (
              <button type="button" className="wii-pill" onClick={onPlay}>
                Play
              </button>
            ) : (
              <a
                className="wii-pill"
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Play
              </a>
            )}
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
        <defs>
          {/* One gradient across every shape so the hand shades as a whole. */}
          <linearGradient
            id="wii-cursor-shade"
            gradientUnits="userSpaceOnUse"
            x1="12"
            y1="4"
            x2="32"
            y2="44"
          >
            <stop offset="0.35" stopColor="#fff" />
            <stop offset="1" stopColor="#dbe4ea" />
          </linearGradient>
        </defs>
        <g className="wii-cursor-outline">
          <HandShapes />
        </g>
        <g className="wii-cursor-fill">
          <HandShapes />
        </g>
        {/* Creases between the knuckles, under the curled fingers, and along the thumb */}
        <path
          className="wii-cursor-crease"
          d="M21 16.5V22 M26.8 18.5V23.5 M32.2 21.5V25.5 M21.5 27c4 1.2 9 1.6 14 0.8 M12.6 23.5c1.2 3 1.2 6.5 0 9.5"
        />
        <text x="24.5" y="38.5" textAnchor="middle">
          1
        </text>
      </svg>
    </div>
  );
}

function HandShapes() {
  return (
    <>
      {/* Index finger, then the middle, ring and little knuckles stepping down */}
      <rect x="13" y="2" width="8" height="23" rx="4" />
      <rect x="20.5" y="12.5" width="7" height="14" rx="3.5" />
      <rect x="26.5" y="14.5" width="6.5" height="13" rx="3.25" />
      <rect x="31.5" y="18" width="5.5" height="11" rx="2.75" />
      <rect x="10" y="20" width="27" height="22" rx="9.5" />
      <ellipse
        cx="9"
        cy="27.5"
        rx="4.2"
        ry="8"
        transform="rotate(-35 9 27.5)"
      />
    </>
  );
}
