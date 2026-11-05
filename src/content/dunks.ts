export type Dunk = {
  id: string;
  title: string;
  /** ISO date: YYYY-MM-DD, or YYYY-MM when the day doesn't matter */
  date: string;
  src: string;
  poster: string;
  /** CSS object-position for the crop; defaults to centered. */
  position?: string;
};

export const dunks: Dunk[] = [
  {
    id: "first-rim-grab",
    title: "First rim grab",
    date: "2019-12",
    src: "/videos/first-rim-grab.mp4",
    poster: "/videos/first-rim-grab.jpg",
  },
  {
    id: "first-dunk",
    title: "First dunk",
    date: "2021-08",
    src: "/videos/first-dunk.mp4",
    poster: "/videos/first-dunk.jpg",
    // The hoop sits at the far left of this landscape clip.
    position: "15% 50%",
  },
  {
    id: "first-in-game-dunk",
    title: "First in-game dunk",
    date: "2022-08",
    src: "/videos/first-in-game-dunk.mp4",
    poster: "/videos/first-in-game-dunk.jpg",
    // The hoop sits high in the frame, across the court.
    position: "50% 30%",
  },
  {
    id: "one-foot-windmill",
    title: "1 foot windmill",
    date: "2024-02",
    src: "/videos/one-foot-windmill.mp4",
    poster: "/videos/one-foot-windmill.jpg",
  },
  {
    id: "first-dunk-after-surgery",
    title: "First dunk from knee surgery",
    date: "2025-09",
    src: "/videos/first-dunk-after-surgery.mp4",
    poster: "/videos/first-dunk-after-surgery.jpg",
  },
  {
    id: "first-eastbay",
    title: "First eastbay",
    date: "2026-04",
    src: "/videos/first-eastbay.mp4",
    poster: "/videos/first-eastbay.jpg",
    position: "50% 25%",
  },
  {
    id: "two-hand-windmill",
    title: "Two-hand windmill",
    date: "2026-06",
    src: "/videos/two-hand-windmill.mp4",
    poster: "/videos/two-hand-windmill.jpg",
    position: "50% 51.5%",
  },
  {
    id: "double-up-reverse-windmill",
    title: "Double up reverse windmill",
    date: "2026-06",
    src: "/videos/double-up-reverse-windmill.mp4",
    poster: "/videos/double-up-reverse-windmill.jpg",
  },
  {
    id: "over-four-people",
    title: "Over 4 people",
    date: "2026-06",
    src: "/videos/over-four-people.mp4",
    poster: "/videos/over-four-people.jpg",
    position: "50% 17%",
  },
  {
    id: "windmill",
    title: "Windmill",
    date: "2026-10-11",
    src: "/videos/windmill.mp4",
    poster: "/videos/windmill.jpg",
    position: "50% 35%",
  },
  {
    id: "eastbay-over-two",
    title: "Eastbay over two",
    date: "2026-10-21",
    src: "/videos/eastbay-over-two.mp4",
    poster: "/videos/eastbay-over-two.jpg",
  },
];
