import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditGoalForm from "@/components/goal/EditGoalForm";

export default async function EditGoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!goal) notFound();

  return <EditGoalForm goal={goal} />;
}
