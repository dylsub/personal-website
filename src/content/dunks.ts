export type Dunk = {
  id: string;
  title: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  src: string;
  poster: string;
  /** CSS object-position for the crop; defaults to centered. */
  position?: string;
};

export const dunks: Dunk[] = [
  {
    id: "eastbay-over-two",
    title: "Eastbay over two",
    date: "2026-10-21",
    src: "/videos/eastbay-over-two.mp4",
    poster: "/videos/eastbay-over-two.jpg",
  },
  {
    id: "windmill",
    title: "Windmill",
    date: "2026-10-11",
    src: "/videos/windmill.mp4",
    poster: "/videos/windmill.jpg",
    position: "50% 35%",
  },
];
