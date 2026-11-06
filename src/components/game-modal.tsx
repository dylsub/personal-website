"use client";

import { useEffect, useRef } from "react";

type GameModalProps = {
  title: string;
  src: string;
  /** The build's native size; the frame keeps this shape as it shrinks. */
  width?: number;
  height?: number;
  /** Where "Open in new tab" goes, when that isn't `src` itself. */
  href?: string;
  onClose: () => void;
};

/** Plays a self-hosted game in an iframe over the page. */
export function GameModal({
  title,
  src,
  width = 475,
  height = 563,
  href = src,
  onClose,
}: GameModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // No close() on cleanup: it fires `close`, which would call onClose and
  // unmount the modal the moment it opens (React mounts twice in dev).
  // Unmounting removes the dialog, which takes it off the screen anyway.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="game-modal"
      aria-label={title}
      onClose={onClose}
      // A click that lands on the dialog itself, not its content, is the backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="game-modal-frame">
        <header>
          <h2>{title}</h2>
          <div className="game-modal-actions">
            <a href={href} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
            <button type="button" aria-label="Close" onClick={onClose}>
              ×
            </button>
          </div>
        </header>
        <iframe
          src={src}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ width, aspectRatio: `${width} / ${height}` }}
          onLoad={(e) => {
            // Keys go to the game, not the page, once the frame has focus,
            // so listen inside it for Escape too.
            const frame = e.currentTarget;
            frame.focus();
            // Another site's frame (a YouTube video) won't take a listener.
            try {
              frame.contentWindow?.addEventListener("keydown", (key) => {
                if (key.key === "Escape") onClose();
              });
            } catch {}
          }}
        />
      </div>
    </dialog>
  );
}
