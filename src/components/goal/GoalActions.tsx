"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGoal, archiveGoal, togglePublic } from "@/lib/actions/goals";

interface Props {
  goalId: string;
  isArchived: boolean;
  archiveReason: "expired" | "manual" | null;
  isPublic: boolean;
}

export default function GoalActions({ goalId, isArchived, archiveReason, isPublic }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [publicState, setPublicState] = useState(isPublic);
  const router = useRouter();

  function handleTogglePublic() {
    const next = !publicState;
    setPublicState(next);
    startTransition(() => { togglePublic(goalId, next); });
  }

  function handleArchive() {
    startTransition(async () => {
      await archiveGoal(goalId, !isArchived);
      router.push("/");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteGoal(goalId);
      router.push("/");
    });
  }

  return (
    <>
      {/* 커뮤니티 공개 토글 */}
      <button
        type="button"
        onClick={handleTogglePublic}
        disabled={isPending}
        className="w-full flex items-center justify-between bg-white border border-[#E8E8E6] rounded-xl px-4 py-3.5 disabled:opacity-60 cursor-pointer"
      >
        <div>
          <p className="text-sm font-medium text-[#2C2C2A] text-left">커뮤니티에 공개</p>
          <p className="text-xs text-[#878680] text-left mt-0.5">다른 사람들과 목표를 함께 공유해요</p>
        </div>
        <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${publicState ? "bg-[#6CBFA8]" : "bg-[#E8E8E6]"}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${publicState ? "translate-x-5" : "translate-x-0"}`} />
        </div>
      </button>

      <div className="flex gap-2">
        {/* 아카이브 버튼 - 자동 완료된 목표는 보관/복원 불가 */}
        {archiveReason !== "expired" && (
          <button
            onClick={handleArchive}
            disabled={isPending}
            className="flex-1 py-3 rounded-xl border border-[#E8E8E6] bg-white text-sm font-medium text-[#878680] disabled:opacity-50 cursor-pointer"
          >
            {isArchived ? "복원하기" : "보관하기"}
          </button>
        )}

        {/* 삭제 버튼 */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isPending}
          className="flex-1 py-3 rounded-xl border border-[#D75A2F30] bg-[#D75A2F08] text-sm font-medium text-[#D75A2F] disabled:opacity-50 cursor-pointer"
        >
          삭제하기
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 pb-safe">
          <div className="bg-white rounded-t-3xl w-full max-w-[390px] p-6">
            <h3 className="text-base font-bold text-[#2C2C2A] mb-2">목표를 삭제할까요?</h3>
            <p className="text-sm text-[#878680] mb-6">
              기록이 모두 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-[#E8E8E6] text-sm font-semibold text-[#878680] cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-[#D75A2F] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
