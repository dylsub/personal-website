import type { CSSProperties } from "react";
import { BlurImage } from "@/components/blur-image";
import { TYPES, type Project } from "@/content/projects";

const pad = (n: number) => String(n).padStart(3, "0");

// Common, uncommon, rare: the little mark by the set number.
const RARITY = { common: "●", uncommon: "◆", rare: "★" } as const;

/**
 * A project drawn as a trading card: name and year across the top, the art,
 * what it is, and where to find it. Everything inside is sized against the
 * card's own width, so it reads the same in a pocket or held up close.
 * Links only work held up close; in a pocket the whole card is the button.
 */
export function ProjectCard({
  project,
  number,
  total,
  sizes,
  live = false,
}: {
  project: Project;
  number: number;
  total: number;
  sizes: string;
  live?: boolean;
}) {
  const type = TYPES[project.type];
  return (
    <article
      className="pcard"
      style={{ "--type": type.color } as CSSProperties}
      aria-label={`${project.title}, ${project.year}`}
    >
      <div className="pcard-face">
        <header className="pcard-top">
          <h3 className="pcard-name">{project.title}</h3>
          <span className="pcard-level">
            Lv.<b>{String(project.year).slice(2)}</b>
          </span>
          <span className="pcard-energy" title={type.label}>
            {type.short}
          </span>
        </header>

        <div className="pcard-art">
          <BlurImage src={project.art} alt="" sizes={sizes} />
        </div>
        <p className="pcard-info">Built with {project.builtWith}</p>

        <p className="pcard-description">{project.description}</p>

        {project.status && <p className="pcard-status">{project.status}</p>}

        {project.links.length > 0 && (
          <ul className="pcard-links">
            {project.links.map((link) => (
              <li key={link.href}>
                {live ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label} ↗
                  </a>
                ) : (
                  <span>{link.label} ↗</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <footer className="pcard-foot">
          <span>Dylan Subramanian</span>
          <span>
            {pad(number)}/{pad(total)} {RARITY[project.rarity]}
          </span>
        </footer>
      </div>
    </article>
  );
}
