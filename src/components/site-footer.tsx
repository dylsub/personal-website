import { InstagramIcon } from "@/components/instagram-icon";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a
        className="instagram"
        href={`https://www.instagram.com/${site.instagram}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon />
        <span>@{site.instagram}</span>
      </a>
    </footer>
  );
}
