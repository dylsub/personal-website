import { Binder } from "@/components/binder/binder";
import { DunkPlayer } from "@/components/dunk-player";
import { ThreeDSViewer } from "@/components/three-ds/three-ds-viewer";
import { GamesIntro } from "@/components/games-intro";
import { GitHubIcon } from "@/components/github-icon";
import { InstagramIcon } from "@/components/instagram-icon";
import { LinkedInIcon } from "@/components/linkedin-icon";
import { XIcon } from "@/components/x-icon";
import { RecentProjects } from "@/components/recent-projects";
import { SectionNav } from "@/components/section-nav";
import { WiiSection } from "@/components/wii/wii-section";
import { about } from "@/content/about";
import { dunks } from "@/content/dunks";
import { games } from "@/content/games";
import { intro } from "@/content/intro";
import { projects } from "@/content/projects";
import { recentProjects } from "@/content/recent-projects";
import { site } from "@/content/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.handle,
  givenName: "Dylan",
  familyName: "Subramanian",
  url: site.url,
  image: `${site.url}/opengraph-image`,
  description: site.description,
  sameAs: site.profiles,
};

const MONTH_YEAR =
  /((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})/;

/** Sets month-year dates in the font with legible digits. */
function withReadableDates(text: string) {
  return text.split(MONTH_YEAR).map((part, i) =>
    i % 2 ? (
      <span key={i} className="numeric">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// Pinned first, then newest first ("YYYY-MM" sorts by date as plain text)
const newestFirst = recentProjects.toSorted(
  (a, b) =>
    Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date),
);

export default function Home() {
  return (
    <main>
      {/* Who this site is about, for search engines: my name, my handle,
          and the profiles elsewhere that are also me */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="site-banner">
        <h1 className="site-author">
          {site.name} <span>@{site.handle}</span>
        </h1>
        <ul className="site-links">
          <li>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              data-brand="linkedin"
            >
              <LinkedInIcon />
            </a>
          </li>
          <li>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              data-brand="github"
            >
              <GitHubIcon />
            </a>
          </li>
          <li>
            <a
              href={`https://www.instagram.com/${site.instagram}/reels/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              data-brand="instagram"
            >
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a
              href={site.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              data-brand="x"
            >
              <XIcon />
            </a>
          </li>
        </ul>
      </header>
      <section id="about" className="about" aria-labelledby="about-heading">
        <div className="about-text">
          <h2 id="about-heading" className="about-heading">
            {about.heading}
          </h2>
          <p className="about-body">{about.body}</p>
          <ul className="about-facts">
            {about.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
        <ThreeDSViewer
          photo={about.photo.src}
          alt={about.photo.alt}
          bottomPhoto={about.headshot.src}
          bottomAlt={about.headshot.alt}
          stamp="'25 11 05"
        />
      </section>
      <p className="aside">{about.aside}</p>
      <section
        id="projects"
        className="recent"
        aria-labelledby="recent-heading"
      >
        <h2 id="recent-heading" className="recent-heading">
          Recent projects
        </h2>
        <RecentProjects projects={newestFirst} />
      </section>
      <GamesIntro />
      <WiiSection games={games} />
      <section
        id="legacy"
        className="binder-section"
        aria-labelledby="projects-heading"
      >
        <Binder
          projects={projects}
          intro={
            <>
              <h2 id="projects-heading" className="binder-heading">
                Legacy projects
              </h2>
              <p className="binder-lede">
                <strong>Everything in this binder was built before AI.</strong>{" "}
                They&apos;re some of my most special creations. Writing CSS by
                hand and scouring documentation made me the engineer I am today,
                so they&apos;re well worth a look.
              </p>
              <p className="binder-cue" aria-hidden>
                Open the binder →
              </p>
            </>
          }
        />
      </section>
      <section id="dunks" className="reel">
        <div className="intro-lead">
          <h2 className="intro-heading">{intro.heading}</h2>
          <dl className="intro-stats">
            {intro.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p className="intro-goal">
            <span className="intro-goal-label">{intro.goal.label}</span>
            {intro.goal.text}
          </p>
        </div>
        <div className="intro-body">
          {intro.body.map((paragraph) => (
            <p key={paragraph}>{withReadableDates(paragraph)}</p>
          ))}
        </div>
        <DunkPlayer dunks={dunks} />
      </section>
      <p className="aside aside-end">
        Thank you for visiting my portfolio! Please contact me at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> if you want to chat 🔥
      </p>
      <SectionNav />
    </main>
  );
}
