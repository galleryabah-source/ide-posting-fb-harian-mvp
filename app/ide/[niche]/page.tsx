import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "../../../components/ad-slot";
import { AffiliateDisclosure } from "../../../components/affiliate-disclosure";
import { generateDailyIdeas, getNiches, type NicheId } from "../../../lib/content-engine";

export function generateStaticParams() {
  return getNiches().map((item) => ({ niche: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ niche: string }> }): Promise<Metadata> {
  const { niche } = await params;
  const match = getNiches().find((item) => item.id === niche);
  return {
    title: match ? `Ide Posting Facebook ${match.label}` : "Ide Posting Facebook",
    description: match ? `Kumpulan ide posting Facebook untuk tema ${match.label}.` : "Ide posting Facebook.",
  };
}

export default async function NicheIdeasPage({ params }: { params: Promise<{ niche: string }> }) {
  const { niche } = await params;
  const valid = getNiches().some((item) => item.id === niche);
  if (!valid) notFound();
  const ideas = generateDailyIdeas(niche as NicheId, new Date("2026-09-07T00:00:00+07:00"));
  const label = getNiches().find((item) => item.id === niche)?.label ?? "Facebook";

  return (
    <main className="shell">
      <header className="header"><div className="brand">Ide Posting FB Harian</div><h1>Ide Posting Facebook: {label}</h1><p className="subtitle">Pilih satu ide, sesuaikan dengan pengalamanmu, lalu gunakan sebagai bahan posting.</p></header>
      <AdSlot slot={`public-${niche}-top`} />
      <section className="idea-list">{ideas.map((idea) => <article className="idea" key={idea.id}><div className="idea-top"><span className="badge">{idea.pillar}</span><span className="badge">{idea.format}</span></div><h2>{idea.title}</h2><p>{idea.hook}</p><strong>Ajakan:</strong><p>{idea.cta}</p></article>)}</section>
      <AdSlot slot={`public-${niche}-bottom`} />
      <AffiliateDisclosure />
      <footer className="footer"><a href="/">Kembali ke aplikasi</a> · <a href="/ide-postingan-facebook">Semua ide</a> · <a href="/privasi">Privasi</a></footer>
    </main>
  );
}
