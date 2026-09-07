import type { Metadata } from "next";
import { AdSlot } from "../../components/ad-slot";
import { AffiliateDisclosure } from "../../components/affiliate-disclosure";
import { generateDailyIdeas } from "../../lib/content-engine";

export const metadata: Metadata = {
  title: "Ide Posting Facebook | Ide Posting FB Harian",
  description: "Kumpulan ide posting Facebook yang praktis untuk creator, ibu rumah tangga, dan pengguna yang ingin konsisten membuat konten.",
};

export default function PublicIdeasPage() {
  const ideas = generateDailyIdeas("rumah-tangga", new Date("2026-09-07T00:00:00+07:00"));
  return (
    <main className="shell">
      <header className="header">
        <div className="brand">Ide Posting FB Harian</div>
        <h1>Ide Posting Facebook</h1>
        <p className="subtitle">Inspirasi konten sederhana untuk membantu kamu mulai posting tanpa bingung mencari topik.</p>
      </header>
      <AdSlot slot="public-top" />
      <section className="idea-list">
        {ideas.map((idea) => (
          <article className="idea" key={idea.id}>
            <div className="idea-top"><span className="badge">{idea.pillar}</span><span className="badge">{idea.format}</span></div>
            <h2>{idea.title}</h2>
            <p>{idea.hook}</p>
            <strong>CTA:</strong>
            <p>{idea.cta}</p>
          </article>
        ))}
      </section>
      <AdSlot slot="public-middle" />
      <section className="card section">
        <h2>Cara menggunakan ide ini</h2>
        <p className="subtitle">Pilih satu ide yang paling sesuai, tambahkan pengalaman pribadi, gunakan bahasa yang natural, lalu publikasikan di Facebook.</p>
      </section>
      <AffiliateDisclosure />
      <footer className="footer"><a href="/">Kembali ke aplikasi</a> · <a href="/privasi">Privasi</a> · <a href="/ketentuan">Ketentuan</a></footer>
    </main>
  );
}
