import { createClient } from "npm:@supabase/supabase-js";

const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // KST 기준 오늘 날짜
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = kst.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("goals")
    .update({ is_archived: true, archive_reason: "expired" })
    .lt("end_date", today)
    .eq("is_archived", false)
    .select("id, title");

  if (error) {
    console.log("❌ Error:", error.message);
    return new Response("Error", { status: 500 });
  }

  console.log(`✅ Archived ${data?.length ?? 0} expired goals`);
  return new Response(`Archived ${data?.length ?? 0} goals`, { status: 200 });
});
