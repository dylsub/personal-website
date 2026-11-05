"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { GameModal } from "@/components/game-modal";
import { ProjectCard } from "@/components/binder/project-card";
import type { Project } from "@/content/projects";
import "./binder.css";

const POCKETS = 4;
const WIDE = "(min-width: 64rem)";

/** Two pages side by side on wide screens, one at a time on narrow ones. */
function usePagesPerView() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(WIDE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => (window.matchMedia(WIDE).matches ? 2 : 1),
    () => 1,
  );
}

type Phase = "closed" | "opening" | "open" | "closing";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Older projects kept as cards in a binder. Shut, it's just its cover, lying
 * over the pages already in place beneath; opening swings the cover over on
 * the spine, its inside landing as the left-hand page. The pages turn with
 * the arrows or ← →. Picking a card holds it up close, and from there it can
 * be played.
 */
export function Binder({
  projects,
  intro,
}: {
  projects: Project[];
  /** Set beside the shut binder, where the open pages will cover it. */
  intro: ReactNode;
}) {
  const perView = usePagesPerView();
  const [phase, setPhase] = useState<Phase>("closed");
  const [view, setView] = useState(0);
  // Which way the last turn went, so the new pages slide in from that side.
  // None until the first turn, so opening the binder doesn't replay a slide.
  const [turn, setTurn] = useState<"next" | "back" | null>(null);
  const [held, setHeld] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const spreadRef = useRef<HTMLDivElement>(null);

  // Whole spreads only, so a wide view never shows half a sheet.
  const pageCount =
    Math.ceil(Math.max(1, Math.ceil(projects.length / POCKETS)) / perView) *
    perView;
  const views = pageCount / perView;
  const current = Math.min(view, views - 1);
  const first = current * perView;
  const visible = Array.from({ length: perView }, (_, i) => first + i);
  const isOpen = phase === "open";

  const open = () => setPhase(reducedMotion() ? "open" : "opening");

  const close = () => {
    setView(0);
    setTurn(null);
    setPhase(reducedMotion() ? "closed" : "closing");
  };

  const go = (delta: number) => {
    const next = current + delta;
    if (next < 0 || next >= views) return;
    setTurn(delta > 0 ? "next" : "back");
    setView(next);
  };

  // Once open, move focus into the pages so the arrow keys work at once.
  useEffect(() => {
    if (phase === "open") spreadRef.current?.focus();
  }, [phase]);

  // The spread's pages. Also drawn on the inside of the cover as it swings,
  // where only its left half shows, so the left page arrives already filled.
  const pages = (copy: boolean) => (
    <div
      key={copy ? "copy" : current}
      className="binder-pages"
      data-turn={(!copy && turn) || undefined}
    >
      {visible.map((page) => (
        <section
          key={page}
          className="binder-page"
          aria-label={copy ? undefined : `Page ${page + 1}`}
        >
          {Array.from({ length: POCKETS }, (_, slot) => {
            const index = page * POCKETS + slot;
            const p = projects[index];
            return (
              <div key={slot} className="binder-pocket">
                {p && (
                  <button
                    type="button"
                    className="binder-card"
                    aria-label={`Look at ${p.title}`}
                    onClick={() => setHeld(index)}
                  >
                    <ProjectCard
                      project={p}
                      number={index + 1}
                      total={projects.length}
                      sizes="(min-width: 64rem) 230px, 40vw"
                    />
                  </button>
                )}
              </div>
            );
          })}
        </section>
      ))}
      {perView === 2 && (
        <div className="binder-rings" aria-hidden>
          <i />
          <i />
          <i />
        </div>
      )}
    </div>
  );

  const project = held === null ? null : projects[held];
  const game = playing === null ? null : projects[playing];

  return (
    <div
      className="binder"
      data-phase={phase}
      data-wide={perView === 2 || undefined}
    >
      <div className="binder-intro" inert={isOpen}>
        {intro}
      </div>

      <div className="binder-stage">
        {isOpen && (
          <button
            type="button"
            className="binder-arrow"
            aria-label="Previous pages"
            disabled={current === 0}
            onClick={() => go(-1)}
          >
            <Chevron flip />
          </button>
        )}

        <div
          ref={spreadRef}
          className="binder-spread"
          tabIndex={-1}
          aria-label="Project binder"
          onKeyDown={(e) => {
            if (!isOpen) return;
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          {/* Under the cover until it's fully open, and out of reach till then */}
          <div className="binder-base" inert={!isOpen}>
            {pages(false)}
          </div>

          {!isOpen && (
            <>
              <div
                className="binder-flipper"
                data-motion={
                  phase === "opening"
                    ? "open"
                    : phase === "closing"
                      ? "close"
                      : undefined
                }
                onAnimationEnd={(e) => {
                  if (e.target !== e.currentTarget) return;
                  setPhase(phase === "opening" ? "open" : "closed");
                }}
              >
                <button
                  type="button"
                  className="binder-cover"
                  aria-label="Open the project binder"
                  disabled={phase !== "closed"}
                  onClick={open}
                >
                  <Cover count={projects.length} />
                </button>
                {perView === 2 && (
                  <div className="binder-cover-inside" aria-hidden inert>
                    <div className="binder-cover-inside-pages">
                      {pages(true)}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {isOpen && (
          <button
            type="button"
            className="binder-arrow"
            aria-label="Next pages"
            disabled={current === views - 1}
            onClick={() => go(1)}
          >
            <Chevron />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="binder-controls">
          <p aria-live="polite">
            {perView === 2
              ? `Pages ${first + 1}–${first + 2} of ${pageCount}`
              : `Page ${first + 1} of ${pageCount}`}
          </p>
          <button type="button" onClick={close}>
            Close binder
          </button>
        </div>
      )}

      {project && held !== null && (
        <CardViewer
          project={project}
          number={held + 1}
          total={projects.length}
          onClose={() => setHeld(null)}
          onPlay={() => {
            setPlaying(held);
            setHeld(null);
          }}
        />
      )}

      {game?.embed && (
        <GameModal
          title={game.title}
          src={game.embed}
          width={game.frame?.width ?? 1280}
          height={game.frame?.height ?? 800}
          onClose={() => setPlaying(null)}
        />
      )}
    </div>
  );
}

/** The binder's front: padded vinyl, a label plate and a round clasp. */
function Cover({ count }: { count: number }) {
  return (
    <span className="binder-cover-face">
      <span className="binder-label">
        <span className="binder-title">Legacy Projects</span>
        <span className="binder-volume">Vol. 1</span>
      </span>
      <span className="binder-sticker">
        Caught <b>{String(count).padStart(2, "0")}</b>
      </span>
      <span className="binder-clasp" />
      <span className="binder-hint">Click to open</span>
    </span>
  );
}

/** A card held up close, readable, with the ways to play it. */
function CardViewer({
  project,
  number,
  total,
  onClose,
  onPlay,
}: {
  project: Project;
  number: number;
  total: number;
  onClose: () => void;
  onPlay: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  // See GameModal: no close() on cleanup, or dev's double mount shuts it.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="card-viewer"
      aria-label={project.title}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ProjectCard
        project={project}
        number={number}
        total={total}
        sizes="(min-width: 40rem) 380px, 85vw"
        live
      />
      <div className="card-viewer-actions">
        {project.embed && (
          <>
            <button type="button" className="card-viewer-play" onClick={onPlay}>
              Play
            </button>
            <a href={project.embed} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
          </>
        )}
        <button type="button" onClick={onClose}>
          Back to binder
        </button>
      </div>
    </dialog>
  );
}

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      style={flip ? { scale: "-1 1" } : undefined}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
