"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteComment } from "@/lib/actions/community";

export default function MyCommentDeleteButton({ commentId }: { commentId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(commentId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-[#C0BFB8] hover:text-[#D75A2F] transition-colors disabled:opacity-40"
    >
      삭제
    </button>
  );
}
