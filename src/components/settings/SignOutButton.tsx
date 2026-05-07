"use client";

import { useTransition } from "react";
import { signOut } from "@/lib/actions/auth";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={isPending}
      className="w-full py-3.5 rounded-xl border border-[#D75A2F30] bg-[#D75A2F08] text-[#D75A2F] text-sm font-semibold disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
