"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleMilestone(milestoneId: string, goalId: string, isDone: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("milestones")
    .update({ is_done: !isDone })
    .eq("id", milestoneId);

  revalidatePath(`/goals/${goalId}`);
}

export async function createMilestone(goalId: string, title: string, targetDate: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("milestones")
    .insert({ goal_id: goalId, title: title.trim(), target_date: targetDate || null });

  revalidatePath(`/goals/${goalId}`);
}

export async function updateMilestone(milestoneId: string, goalId: string, title: string, targetDate: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("milestones")
    .update({ title: title.trim(), target_date: targetDate || null })
    .eq("id", milestoneId);

  revalidatePath(`/goals/${goalId}`);
}

export async function deleteMilestone(milestoneId: string, goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("milestones")
    .delete()
    .eq("id", milestoneId);

  revalidatePath(`/goals/${goalId}`);
}
