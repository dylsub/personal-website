import { Binder } from "@/components/binder/binder";
import { DunkPlayer } from "@/components/dunk-player";
import { GamesIntro } from "@/components/games-intro";
import { WiiSection } from "@/components/wii/wii-section";
import { dunks } from "@/content/dunks";
import { games } from "@/content/games";
import { intro } from "@/content/intro";
import { projects } from "@/content/projects";

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

export default function Home() {
  return (
    <main>
      <header className="site-banner">
        <p>todo... more coming soon</p>
      </header>
      <section className="reel">
        <div className="intro-lead">
          <h1 className="intro-heading">{intro.heading}</h1>
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
      <GamesIntro />
      <WiiSection games={games} />
      <section className="binder-section" aria-labelledby="projects-heading">
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
    </main>
  );
}
