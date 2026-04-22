"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateNickname(nickname: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const trimmed = nickname.trim();
  if (trimmed.length < 2 || trimmed.length > 20) {
    throw new Error("닉네임은 2~20자로 입력해주세요");
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname: trimmed,
  });
  if (error) {
    if (error.code === "23505") throw new Error("이미 사용 중인 닉네임이에요");
    throw error;
  }

  revalidatePath("/settings");
  revalidatePath("/");
}
