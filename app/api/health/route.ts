import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/server/supabase-admin";

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ status: "ok", database: "not_configured" }, { status: 200 });
  }

  const { error } = await supabase.from("usage_events").select("id", { count: "exact", head: true });
  if (error) {
    return NextResponse.json({ status: "degraded", database: "error" }, { status: 503 });
  }

  return NextResponse.json({ status: "ok", database: "ok" });
}
