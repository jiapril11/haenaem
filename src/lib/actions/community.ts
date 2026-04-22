"use server";

import { createClient } from "@/lib/supabase/server";
import { containsProfanity } from "@/lib/profanity";

export async function toggleCheer(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("cheers")
    .select("id")
    .eq("goal_id", goalId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase.from("cheers").delete().eq("id", existing.id);
  } else {
    await supabase.from("cheers").insert({ goal_id: goalId, user_id: user.id });
  }
}

export async function addComment(goalId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 200) throw new Error("댓글은 1~200자로 입력해주세요");
  if (containsProfanity(trimmed)) throw new Error("부적절한 표현이 포함되어 있어요");

  const { data, error } = await supabase
    .from("comments")
    .insert({ goal_id: goalId, user_id: user.id, content: trimmed })
    .select("id, goal_id, user_id, content, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("comments").delete()
    .eq("id", commentId)
    .eq("user_id", user.id);
}
