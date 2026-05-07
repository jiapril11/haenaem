"use client";

import { useTransition, useState } from "react";
import { deleteAccount } from "@/lib/actions/auth";

export default function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleConfirm() {
    startTransition(() => deleteAccount());
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full py-3.5 rounded-xl text-[#878680] text-sm cursor-pointer"
      >
        회원 탈퇴
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-base font-bold text-[#2C2C2A] mb-2">정말 탈퇴할까요?</h2>
            <p className="text-sm text-[#878680] mb-6">
              모든 목표와 기록이 삭제되며 복구할 수 없어요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-[#F0F0EE] text-sm font-medium text-[#2C2C2A] cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-[#D75A2F] text-sm font-medium text-white disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "탈퇴 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
