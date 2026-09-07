import { NextResponse } from "next/server";
import { generateDailyIdeas } from "../../../lib/content-engine";
import { generateRequestSchema } from "../../../lib/validation";
import { checkRateLimit } from "../../../lib/server/rate-limit";
import { ensureVisitorCookie } from "../../../lib/server/request-context";
import { getSupabaseAdmin } from "../../../lib/server/supabase-admin";
import { getAiContentProvider } from "../../../lib/server/ai-provider";

export async function POST(request: Request) {
  const visitorId = await ensureVisitorCookie();
  const limit = await checkRateLimit(`${visitorId}:generate`, visitorId, "generate");
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const body = await request.json();
    const parsed = generateRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Data permintaan tidak valid." }, { status: 400 });

    const ideas = generateDailyIdeas(parsed.data.niche, new Date());
    const idea = ideas.find((item) => item.id === parsed.data.ideaId);
    if (!idea) return NextResponse.json({ error: "Ide tidak ditemukan." }, { status: 404 });

    const provider = getAiContentProvider();
    const postText = await provider.generatePost(idea);
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from("usage_events").insert({
        visitor_id: visitorId,
        event_name: "generate_post",
        metadata: { niche: parsed.data.niche, idea_id: idea.id },
      });
      if (error) console.error("usage_events insert failed", error.message);
    }

    return NextResponse.json({ idea, postText });
  } catch (error) {
    console.error("generate route failed", error);
    return NextResponse.json({ error: "Gagal membuat posting." }, { status: 500 });
  }
}
