// Newer projects, listed compactly above the Wii. The page sorts them
// newest first (pinned ones ahead of the rest), so entries can go in any
// order.

export type RecentProject = {
  title: string;
  /** When it was built, as "YYYY-MM"; the page shows the year. */
  date: string;
  /** Shown in place of the year, for work that spans several */
  years?: string;
  description: string;
  /** Listed first, ahead of newer projects */
  pinned?: boolean;
  /** Shown as a small tag, e.g. for the blockchain projects. */
  tag?: string;
  /** The main languages, frameworks and libraries it was built with */
  tools?: string[];
  /** For an entry that groups several builds, what they were */
  builds?: string[];
  code?: string;
  demo?: string;
};

export const recentProjects: RecentProject[] = [
  {
    title: "Synchrony Hackathons",
    date: "2026-07",
    years: "2024–2026",
    description:
      "Builds from Synchrony's internal hackathons. 3 won awards, and I demoed to company leadership.",
    tag: "Internal",
    builds: [
      "Product Engineer MCP",
      "Apple Vision Pro Org Tool",
      "Next-gen Visualization",
      "CRM Dashboard",
      "Customer Loyalty Platform",
    ],
  },
  {
    title: "Above The Rim",
    date: "2025-12",
    description:
      "An NBA player comparison platform: vote head-to-head to build a community leaderboard, with stats and comments on every player.",
    tools: ["React", "Express", "MySQL", "Google Cloud SQL"],
    code: "https://github.com/dylsub/AboveTheRim",
    demo: "https://www.youtube.com/watch?v=cvdICfL3uJ8",
  },
  {
    title: "EigenHealth",
    date: "2025-02",
    description:
      "Holds hospital AI models to their accuracy claims. P2P Use Case track prize at Eigen Games 2025.",
    tag: "Blockchain",
    tools: ["Next.js", "Solidity", "EigenLayer", "wagmi", "MongoDB"],
    code: "https://github.com/Amitten77/ETHDenver2025",
    demo: "https://www.youtube.com/watch?v=7xcUEemwszY",
  },
  {
    title: "SHIFA Clinic",
    date: "2026-06",
    description: "Website and admin dashboard for a non-profit clinic.",
    tools: ["Next.js", "Express", "MongoDB", "Firebase", "Tailwind"],
    code: "https://github.com/dylsub/SHIFAClinicWebsite",
    demo: "https://shifa-clinic-website.vercel.app/",
  },
  {
    title: "LinkedIn Experience Scraper",
    date: "2024-05",
    description:
      "Pulls the experience section from a list of LinkedIn profiles into a CSV.",
    tools: ["Python", "Selenium", "BeautifulSoup", "pandas"],
    code: "https://github.com/dylsub/linkedin-experience-scraper",
  },
  {
    title: "Fridg.ai",
    date: "2024-03",
    description:
      "Tracks what goes in and out of your fridge and warns you before food expires. Catapult AI Hackathon at Purdue.",
    tools: ["Next.js", "Flask", "OpenCV", "YOLO", "OpenAI"],
    code: "https://github.com/Amitten77/CatapultHacks",
    demo: "https://www.youtube.com/watch?v=b7VOOHsYkdk",
  },
  {
    title: "ShotChain",
    date: "2024-02",
    description:
      "Post a crypto question with a bounty and experts apply to answer it. 1st place finalist at Starknet Hacker House Denver.",
    tag: "Blockchain",
    tools: ["Next.js", "Cairo", "Starknet", "Express", "MongoDB"],
    code: "https://github.com/IlliniBlockchain/ShotChain",
    demo: "https://www.youtube.com/watch?v=Y7WrLGbOVqw",
  },
  {
    title: "Open Source Monetization",
    date: "2023-10",
    description:
      "A smart contract that rewards open-source repos from their GitHub stats. Illini Blockchain.",
    tag: "Blockchain",
    tools: ["Next.js", "Solidity", "Truffle", "Flask", "Express"],
    code: "https://github.com/Amitten77/OSMonetization",
  },
  {
    title: "Pet Cam",
    date: "2026-08",
    pinned: true,
    description:
      "AI pet monitor for a cat and a bunny, with a custom-trained bunny detector and a live view that shuts off when people are home.",
    tools: ["YOLO", "OpenCV", "FastAPI", "MongoDB", "Next.js", "Swift"],
    code: "https://github.com/ashwinjain/pet-cam",
    demo: "https://dylans-mac-mini.tail70e062.ts.net:8443/timeline",
  },
  {
    title: "Solar Telemetry",
    date: "2026-10",
    description:
      "An ESP32 sensor on my balcony solar panel, streaming readings through a data pipeline into live dashboards.",
    tools: ["ESP32", "MQTT", "Postgres", "dbt", "Dagster", "Grafana"],
    code: "https://github.com/dylsub/solar-telemetry",
  },
];
