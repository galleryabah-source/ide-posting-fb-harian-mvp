import { NextResponse } from "next/server";
import { savePostSchema } from "../../../lib/validation";
import { ensureVisitorCookie } from "../../../lib/server/request-context";
import { checkRateLimit } from "../../../lib/server/rate-limit";
import { getSupabaseAdmin } from "../../../lib/server/supabase-admin";

export async function GET() {
  const visitorId = await ensureVisitorCookie();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ saved: [] });

  const { data, error } = await supabase
    .from("saved_posts")
    .select("idea_id,niche,title,post_text,created_at,updated_at")
    .eq("visitor_id", visitorId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("saved GET failed", error.message);
    return NextResponse.json({ error: "Gagal memuat simpanan." }, { status: 500 });
  }
  return NextResponse.json({ saved: data ?? [] });
}

export async function POST(request: Request) {
  const visitorId = await ensureVisitorCookie();
  const limit = await checkRateLimit(`${visitorId}:saved`, visitorId, "saved");
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ saved: true, persisted: false });

  try {
    const body = await request.json();
    const parsed = savePostSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Data simpanan tidak valid." }, { status: 400 });

    const { error } = await supabase.from("saved_posts").upsert(
      {
        visitor_id: visitorId,
        idea_id: parsed.data.ideaId,
        niche: parsed.data.niche,
        title: parsed.data.title,
        post_text: parsed.data.postText,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "visitor_id,idea_id" },
    );

    if (error) {
      console.error("saved POST failed", error.message);
      return NextResponse.json({ error: "Gagal menyimpan posting." }, { status: 500 });
    }
    return NextResponse.json({ saved: true, persisted: true });
  } catch (error) {
    console.error("saved POST route failed", error);
    return NextResponse.json({ error: "Gagal menyimpan posting." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const visitorId = await ensureVisitorCookie();
  const limit = await checkRateLimit(`${visitorId}:saved-delete`, visitorId, "saved-delete");
  if (!limit.allowed) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  const url = new URL(request.url);
  const ideaId = url.searchParams.get("ideaId");
  if (!ideaId || ideaId.length > 160) return NextResponse.json({ error: "ID ide tidak valid." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ deleted: true, persisted: false });

  const { error } = await supabase.from("saved_posts").delete().eq("visitor_id", visitorId).eq("idea_id", ideaId);
  if (error) {
    console.error("saved DELETE failed", error.message);
    return NextResponse.json({ error: "Gagal menghapus simpanan." }, { status: 500 });
  }
  return NextResponse.json({ deleted: true, persisted: true });
}
