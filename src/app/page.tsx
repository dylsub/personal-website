import { DunkPlayer } from "@/components/dunk-player";
import { GamesIntro } from "@/components/games-intro";
import { WiiSection } from "@/components/wii/wii-section";
import { dunks } from "@/content/dunks";
import { games } from "@/content/games";
import { intro } from "@/content/intro";

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
    </main>
  );
}
