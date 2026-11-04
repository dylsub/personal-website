"use client";

import { useEffect, useState } from "react";
import { GameModal } from "@/components/game-modal";
import { slidesFor, type Game } from "@/content/games";
import { WiiRemote, type RemoteButton } from "@/components/wii/wii-remote";
import { WiiScreen } from "@/components/wii/wii-screen";
import "./wii.css";

const COLUMNS = 4;
const SLIDE_MS = 3500;
const RUMBLE_MS = 320;

export function WiiSection({ games }: { games: Game[] }) {
  const [on, setOn] = useState(true);
  const [view, setView] = useState<"menu" | "channel">("menu");
  const [selected, setSelected] = useState(0);
  const [slide, setSlide] = useState(0);
  const [rumble, setRumble] = useState(false);
  const [playing, setPlaying] = useState(false);

  const game = games[selected];
  const slides = slidesFor(game);

  useEffect(() => {
    if (!rumble) return;
    const timeout = setTimeout(() => setRumble(false), RUMBLE_MS);
    return () => clearTimeout(timeout);
  }, [rumble]);

  // Cycle through the game's images while its channel is open.
  useEffect(() => {
    if (view !== "channel" || !on || slides.length < 2) return;
    const interval = setInterval(
      () => setSlide((s) => (s + 1) % slides.length),
      SLIDE_MS,
    );
    return () => clearInterval(interval);
  }, [view, on, slides.length, selected]);

  const openChannel = (index: number) => {
    setSelected(index);
    setSlide(0);
    setView("channel");
    setRumble(true);
  };

  const backToMenu = () => setView("menu");

  const play = () =>
    game.embed
      ? setPlaying(true)
      : window.open(game.url, "_blank", "noopener,noreferrer");

  const step = (delta: number) =>
    setSlide((s) => (s + delta + slides.length) % slides.length);

  const moveSelection = (delta: number) =>
    setSelected((s) => {
      const next = s + delta;
      if (next >= 0 && next < games.length) return next;
      // Moving down onto an empty slot lands on the last game in that row.
      const lastRow = Math.floor((games.length - 1) / COLUMNS);
      if (delta === COLUMNS && Math.floor(s / COLUMNS) < lastRow)
        return games.length - 1;
      return s;
    });

  const handleRemote = (button: RemoteButton) => {
    if (button === "power") {
      setOn((o) => !o);
      setView("menu");
      return;
    }
    if (!on) return;

    if (view === "menu") {
      const moves: Partial<Record<RemoteButton, number>> = {
        left: -1,
        right: 1,
        up: -COLUMNS,
        down: COLUMNS,
        minus: -1,
        plus: 1,
      };
      if (button in moves) moveSelection(moves[button]!);
      // Held sideways, 2 confirms and 1 backs out.
      if (button === "a" || button === "two") openChannel(selected);
      return;
    }

    if (button === "left" || button === "minus") step(-1);
    if (button === "right" || button === "plus") step(1);
    if (button === "a" || button === "two") play();
    if (button === "b" || button === "one" || button === "home") backToMenu();
  };

  return (
    <section className="console" aria-label="Games I've made">
      <div className="console-inner">
        <WiiRemote rumble={rumble} on={on} onPress={handleRemote} />
        <WiiScreen
          games={games}
          on={on}
          view={view}
          selected={selected}
          slide={slide}
          onHover={setSelected}
          onOpen={openChannel}
          onBack={backToMenu}
          onSlide={setSlide}
          onPlay={play}
        />
      </div>
      {playing && game.embed && (
        <GameModal
          title={game.title}
          src={game.embed}
          onClose={() => setPlaying(false)}
        />
      )}
    </section>
  );
}
