"use client";

import { useEffect, useState } from "react";
import { GameModal } from "@/components/game-modal";
import { usePageVisible } from "@/hooks/use-page-visible";
import { slidesFor, type Game } from "@/content/games";
import { WiiRemote, type RemoteButton } from "@/components/wii/wii-remote";
import { FAVORITES_SLOT, SLOTS, WiiScreen } from "@/components/wii/wii-screen";
import { favorites } from "@/content/favorites";
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
  const visible = usePageVisible();

  // The favorites slot has no game; its "slides" are the covers on its shelf.
  const game = selected === FAVORITES_SLOT ? undefined : games[selected];
  const slides = game ? slidesFor(game) : [];
  const count = game ? slides.length : favorites.games.length;

  useEffect(() => {
    if (!rumble) return;
    const timeout = setTimeout(() => setRumble(false), RUMBLE_MS);
    return () => clearTimeout(timeout);
  }, [rumble]);

  // Cycle through the game's images while its channel is open.
  useEffect(() => {
    if (view !== "channel" || !on || !visible || slides.length < 2) return;
    const interval = setInterval(
      () => setSlide((s) => (s + 1) % slides.length),
      SLIDE_MS,
    );
    return () => clearInterval(interval);
  }, [view, on, visible, slides.length, selected]);

  const openChannel = (index: number) => {
    setSelected(index);
    setSlide(0);
    setView("channel");
    setRumble(true);
  };

  const backToMenu = () => setView("menu");

  const play = () => {
    if (!game) return;
    if (game.embed) setPlaying(true);
    else window.open(game.url, "_blank", "noopener,noreferrer");
  };

  const step = (delta: number) => setSlide((s) => (s + delta + count) % count);

  const filled = (i: number) => i < games.length || i === FAVORITES_SLOT;

  const moveSelection = (delta: number) =>
    setSelected((s) => {
      const dir = Math.sign(delta);
      // Sideways: skip over empty slots to the next channel.
      if (Math.abs(delta) === 1) {
        for (let i = s + dir; i >= 0 && i < SLOTS; i += dir)
          if (filled(i)) return i;
        return s;
      }
      // Up or down: the closest channel in the nearest row that has one.
      const column = s % COLUMNS;
      for (
        let row = Math.floor(s / COLUMNS) + dir;
        row >= 0 && row < SLOTS / COLUMNS;
        row += dir
      ) {
        const inRow = Array.from(
          { length: COLUMNS },
          (_, c) => row * COLUMNS + c,
        )
          .filter(filled)
          .sort(
            (a, b) =>
              Math.abs((a % COLUMNS) - column) -
              Math.abs((b % COLUMNS) - column),
          );
        if (inRow.length) return inRow[0];
      }
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
      {playing && game?.embed && (
        <GameModal
          title={game.title}
          src={game.embed}
          onClose={() => setPlaying(false)}
        />
      )}
    </section>
  );
}
