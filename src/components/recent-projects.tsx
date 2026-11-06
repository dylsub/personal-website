"use client";

import { useState } from "react";
import { GameModal } from "@/components/game-modal";
import type { RecentProject } from "@/content/recent-projects";

/** The video's id, when a link is to a YouTube video. */
function youtubeId(href: string) {
  const url = new URL(href);
  if (url.hostname === "youtu.be") return url.pathname.slice(1);
  if (url.hostname.endsWith("youtube.com")) return url.searchParams.get("v");
  return null;
}

/** A compact list of projects; YouTube demos play in a modal over the page. */
export function RecentProjects({ projects }: { projects: RecentProject[] }) {
  const [playing, setPlaying] = useState<{
    title: string;
    href: string;
    id: string;
  }>();

  return (
    <>
      <ul className="recent-list">
        {projects.map((project) => {
          const videoId = project.demo && youtubeId(project.demo);
          return (
            <li key={project.title}>
              <p className="recent-title">
                {project.title}
                <span className="recent-meta">
                  {project.years ?? project.date.slice(0, 4)}
                  {project.tag && ` · ${project.tag}`}
                </span>
              </p>
              <p className="recent-description">{project.description}</p>
              {project.builds && (
                <ul className="recent-tools" aria-label="Projects">
                  {project.builds.map((build) => (
                    <li key={build}>{build}</li>
                  ))}
                </ul>
              )}
              {project.tools && (
                <ul className="recent-tools" aria-label="Built with">
                  {project.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              )}
              <p className="recent-links">
                {project.code && (
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code ↗
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      // Without a video, or with a modifier key held, let the
                      // link open its own tab
                      if (!videoId || e.metaKey || e.ctrlKey || e.shiftKey)
                        return;
                      e.preventDefault();
                      setPlaying({
                        title: project.title,
                        href: project.demo!,
                        id: videoId,
                      });
                    }}
                  >
                    {videoId ? "Demo ▶" : "Demo ↗"}
                  </a>
                )}
              </p>
            </li>
          );
        })}
      </ul>
      {playing && (
        <GameModal
          title={`${playing.title} demo`}
          src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1`}
          href={playing.href}
          width={960}
          height={540}
          onClose={() => setPlaying(undefined)}
        />
      )}
    </>
  );
}
