import { AffiliateDisclosure } from "../../components/affiliate-disclosure";

export default function AffiliatePage() {
  return <main className="shell"><header className="header"><div className="brand">Ide Posting FB Harian</div><h1>Disclosure Affiliate</h1></header><section className="card"><p className="subtitle">Sebagian rekomendasi produk pada versi produksi dapat menggunakan tautan affiliate. Kami dapat menerima komisi apabila pembelian memenuhi ketentuan program affiliate yang berlaku.</p><p className="subtitle">Harga, ketersediaan, promosi, dan kelayakan komisi dapat berubah di platform merchant. Selalu periksa informasi terbaru pada halaman merchant sebelum membeli.</p><AffiliateDisclosure /></section><footer className="footer"><a href="/">Beranda</a> · <a href="/privasi">Privasi</a> · <a href="/ketentuan">Ketentuan</a></footer></main>;
}
