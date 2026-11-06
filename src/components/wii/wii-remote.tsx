"use client";

export type RemoteButton =
  | "power"
  | "up"
  | "down"
  | "left"
  | "right"
  | "a"
  | "b"
  | "minus"
  | "home"
  | "plus"
  | "one"
  | "two";

type WiiRemoteProps = {
  on: boolean;
  onPress: (button: RemoteButton) => void;
};

export function WiiRemote({ on, onPress }: WiiRemoteProps) {
  const press = (button: RemoteButton) => () => onPress(button);

  return (
    <div className="remote">
      <button
        type="button"
        className="remote-btn remote-power"
        aria-label={on ? "Turn screen off" : "Turn screen on"}
        onClick={press("power")}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        >
          <path d="M12 3v8M6.3 7.2a8 8 0 1 0 11.4 0" />
        </svg>
      </button>

      <div className="dpad">
        <button
          type="button"
          className="dpad-arm dpad-up"
          aria-label="Up"
          onClick={press("up")}
        />
        <button
          type="button"
          className="dpad-arm dpad-down"
          aria-label="Down"
          onClick={press("down")}
        />
        <button
          type="button"
          className="dpad-arm dpad-left"
          aria-label="Left"
          onClick={press("left")}
        />
        <button
          type="button"
          className="dpad-arm dpad-right"
          aria-label="Right"
          onClick={press("right")}
        />
        <DpadFace />
      </div>

      <button
        type="button"
        className="remote-btn remote-a"
        onClick={press("a")}
      >
        A
      </button>
      {/* B is a trigger on the underside, peeking out past the left edge */}
      <button
        type="button"
        className="remote-trigger"
        aria-label="B"
        onClick={press("b")}
      >
        B
      </button>

      <button
        type="button"
        className="remote-btn remote-minus"
        aria-label="Minus"
        onClick={press("minus")}
      >
        −
      </button>
      <button
        type="button"
        className="remote-btn remote-home"
        aria-label="Home"
        onClick={press("home")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3 2 11.5h3V21h5.5v-5.5h3V21H19v-9.5h3z" />
        </svg>
      </button>
      <button
        type="button"
        className="remote-btn remote-plus"
        aria-label="Plus"
        onClick={press("plus")}
      >
        +
      </button>

      <div className="remote-speaker" aria-hidden>
        {Array.from({ length: 15 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <button
        type="button"
        className="remote-btn remote-num remote-one"
        onClick={press("one")}
      >
        1
      </button>
      <button
        type="button"
        className="remote-btn remote-num remote-two"
        onClick={press("two")}
      >
        2
      </button>

      <span className="remote-print remote-home-label" aria-hidden>
        HOME
      </span>

      {/* Player lights, each with its number printed in dots underneath */}
      <div className="remote-leds" aria-hidden>
        {[1, 2, 3, 4].map((player) => (
          <span key={player} className="remote-led">
            <span data-lit={(on && player === 1) || undefined} />
            <span className="remote-led-dots">
              {Array.from({ length: player }, (_, i) => (
                <i key={i} />
              ))}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * One molded cross: a single silhouette with a soft dish in the middle and
 * small raised arrows. The buttons above it are invisible hit areas.
 */
function DpadFace() {
  const arms = (
    <>
      <rect x="34" y="1" width="32" height="98" rx="5" />
      <rect x="1" y="34" width="98" height="32" rx="5" />
    </>
  );
  return (
    <svg className="dpad-face" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="dpad-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--button-hi)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--button)" }} />
          <stop offset="1" style={{ stopColor: "var(--button-lo)" }} />
        </linearGradient>
        <radialGradient id="dpad-dish" cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="dpad-edge">{arms}</g>
      <g fill="url(#dpad-body)">{arms}</g>
      <circle cx="50" cy="50" r="13" fill="url(#dpad-dish)" />
      <g className="dpad-arrows">
        <path d="M50 9 56 16H44z" />
        <path d="M50 91 44 84H56z" />
        <path d="M9 50 16 44V56z" />
        <path d="M91 50 84 56V44z" />
      </g>
    </svg>
  );
}
