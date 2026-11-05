"use client";

import { useEffect, useRef } from "react";
import { ACTIVE_COMBO, FONT_COMBOS } from "@/content/font-combos";

const STORAGE_KEY = "font-combo";

const apply = (combo: string) => {
  document.documentElement.dataset.fonts = combo;
};

/** Development-only picker for comparing the type pairings in place. */
export function FontSwitcher() {
  const selectRef = useRef<HTMLSelectElement>(null);

  // Restore the last pairing picked, so a reload keeps it.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in FONT_COMBOS && selectRef.current) {
        selectRef.current.value = saved;
        apply(saved);
      }
    } catch {}
  }, []);

  return (
    <label className="font-switcher">
      <span>Fonts</span>
      <select
        ref={selectRef}
        defaultValue={ACTIVE_COMBO}
        onChange={(e) => {
          apply(e.target.value);
          try {
            localStorage.setItem(STORAGE_KEY, e.target.value);
          } catch {}
        }}
      >
        {Object.entries(FONT_COMBOS).map(([key, name]) => (
          <option key={key} value={key}>
            {key}. {name}
          </option>
        ))}
      </select>
    </label>
  );
}
