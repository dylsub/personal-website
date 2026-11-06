import { gamesIntro } from "@/content/games-intro";
import "./games-intro.css";

/** The games story told as a level-select path; the last stage is unreached. */
export function GamesIntro() {
  const { heading, stages } = gamesIntro;
  return (
    <section id="games" className="games-intro">
      <h2 className="games-intro-heading">{heading}</h2>
      <ol className="level-path">
        {stages.map((stage, i) => (
          <li
            key={stage.title}
            className="level"
            data-ahead={i === stages.length - 1 || undefined}
          >
            <span className="level-node" aria-hidden />
            <h3 className="level-title">{stage.title}</h3>
            <p className="level-text">{stage.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
