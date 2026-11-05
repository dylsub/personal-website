/**
 * Type pairings under trial. Each sets three roles in globals.css:
 * display (headlines), body (paragraphs) and label (dates, small print).
 * The iPod screen keeps its pixel font throughout.
 */
export const FONT_COMBOS = {
  1: "Computer manual: Fraunces + IBM Plex Mono",
  2: "Typewriter bulletin: Young Serif + Courier Prime",
  3: "Spec sheet: Archivo Expanded + Space Mono",
  4: "Clip-art zine: Bricolage Grotesque + DM Mono",
  5: "Broadsheet: Old Standard + Libre Franklin",
} as const;

export type FontCombo = keyof typeof FONT_COMBOS;

export const ACTIVE_COMBO: FontCombo = 1;
