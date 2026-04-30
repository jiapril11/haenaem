import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sub } = await supabase
    .from("push_subscriptions")
    .select("subscription")
    .eq("user_id", user.id)
    .single();

  if (!sub) return NextResponse.json({ error: "No subscription found" }, { status: 404 });

  try {
    await webpush.sendNotification(
      sub.subscription,
      JSON.stringify({ title: "테스트 알림 🔔", body: "푸시 알림이 정상 작동해요!" })
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; body?: string; message?: string };
    return NextResponse.json({ error: error.body ?? error.message, statusCode: error.statusCode }, { status: 500 });
  }
}
