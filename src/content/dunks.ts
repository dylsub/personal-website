export type Dunk = {
  id: string;
  title: string;
  /** ISO date: YYYY-MM-DD, or YYYY-MM when the day doesn't matter */
  date: string;
  src: string;
  poster: string;
  /** CSS object-position for the crop; defaults to centered. */
  position?: string;
  /** Scales the video up around `position`, for clips with no room to pan. */
  zoom?: number;
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
    // The hoop sits at the far left of this landscape clip. It already fills
    // the card's height, so zoom slightly to have room to frame it lower.
    position: "15% 75%",
    zoom: 1.1,
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
