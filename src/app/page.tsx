import { DunkPlayer } from "@/components/dunk-player";
import { SiteFooter } from "@/components/site-footer";
import { dunks } from "@/content/dunks";

export default function Home() {
  return (
    <>
      <DunkPlayer dunks={dunks} />
      <SiteFooter />
    </>
  );
}
