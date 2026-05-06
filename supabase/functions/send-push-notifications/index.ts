import webpush from "npm:web-push";
import { createClient } from "npm:@supabase/supabase-js";

const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!
);

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    console.log("❌ Invalid cron secret");
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hh = String(kst.getUTCHours()).padStart(2, "0");
  const mm = String(kst.getUTCMinutes()).padStart(2, "0");
  const currentTime = `${hh}:${mm}`;
  const today = kst.toISOString().slice(0, 10);
  console.log("⏰ Current KST time:", currentTime, "today:", today);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: goals, error: goalsError } = await supabase
    .from("goals")
    .select("id, user_id, title")
    .eq("notification_time", currentTime)
    .eq("is_archived", false)
    .gte("end_date", today);

  console.log("🎯 Matched goals:", goals?.length ?? 0, goalsError?.message ?? "");

  if (!goals || goals.length === 0) {
    return new Response("No goals to notify", { status: 200 });
  }

  for (const goal of goals) {
    const { data: sub } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", goal.user_id)
      .single();

    if (!sub) {
      console.log("⚠️ No subscription for user:", goal.user_id);
      continue;
    }

    try {
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify({
          title: "[해냄!] 목표 달성 시간이에요 💪",
          body: goal.title,
        })
      );
      console.log("✅ Sent notification for goal:", goal.title);
    } catch (err) {
      console.log("❌ Failed to send:", err);
    }
  }

  return new Response("Done", { status: 200 });
});
