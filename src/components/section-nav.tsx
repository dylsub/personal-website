"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "games", label: "Games" },
  { id: "legacy", label: "Legacy" },
  { id: "dunks", label: "Dunks" },
];

/**
 * A dock along the bottom of the screen with a link to each section. The
 * one being read has its LED lit, like the 3DS's power light.
 */
export function SectionNav() {
  const [current, setCurrent] = useState(SECTIONS[0].id);

  useEffect(() => {
    let frame = 0;
    // The last section whose top has passed the upper half of the screen
    const update = () => {
      frame = 0;
      let id = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.45) {
          id = section.id;
        }
      }
      setCurrent(id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className="section-nav" aria-label="Sections">
      <ul>
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={current === id ? "location" : undefined}
              onClick={(e) => {
                const el = document.getElementById(id);
                if (!el) return;
                e.preventDefault();
                const still = matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches;
                const behavior = still ? "auto" : "smooth";
                // The first section goes right to the top, so the byline
                // over it shows too
                if (id === SECTIONS[0].id) scrollTo({ top: 0, behavior });
                else el.scrollIntoView({ behavior });
                history.replaceState(null, "", `#${id}`);
              }}
            >
              <span className="section-nav-led" aria-hidden />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
