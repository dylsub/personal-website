import { DunkPlayer } from "@/components/dunk-player";
import { dunks } from "@/content/dunks";
import { intro } from "@/content/intro";

export default function Home() {
  return (
    <main className="reel">
      <h1 className="intro-heading">{intro.heading}</h1>
      <div className="intro-body">
        {intro.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="intro-footer">{intro.footer}</p>
      <DunkPlayer dunks={dunks} />
    </main>
  );
}
