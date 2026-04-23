"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

export async function toggleRecord(goalId: string, alreadyDone: boolean, note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = format(new Date(), "yyyy-MM-dd");

  if (alreadyDone) {
    await supabase
      .from("records")
      .delete()
      .eq("goal_id", goalId)
      .eq("user_id", user.id)
      .eq("date", today);
  } else {
    await supabase
      .from("records")
      .upsert(
        { goal_id: goalId, user_id: user.id, date: today, note: note?.trim() || null },
        { onConflict: "goal_id,date" }
      );
  }

  revalidatePath("/");
  revalidatePath(`/goals/${goalId}`);
}

export async function updateNote(goalId: string, note: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = format(new Date(), "yyyy-MM-dd");

  await supabase
    .from("records")
    .update({ note: note.trim() || null })
    .eq("goal_id", goalId)
    .eq("user_id", user.id)
    .eq("date", today);

  revalidatePath("/");
  revalidatePath(`/goals/${goalId}`);
}

export async function updateRecordNote(recordId: string, goalId: string, note: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("records")
    .update({ note: note.trim() || null })
    .eq("id", recordId)
    .eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath(`/goals/${goalId}`);
}

export async function deleteRecordNote(recordId: string, goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("records")
    .update({ note: null })
    .eq("id", recordId)
    .eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath(`/goals/${goalId}`);
}
