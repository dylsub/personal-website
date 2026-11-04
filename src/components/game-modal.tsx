"use client";

import { useEffect, useRef } from "react";

type GameModalProps = {
  title: string;
  src: string;
  onClose: () => void;
};

/** Plays a self-hosted game in an iframe over the page. */
export function GameModal({ title, src, onClose }: GameModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
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
          <button type="button" aria-label="Close game" onClick={onClose}>
            ×
          </button>
        </header>
        <iframe
          src={src}
          title={title}
          onLoad={(e) => {
            // Keys go to the game, not the page, once the frame has focus,
            // so listen inside it for Escape too.
            const frame = e.currentTarget;
            frame.focus();
            frame.contentWindow?.addEventListener("keydown", (key) => {
              if (key.key === "Escape") onClose();
            });
          }}
        />
      </div>
    </dialog>
  );
}
