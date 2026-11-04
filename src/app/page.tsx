import { DunkPlayer } from "@/components/dunk-player";
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
      <section className="reel">
        <div className="intro-lead">
          <h1 className="intro-heading">{intro.heading}</h1>
          <p className="intro-goal">{intro.goal}</p>
        </div>
        <div className="intro-body">
          {intro.body.map((paragraph) => (
            <p key={paragraph}>{withReadableDates(paragraph)}</p>
          ))}
        </div>
        <DunkPlayer dunks={dunks} />
      </section>
      <WiiSection games={games} />
    </main>
  );
}
