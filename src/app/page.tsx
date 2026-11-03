import { DunkPlayer } from "@/components/dunk-player";
import { dunks } from "@/content/dunks";

export default function Home() {
  return <DunkPlayer dunks={dunks} />;
}
