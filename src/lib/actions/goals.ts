"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export async function createGoal(formData: {
  title: string;
  category: Category;
  color: string;
  start_date: string;
  end_date: string;
  milestones: { title: string; target_date: string }[];
  is_public?: boolean;
  notification_time?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: goal, error } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      title: formData.title,
      category: formData.category,
      color: formData.color,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_public: formData.is_public ?? false,
      notification_time: formData.notification_time ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 마일스톤 저장
  if (formData.milestones.length > 0) {
    const validMilestones = formData.milestones
      .filter((m) => m.title.trim())
      .map((m) => ({
        goal_id: goal.id,
        title: m.title,
        target_date: m.target_date || null,
      }));

    if (validMilestones.length > 0) {
      await supabase.from("milestones").insert(validMilestones);
    }
  }

  revalidatePath("/");
  redirect("/");
}

export async function updateGoal(
  goalId: string,
  formData: {
    title: string;
    color: string;
    start_date: string;
    end_date: string;
    notification_time?: string | null;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("goals")
    .update({
      title: formData.title,
      color: formData.color,
      start_date: formData.start_date,
      end_date: formData.end_date,
      notification_time: formData.notification_time ?? null,
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/goals/${goalId}`);
  redirect(`/goals/${goalId}`);
}

export async function deleteGoal(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", user.id);

  revalidatePath("/");
}

export async function togglePublic(goalId: string, isPublic: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("goals")
    .update({ is_public: isPublic })
    .eq("id", goalId)
    .eq("user_id", user.id);

  revalidatePath(`/goals/${goalId}`);
  revalidatePath("/community");
}

export async function archiveGoal(goalId: string, isArchived: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("goals")
    .update({
      is_archived: isArchived,
      archive_reason: isArchived ? "manual" : null,
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  revalidatePath("/");
}
