import { NextResponse } from "next/server";
import { affiliateClickSchema } from "../../../../lib/validation";
import { checkRateLimit } from "../../../../lib/server/rate-limit";
import { ensureVisitorCookie } from "../../../../lib/server/request-context";
import { getSupabaseAdmin } from "../../../../lib/server/supabase-admin";

const ALLOWED_HOSTS = new Set(["shopee.co.id", "www.shopee.co.id", "s.shopee.co.id"]);

export async function POST(request: Request) {
  const visitorId = await ensureVisitorCookie();
  const limit = await checkRateLimit(`${visitorId}:affiliate-click`, visitorId, "affiliate-click");
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const body = await request.json();
    const parsed = affiliateClickSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Data affiliate tidak valid." }, { status: 400 });

    const destination = new URL(parsed.data.destinationUrl);
    if (destination.protocol !== "https:" || !ALLOWED_HOSTS.has(destination.hostname.toLowerCase())) {
      return NextResponse.json({ error: "Tujuan affiliate tidak diizinkan." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from("affiliate_clicks").insert({
        visitor_id: visitorId,
        provider: parsed.data.provider,
        destination_url: destination.toString(),
        source: parsed.data.source,
      });
      if (error) console.error("affiliate click insert failed", error.message);
    }

    return NextResponse.json({ tracked: Boolean(supabase) });
  } catch (error) {
    console.error("affiliate click route failed", error);
    return NextResponse.json({ error: "Gagal mencatat klik affiliate." }, { status: 500 });
  }
}
