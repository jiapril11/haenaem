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
