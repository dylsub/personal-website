// Older projects, shown as cards in the binder. Adapted from my old portfolio
// (github.com/dylsub/Portfolio). Each card's art lives at
// /projects/<id>/art.*, and each playable build under /legacy/<id>/; run
// `npm run images` after adding art so it gets a blurred placeholder.

const SOURCE = "https://github.com/dylsub/Portfolio/blob/main";

/** A project's "type", after what it's built with. */
export const TYPES = {
  web: { label: "Web", short: "JS", color: "#e9c63b" },
} as const;

export type ProjectType = keyof typeof TYPES;

export type Project = {
  id: string;
  title: string;
  year: number;
  type: ProjectType;
  art: string;
  builtWith: string;
  description: string;
  /** Links printed on the card, such as the source code. */
  links: { label: string; href: string }[];
  /** A note in place of a way to play it, e.g. when the site is gone. */
  status?: string;
  rarity: "common" | "uncommon" | "rare";
  /** A self-hosted build under /public, played in the pop-up. */
  embed?: string;
  /** The embed's size; sites default to a laptop-sized window. */
  frame?: { width: number; height: number };
};

export const projects: Project[] = [
  {
    id: "stem-and-buds",
    title: "STEM & Buds Naperville",
    year: 2022,
    type: "web",
    art: "/projects/stem-and-buds/art.jpg",
    builtWith: "JavaScript, CSS and HTML",
    description:
      "An outreach site for STEM & Buds, a for-youth, by-youth nonprofit that introduces kids to STEM.",
    links: [],
    status: "The live site has since been retired.",
    rarity: "rare",
  },
  {
    id: "deca",
    title: "NVHS DECA Website",
    year: 2022,
    type: "web",
    art: "/projects/deca/art.jpg",
    builtWith: "JavaScript, CSS and HTML",
    description:
      "A prototype site for my school's DECA chapter, built to work as both an information hub and a resource for current members.",
    links: [{ label: "Source code", href: `${SOURCE}/deca.html` }],
    rarity: "uncommon",
    embed: "/legacy/deca/index.html",
  },
  {
    id: "to-do-list",
    title: "Online To-Do List",
    year: 2022,
    type: "web",
    art: "/projects/to-do-list/art.jpg",
    builtWith: "JavaScript, CSS and HTML",
    description:
      "Take notes and organize your responsibilities with this easy-to-use app. Your list saves in your browser.",
    links: [{ label: "Source code", href: `${SOURCE}/task.html` }],
    rarity: "rare",
    embed: "/legacy/to-do-list/index.html",
  },
  {
    id: "down-bad-test",
    title: "Down Bad Test",
    year: 2022,
    type: "web",
    art: "/projects/down-bad-test/art.jpg",
    builtWith: "JavaScript, CSS and HTML",
    description:
      'Take this checklist test to find out how "down bad" you are. For entertainment only.',
    links: [{ label: "Source code", href: `${SOURCE}/down.html` }],
    rarity: "rare",
    embed: "/legacy/down-bad-test/index.html",
  },
  {
    id: "gambling-simulator",
    title: "Gambling Simulator",
    year: 2022,
    type: "web",
    art: "/projects/gambling-simulator/art.jpg",
    builtWith: "JavaScript, CSS and HTML",
    description:
      "A gambling app I built to demonstrate probability for a STEM & Buds session.",
    links: [{ label: "Source code", href: `${SOURCE}/gamblingIndex.html` }],
    rarity: "common",
    embed: "/legacy/gambling-simulator/index.html",
  },
  {
    id: "vector-calculator",
    title: "3D Vector Calculator",
    year: 2022,
    type: "web",
    art: "/projects/vector-calculator/art.jpg",
    builtWith: "JavaScript, CSS and HTML",
    description:
      "A precalc calculator for 3D vectors: cross product, dot product and magnitude.",
    links: [{ label: "Source code", href: `${SOURCE}/vector.html` }],
    rarity: "common",
    embed: "/legacy/vector-calculator/index.html",
    frame: { width: 900, height: 640 },
  },
];
