export type NicheId =
  | "rumah-tangga"
  | "masakan"
  | "parenting"
  | "lifestyle"
  | "fashion"
  | "affiliate";

export type ContentFormat = "feed" | "reels" | "story";
export type ContentPillar = "tips" | "relatable" | "engagement" | "story" | "recommendation";
export type ContentAngle = "problem-solution" | "listicle" | "question" | "storytelling" | "recommendation";

export interface ContentIdea {
  id: string;
  title: string;
  niche: NicheId;
  pillar: ContentPillar;
  angle: ContentAngle;
  format: ContentFormat;
  hook: string;
  bodyDirection: string;
  cta: string;
  affiliateOpportunity?: boolean;
}

interface NicheProfile {
  label: string;
  topics: string[];
  pillars: ContentPillar[];
}

const PROFILES: Record<NicheId, NicheProfile> = {
  "rumah-tangga": {
    label: "Rumah Tangga",
    topics: ["dapur", "rumah", "kebersihan", "organizer", "hemat waktu"],
    pillars: ["tips", "relatable", "recommendation", "engagement", "story"],
  },
  masakan: {
    label: "Masakan",
    topics: ["menu harian", "bekal", "bumbu", "peralatan dapur", "tips memasak"],
    pillars: ["tips", "relatable", "recommendation", "engagement", "story"],
  },
  parenting: {
    label: "Parenting",
    topics: ["rutinitas anak", "aktivitas di rumah", "bekal", "belajar", "kebiasaan baik"],
    pillars: ["tips", "relatable", "engagement", "story", "recommendation"],
  },
  lifestyle: {
    label: "Lifestyle",
    topics: ["rutinitas", "hemat waktu", "self care", "rumah", "keseharian"],
    pillars: ["relatable", "tips", "story", "engagement", "recommendation"],
  },
  fashion: {
    label: "Fashion",
    topics: ["outfit harian", "mix and match", "warna", "aksesoris", "lemari"],
    pillars: ["tips", "recommendation", "relatable", "engagement", "story"],
  },
  affiliate: {
    label: "Affiliate",
    topics: ["barang berguna", "produk murah", "review", "rekomendasi", "problem solver"],
    pillars: ["recommendation", "tips", "relatable", "engagement", "story"],
  },
};

const angleBlueprints: Record<ContentAngle, { title: string; hook: string; cta: string }> = {
  "problem-solution": {
    title: "Hal kecil yang bikin {topic} lebih praktis",
    hook: "Kalau urusan {topic} sering terasa ribet, coba mulai dari hal kecil ini.",
    cta: "Kalau pernah mengalami hal yang sama, boleh ceritakan di komentar.",
  },
  listicle: {
    title: "5 ide sederhana untuk {topic}",
    hook: "Kadang yang dibutuhkan bukan cara yang rumit, tetapi beberapa kebiasaan sederhana.",
    cta: "Dari lima ini, mana yang paling ingin dicoba?",
  },
  question: {
    title: "Menurut kamu, cara paling praktis untuk {topic} apa?",
    hook: "Setiap orang punya cara sendiri. Saya penasaran dengan cara kamu.",
    cta: "Tulis jawabannya di komentar supaya bisa saling berbagi tips.",
  },
  storytelling: {
    title: "Dulu saya sering bingung soal {topic}",
    hook: "Saya dulu juga sering merasa {topic} itu merepotkan.",
    cta: "Kalau kamu punya pengalaman serupa, boleh ikut cerita.",
  },
  recommendation: {
    title: "Rekomendasi yang membantu untuk {topic}",
    hook: "Saya suka hal-hal sederhana yang benar-benar terasa manfaatnya dalam keseharian.",
    cta: "Kalau sedang mencari solusi untuk hal yang sama, semoga ini membantu.",
  },
};

const pillarAngles: Record<ContentPillar, ContentAngle[]> = {
  tips: ["problem-solution", "listicle"],
  relatable: ["storytelling", "question"],
  engagement: ["question", "listicle"],
  story: ["storytelling", "problem-solution"],
  recommendation: ["recommendation", "problem-solution"],
};

function stableIndex(seed: number, length: number): number {
  return Math.abs(seed) % length;
}

function textSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function topicFor(profile: NicheProfile, daySeed: number, offset: number): string {
  return profile.topics[stableIndex(daySeed + offset * 17, profile.topics.length)];
}

export function generateDailyIdeas(niche: NicheId, date = new Date()): ContentIdea[] {
  const profile = PROFILES[niche];
  if (!profile) throw new Error("Niche tidak valid");

  const seed = textSeed(`${niche}:${date.toISOString().slice(0, 10)}`);
  const used = new Set<string>();
  const ideas: ContentIdea[] = [];

  for (let i = 0; i < 8 && ideas.length < 5; i += 1) {
    const pillar = profile.pillars[stableIndex(seed + i * 11, profile.pillars.length)];
    const angles = pillarAngles[pillar];
    const angle = angles[stableIndex(seed + i * 7, angles.length)];
    const topic = topicFor(profile, seed, i);
    const blueprint = angleBlueprints[angle];
    const title = blueprint.title.replaceAll("{topic}", topic);
    const key = `${pillar}:${angle}:${topic}`;
    if (used.has(key)) continue;
    used.add(key);

    ideas.push({
      id: `${niche}-${i + 1}-${Math.abs(seed)}`,
      title,
      niche,
      pillar,
      angle,
      format: i % 3 === 0 ? "reels" : "feed",
      hook: blueprint.hook.replaceAll("{topic}", topic),
      bodyDirection: `Bagikan 3–5 poin praktis tentang ${topic}, gunakan contoh sehari-hari, dan hindari klaim yang tidak dapat dibuktikan.`,
      cta: blueprint.cta,
      affiliateOpportunity: pillar === "recommendation" || niche === "affiliate",
    });
  }

  return ideas;
}

export function generatePost(idea: ContentIdea): string {
  const pillarLabel = idea.pillar === "recommendation" ? "Rekomendasi" : "Tips";
  return [
    idea.hook,
    "",
    `Saya sedang membahas ${idea.title.toLowerCase()}.`,
    "",
    idea.bodyDirection,
    "",
    `Catatan ${pillarLabel.toLowerCase()}: sesuaikan dengan pengalaman pribadi agar tulisan terasa alami dan jujur.`,
    "",
    idea.cta,
  ].join("\n");
}

export function getNiches(): Array<{ id: NicheId; label: string }> {
  return Object.entries(PROFILES).map(([id, profile]) => ({ id: id as NicheId, label: profile.label }));
}
