"use client";

import { useMemo, useState } from "react";
import {
  generateDailyIdeas,
  generatePost,
  getNiches,
  type ContentIdea,
  type NicheId,
} from "../lib/content-engine";

const SAVED_KEY = "ide-posting-fb-harian:saved";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const niches = useMemo(() => getNiches(), []);
  const [niche, setNiche] = useState<NicheId>("rumah-tangga");
  const [ideas, setIdeas] = useState<ContentIdea[]>(() => generateDailyIdeas("rumah-tangga"));
  const [selected, setSelected] = useState<ContentIdea | null>(null);
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [copied, setCopied] = useState(false);

  function refreshIdeas(nextNiche: NicheId) {
    setNiche(nextNiche);
    setSelected(null);
    setCopied(false);
    setIdeas(generateDailyIdeas(nextNiche));
  }

  function toggleSave(idea: ContentIdea) {
    const next = saved.includes(idea.id) ? saved.filter((id) => id !== idea.id) : [...saved, idea.id];
    setSaved(next);
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      // Local persistence is optional; the app remains usable when storage is blocked.
    }
  }

  async function copyPost(idea: ContentIdea) {
    const post = generatePost(idea);
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="shell">
      <header className="header">
        <div className="brand">Ide Posting FB Harian</div>
        <h1>Hari ini mau posting apa?</h1>
        <p className="subtitle">Pilih tema. Dapat ide. Buat posting. Selesai.</p>
      </header>

      <section className="card hero" aria-label="Pemilih tema">
        <div>
          <div className="label">Tema</div>
          <select className="select" value={niche} onChange={(event) => refreshIdeas(event.target.value as NicheId)}>
            {niches.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="ad-slot" aria-label="Tempat iklan">Advertisement</div>

      <section className="section">
        <div className="label">5 ide hari ini</div>
        <div className="idea-list">
          {ideas.map((idea) => (
            <article className="idea" key={idea.id}>
              <div className="idea-top">
                <span className="badge">{idea.pillar}</span>
                <span className="badge">{idea.format}</span>
                {idea.affiliateOpportunity && <span className="badge">bisa affiliate</span>}
              </div>
              <h2>{idea.title}</h2>
              <p>{idea.hook}</p>
              <div className="actions">
                <button className="primary" onClick={() => setSelected(idea)}>Buat posting</button>
                <button className={`secondary ${saved.includes(idea.id) ? "saved" : ""}`} onClick={() => toggleSave(idea)}>
                  {saved.includes(idea.id) ? "✓ Disimpan" : "♡ Simpan"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <section className="card section" aria-label="Hasil posting">
          <div className="label">Posting siap pakai</div>
          <h2>{selected.title}</h2>
          <div className="post">{generatePost(selected)}</div>
          <div className="actions">
            <button className="primary" onClick={() => copyPost(selected)}>{copied ? "✓ Sudah disalin" : "Salin posting"}</button>
            <button className={`secondary ${saved.includes(selected.id) ? "saved" : ""}`} onClick={() => toggleSave(selected)}>
              {saved.includes(selected.id) ? "✓ Disimpan" : "♡ Simpan"}
            </button>
          </div>

          {selected.affiliateOpportunity && (
            <div className="affiliate">
              <strong>🛒 Peluang produk</strong>
              <span>Konten ini dapat dipasangkan dengan produk yang relevan melalui program affiliate yang kamu ikuti.</span>
            </div>
          )}
        </section>
      )}

      <footer className="footer">
        Gunakan pengalaman dan informasi yang benar saat mempublikasikan konten. Tautan affiliate harus diberi keterangan yang sesuai.
        <br /><br />
        <a href="/tentang">Tentang</a> · <a href="/privasi">Privasi</a> · <a href="/ketentuan">Ketentuan</a> · <a href="/affiliate">Disclosure Affiliate</a>
      </footer>

      <nav className="bottom-nav" aria-label="Navigasi utama">
        <button className="nav-item active">🏠 Beranda</button>
        <button className="nav-item" onClick={() => window.scrollTo({ top: 420, behavior: "smooth" })}>💡 Ide</button>
        <button className="nav-item" onClick={() => document.getElementById("saved-help")?.scrollIntoView({ behavior: "smooth" })}>❤️ Saya</button>
      </nav>
      <div id="saved-help" aria-hidden="true" style={{ position: "absolute", bottom: 0 }} />
    </main>
  );
}
