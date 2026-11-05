"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { backdrop, baked } from "@/components/wii/baked";
import { usePageVisible } from "@/hooks/use-page-visible";
import { favorites } from "@/content/favorites";
import { slidesFor, type Game } from "@/content/games";

export const SLOTS = 12;
/** The bottom-right slot holds my all-time list instead of a game. */
export const FAVORITES_SLOT = SLOTS - 1;
// Fingertip position inside the 40×48 cursor artwork.
const HOTSPOT = { x: 16.5, y: 2 };
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
  const slides = game ? slidesFor(game) : [];

  return (
    <div className="wii-screen" data-off={!on || undefined}>
      <PointerCursor />
      {/* The glass: grain, scanlines and the tube's falloff, as still images */}
      <div className="wii-crt" aria-hidden />

      {view === "menu" ? (
        <div className="wii-menu">
          <div className="wii-grid">
            {Array.from({ length: SLOTS }, (_, i) => {
              if (i === FAVORITES_SLOT)
                return (
                  <FavoritesTile
                    key="favorites"
                    selected={i === selected}
                    onHover={() => onHover(i)}
                    onOpen={() => onOpen(i)}
                  />
                );
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
                    src={baked(g.cover)}
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
      ) : !game ? (
        <FavoritesChannel
          highlighted={slide}
          onHighlight={onSlide}
          onBack={onBack}
        />
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
                  src={baked(src)}
                  alt={
                    game.screenshots.length === 0
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

function FavoritesTile({
  selected,
  onHover,
  onOpen,
}: {
  selected: boolean;
  onHover: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="wii-tile wii-tile-favorites"
      data-selected={selected || undefined}
      aria-label={favorites.title}
      onPointerEnter={onHover}
      onFocus={onHover}
      onClick={onOpen}
    >
      {favorites.games.map((f) => (
        <span key={f.title} className="wii-mosaic-cell">
          <Image src={baked(f.cover)} alt="" fill sizes="80px" />
        </span>
      ))}
      <span className="wii-tile-label">{favorites.title}</span>
    </button>
  );
}

/** My all-time list: a shelf of covers over the highlighted one, blurred. */
function FavoritesChannel({
  highlighted,
  onHighlight,
  onBack,
}: {
  highlighted: number;
  onHighlight: (index: number) => void;
  onBack: () => void;
}) {
  return (
    <div className="wii-channel">
      <div className="wii-channel-art">
        {favorites.games.map((f, i) => (
          <div
            key={f.title}
            className="wii-slide"
            data-active={i === highlighted || undefined}
          >
            <Image
              src={backdrop(f.cover)}
              alt=""
              fill
              sizes="48px"
              className="wii-slide-backdrop"
            />
          </div>
        ))}
        <div className="wii-channel-heading">
          <h3>{favorites.title}</h3>
          <p>{favorites.tagline}</p>
        </div>
        <ol className="wii-shelf">
          {favorites.games.map((f, i) => (
            <li key={f.title}>
              <button
                type="button"
                className="wii-shelf-cover"
                data-active={i === highlighted || undefined}
                onPointerEnter={() => onHighlight(i)}
                onFocus={() => onHighlight(i)}
              >
                <Image
                  src={baked(f.cover)}
                  alt={f.title}
                  fill
                  sizes="(min-width: 64rem) 140px, 15vw"
                />
                <span className="wii-shelf-label">{f.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="wii-channel-actions">
        <button type="button" className="wii-pill" onClick={onBack}>
          Menu
        </button>
      </div>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  const visible = usePageVisible();

  // Stops while the tab is hidden and catches up on return.
  useEffect(() => {
    if (!visible) return;
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 10_000);
    return () => clearInterval(interval);
  }, [visible]);

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
 * tilts a little as it moves across, like a remote being turned. Holding the
 * mouse button curls it into a fist, the way the Wii hand grabs on A.
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
    const press = (e: PointerEvent) => {
      if (e.pointerType === "mouse") cursor.dataset.pressed = "";
    };
    // Released anywhere, even off the screen, the hand opens again.
    const release = () => delete cursor.dataset.pressed;

    screen.addEventListener("pointermove", move);
    screen.addEventListener("pointerleave", leave);
    screen.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      screen.removeEventListener("pointermove", move);
      screen.removeEventListener("pointerleave", leave);
      screen.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);

  return (
    <div ref={ref} className="wii-cursor" aria-hidden>
      <svg viewBox="0 0 40 48">
        <defs>
          {/* White across the fingers, fading to the player colour at the wrist */}
          <linearGradient
            id="wii-cursor-shade"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="14"
            x2="0"
            y2="44"
          >
            <stop offset="0.2" stopColor="#fff" />
            <stop offset="1" stopColor="#b3caf4" />
          </linearGradient>
        </defs>
        <Hand
          className="wii-cursor-point"
          d={`M13 5.5A3.5 3.5 0 0 1 20 5.5V15.5${HAND_BODY}`}
          creases="M20 15.5V21 M24.7 16.5V20 M29.3 16.5V20"
        />
        <Hand
          className="wii-cursor-grab"
          d={`M13 19.5Q13 15.5 17 15.5${HAND_BODY}`}
          creases="M18.3 16.5V20 M23.5 16.5V20 M28.7 16.5V20"
        />
        <text x="24" y="40" textAnchor="middle">
          1
        </text>
      </svg>
    </div>
  );
}

/** Top of the fist, round to the wrist, the thumb, and back up to the index. */
const HAND_BODY =
  "H30Q34 15.5 34 19.5V33Q34 36.5 31 37.5V42Q31 44 29 44H16Q14 44 14 42V38.5Q11.5 37 9.5 34.5C7 31 6.5 26.5 8.5 24Q10.5 22 13 23.5Z";
const THUMB_CREASE = "M13.6 24.5C14.6 27 14.6 29.5 13.4 31.5";

function Hand({
  className,
  d,
  creases,
}: {
  className: string;
  d: string;
  creases: string;
}) {
  return (
    <g className={className}>
      {/* A hard shadow, then the hand drawn twice: a wide dark stroke
          underneath leaves an outline, and a thin white stroke on top gives
          it the inner rim. */}
      <path className="wii-cursor-shadow" d={d} />
      <path className="wii-cursor-outline" d={d} />
      <path className="wii-cursor-fill" d={d} />
      <path className="wii-cursor-crease" d={`${creases} ${THUMB_CREASE}`} />
    </g>
  );
}
