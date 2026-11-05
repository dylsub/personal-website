/**
 * TV static: a tile of noise (/noise.png) on an oversized layer that jumps
 * between offsets on a stepped CSS animation. Moving a layer is work the
 * compositor does alone, so the static costs no script or repainting.
 * Invisible and paused until `burst` flashes it over the video.
 */
export function FilmGrain({
  burst = false,
  className,
}: {
  burst?: boolean;
  className?: string;
}) {
  return (
    <div
      className={className ? `film-grain ${className}` : "film-grain"}
      data-burst={burst || undefined}
      aria-hidden
    />
  );
}
