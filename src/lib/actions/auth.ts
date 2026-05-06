"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 사용자 데이터 삭제
  await supabase.from("push_subscriptions").delete().eq("user_id", user.id);
  const { data: goals } = await supabase.from("goals").select("id").eq("user_id", user.id);
  if (goals && goals.length > 0) {
    const goalIds = goals.map((g) => g.id);
    await supabase.from("milestones").delete().in("goal_id", goalIds);
    await supabase.from("records").delete().eq("user_id", user.id);
    await supabase.from("goals").delete().eq("user_id", user.id);
  }
  await supabase.from("profiles").delete().eq("id", user.id);

  // Auth 유저 삭제
  await admin.auth.admin.deleteUser(user.id);

  redirect("/login");
}
