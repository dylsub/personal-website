import { DunkPlayer } from "@/components/dunk-player";
import { dunks } from "@/content/dunks";
import { intro } from "@/content/intro";

export default function Home() {
  return (
    <main className="reel">
      <div className="intro-lead">
        <h1 className="intro-heading">{intro.heading}</h1>
        <p className="intro-goal">{intro.goal}</p>
      </div>
      <div className="intro-body">
        {intro.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <DunkPlayer dunks={dunks} />
    </main>
  );
}
