"use client";

import { useEffect, useMemo, useState } from "react";
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
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]");
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
  const [postText, setPostText] = useState("");
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void fetch("/api/saved")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((data: { saved?: Array<{ idea_id?: string }> } | null) => {
        const ids = data?.saved?.flatMap((item) => (typeof item.idea_id === "string" ? [item.idea_id] : [])) ?? [];
        if (ids.length) setSaved(ids);
      })
      .catch(() => undefined);
  }, []);

  function refreshIdeas(nextNiche: NicheId) {
    setNiche(nextNiche);
    setSelected(null);
    setPostText("");
    setCopied(false);
    setNotice("");
    setIdeas(generateDailyIdeas(nextNiche));
  }

  async function toggleSave(idea: ContentIdea) {
    const alreadySaved = saved.includes(idea.id);
    const next = alreadySaved ? saved.filter((id) => id !== idea.id) : [...saved, idea.id];
    setSaved(next);
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      // local persistence is best effort
    }

    try {
      const response = await fetch(`/api/saved${alreadySaved ? `?ideaId=${encodeURIComponent(idea.id)}` : ""}`, {
        method: alreadySaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: alreadySaved ? undefined : JSON.stringify({ ideaId: idea.id, niche: idea.niche, title: idea.title, postText: generatePost(idea) }),
      });
      if (!response.ok) throw new Error("save failed");
    } catch {
      setNotice("Simpanan lokal tetap tersedia. Sinkronisasi server belum aktif.");
    }
  }

  async function openGenerator(idea: ContentIdea) {
    setSelected(idea);
    setPostText("");
    setCopied(false);
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: idea.niche, ideaId: idea.id }),
      });
      if (!response.ok) throw new Error("generation failed");
      const data = (await response.json()) as { postText?: string };
      setPostText(typeof data.postText === "string" ? data.postText : generatePost(idea));
    } catch {
      setPostText(generatePost(idea));
      setNotice("Mode offline aktif: posting tetap dibuat dari mesin lokal.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPost() {
    if (!postText) return;
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice("Tidak bisa menyalin otomatis. Silakan blok teks posting lalu salin.");
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
            {niches.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
      </section>

      <div className="ad-slot" aria-label="Tempat iklan">Advertisement</div>

      {notice && <div className="notice" role="status">{notice}</div>}

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
                <button className="primary" onClick={() => openGenerator(idea)}>Buat posting</button>
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
          <div className="post">{loading ? "Sedang menyiapkan posting..." : postText}</div>
          <div className="actions">
            <button className="primary" disabled={loading || !postText} onClick={copyPost}>{copied ? "✓ Sudah disalin" : "Salin posting"}</button>
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
        <button className="nav-item" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>❤️ Saya</button>
      </nav>
    </main>
  );
}
