// Scraped from https://dylsub.itch.io on 2026-11-03.
export type Game = {
  id: string;
  title: string;
  tagline: string;
  url: string;
  /** A build served from /public that plays in a modal instead of opening `url`. */
  embed?: string;
  cover: string;
  /** The channel slideshow. When empty, the cover is shown instead. */
  screenshots: string[];
  genre: string;
  platforms: string[];
  madeWith: string;
  /** One standout fact: a jam, an award. */
  note?: string;
  /** Where the note can be checked, such as a winners announcement. */
  noteUrl?: string;
  description: string[];
};

export const games: Game[] = [
  {
    id: "smog-city",
    title: "Smog City",
    tagline: "2D pixel art platformer",
    url: "https://dylsub.itch.io/smogcity",
    cover: "/games/smog-city/cover.png",
    screenshots: [
      "/games/smog-city/shot-1.png",
      "/games/smog-city/shot-2.png",
      "/games/smog-city/shot-3.png",
    ],
    genre: "Platformer",
    platforms: ["Browser"],
    madeWith: "Unity",
    note: "1st place, 2023 SkillsUSA State Competition",
    description: [
      "SMOG CITY is a 2D platformer inspired by Earth Week's initiative toward becoming a more eco-friendly society. The main player is a mysteriously hooded human that visits a dystopian city, possibly haunted by their past decisions.",
      "SMOG CITY includes multiple unique levels that increase in difficulty. Your goal is to get to the end of all the levels while picking up batteries and pollution along the way.",
      "Created in Unity Engine and programmed with C# over the span of a month.",
    ],
  },
  {
    id: "bee-careful",
    title: "Bee Careful",
    tagline: "Arcade game made with Kaboom.js",
    url: "https://github.com/dylsub/BeeCareful",
    embed: "/games/bee-careful/index.html",
    cover: "/games/bee-careful/shot-1.png",
    screenshots: [
      "/games/bee-careful/shot-1.png",
      "/games/bee-careful/shot-2.png",
      "/games/bee-careful/shot-3.png",
    ],
    genre: "Arcade",
    platforms: ["Browser"],
    madeWith: "Kaboom.js",
    note: "Honorable mention, Kajam 2022 ($10,000 prize pool)",
    noteUrl: "https://replit.com/blog/Kajam-winners22",
    description: [
      "Steer the bee with WASD or the arrow keys, grab powerups and chase a high score.",
    ],
  },
  {
    id: "pocapola",
    title: "PocaPola Island Adventure",
    tagline: "Explorative adventure game",
    url: "https://dylsub.itch.io/pocapola",
    cover: "/games/pocapola/cover.png",
    screenshots: [
      "/games/pocapola/shot-1.png",
      "/games/pocapola/shot-2.png",
      "/games/pocapola/shot-3.png",
    ],
    genre: "Adventure",
    platforms: ["Browser", "Windows", "macOS", "Linux"],
    madeWith: "Unity",
    note: "2nd place, 2022 SkillsUSA State Competition",
    description: [
      "PocaPola Island Adventure is a top-down adventure game with the ultimate goal of saving the environment. The game includes multiple unique characters and an interesting storyline that is completely up to the player to discover.",
      "This personal project was created with Unity Engine in 30 days.",
    ],
  },
  {
    id: "atoms-2d",
    title: "Atoms 2D",
    tagline: "2D platformer for GMTK Game Jam 2021",
    url: "https://dylsub.itch.io/atoms2d",
    cover: "/games/atoms-2d/cover.jpg",
    screenshots: ["/games/atoms-2d/shot-3.jpg", "/games/atoms-2d/shot-2.jpg"],
    genre: "Platformer, Adventure",
    platforms: ["Browser"],
    madeWith: "Unity",
    note: "Made in 48 hours for the GMTK 2021 Game Jam",
    description: [
      'Atoms2D is a platformer that focuses on growing your character by collecting "atoms." Collect all four and complete the final challenge to finish the game!',
    ],
  },
  {
    id: "forbidden-growth",
    title: "Forbidden Growth",
    tagline: "2D platformer based on nature",
    url: "https://dylsub.itch.io/forbiddengrowth",
    cover: "/games/forbidden-growth/cover.png",
    screenshots: [
      "/games/forbidden-growth/shot-2.png",
      "/games/forbidden-growth/shot-3.png",
      "/games/forbidden-growth/shot-1.png",
    ],
    genre: "Platformer",
    platforms: ["Browser"],
    madeWith: "Unity",
    note: "2nd place, 2021 SkillsUSA State Competition",
    description: [
      "Forbidden Growth is a short but sweet 2D platformer that focuses on quick reactions in order to survive.",
    ],
  },
  {
    id: "save-them",
    title: "Save Them",
    tagline: "Find the cure for your zombified friends",
    url: "https://dylsub.itch.io/savethemzombie",
    cover: "/games/save-them/cover.png",
    screenshots: [
      "/games/save-them/shot-2.png",
      "/games/save-them/shot-3.png",
      "/games/save-them/shot-4.png",
      "/games/save-them/shot-5.png",
      "/games/save-them/shot-1.png",
    ],
    genre: "Adventure",
    platforms: ["Browser"],
    madeWith: "Unity",
    note: "My first game",
    description: [
      '"Save Them" is an open-world 2D game where your goal is to explore an abandoned survival camp in order to look for a cure to bring back your zombified friends from the dead.',
      "You are armed with only a simple pistol with very limited ammo and will need to use skill to avoid getting eaten. There are three unique endings that can be unlocked, which vary based on how you interact with the zombies throughout the game.",
    ],
  },
];

export function slidesFor(game: Game) {
  return game.screenshots.length ? game.screenshots : [game.cover];
}
