import type { Metadata } from "next";
import { AdSlot } from "../../components/ad-slot";
import { AffiliateDisclosure } from "../../components/affiliate-disclosure";
import { generateDailyIdeas } from "../../lib/content-engine";

export const metadata: Metadata = {
  title: "Ide Posting Facebook Hari Ini | Ide Posting FB Harian",
  description: "Lima inspirasi ide posting Facebook untuk hari ini yang bisa kamu sesuaikan dengan pengalaman dan gaya tulisanmu.",
};

export default function TodayIdeasPage() {
  const ideas = generateDailyIdeas("rumah-tangga", new Date());
  return (
    <main className="shell">
      <header className="header"><div className="brand">Ide Posting FB Harian</div><h1>Ide Posting Facebook Hari Ini</h1><p className="subtitle">Beberapa pilihan ide untuk membantu kamu mulai posting hari ini.</p></header>
      <AdSlot slot="today-top" />
      <section className="idea-list">{ideas.map((idea) => <article className="idea" key={idea.id}><div className="idea-top"><span className="badge">{idea.pillar}</span><span className="badge">{idea.format}</span></div><h2>{idea.title}</h2><p>{idea.hook}</p><strong>Ajakan:</strong><p>{idea.cta}</p></article>)}</section>
      <AffiliateDisclosure />
      <footer className="footer"><a href="/">Buka aplikasi</a> · <a href="/ide-postingan-facebook">Ide lainnya</a></footer>
    </main>
  );
}
