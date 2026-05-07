"use client";

import { useState, useTransition } from "react";
import { updateNickname } from "@/lib/actions/profile";

export default function NicknameForm({ initialNickname }: { initialNickname: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialNickname);
  const [saved, setSaved] = useState(initialNickname);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setError("2자 이상 입력해주세요");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await updateNickname(trimmed);
        setSaved(trimmed);
        setIsEditing(false);
      } catch {
        setError("저장에 실패했어요");
      }
    });
  }

  function handleCancel() {
    setValue(saved);
    setError("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          maxLength={20}
          autoFocus
          className="w-full border border-[#6CBFA8] rounded-xl px-3 py-2 text-sm text-[#2C2C2A] outline-none bg-[#F8F8F9]"
        />
        {error && <p className="text-xs text-[#D75A2F] mt-1">{error}</p>}
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleCancel}
            className="text-xs text-[#878680] cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || value.trim().length < 2}
            className="text-xs text-[#6CBFA8] font-semibold disabled:opacity-40 cursor-pointer"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between flex-1 min-w-0">
      <p className="font-semibold text-[#2C2C2A] truncate">{saved}</p>
      <button
        onClick={() => setIsEditing(true)}
        className="text-xs text-[#6CBFA8] font-semibold flex-shrink-0 ml-3 cursor-pointer"
      >
        수정
      </button>
    </div>
  );
}
