"use client";

import { useState, useTransition } from "react";
import { toggleRecord, updateNote } from "@/lib/actions/records";

interface Props {
  goalId: string;
  isDoneToday: boolean;
  color: string;
  todayNote?: string;
}

export default function TodayToggleButton({ goalId, isDoneToday, color, todayNote }: Props) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(todayNote ?? "");

  function handleCheck() {
    startTransition(() => {
      toggleRecord(goalId, isDoneToday, isDoneToday ? undefined : note);
    });
  }

  function handleSaveNote() {
    startTransition(() => {
      updateNote(goalId, editNote).then(() => setIsEditing(false));
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {!isDoneToday ? (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="오늘 무엇을 했나요? (선택)"
          rows={1}
          className="w-full text-sm text-[#2C2C2A] placeholder:text-[#C0BFB8] bg-[#F8F8F9] border border-[#E8E8E6] rounded-xl px-3 py-2.5 resize-none outline-none focus:border-[#6CBFA8] transition-colors"
        />
      ) : isEditing ? (
        <div className="flex flex-col gap-1.5">
          <textarea
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            rows={1}
            autoFocus
            className="w-full text-sm text-[#2C2C2A] bg-[#F8F8F9] border border-[#6CBFA8] rounded-xl px-3 py-2.5 resize-none outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setEditNote(todayNote ?? ""); setIsEditing(false); }}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium text-[#878680] border border-[#E8E8E6]"
            >
              취소
            </button>
            <button
              onClick={handleSaveNote}
              disabled={isPending}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: color }}
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={todayNote ?? ""}
            rows={1}
            disabled
            placeholder="오늘 무엇을 했나요? (선택)"
            className="w-full text-sm text-[#AEADA8] placeholder:text-[#C0BFB8] bg-[#F0F0EE] border border-[#E8E8E6] rounded-xl px-3 py-2.5 resize-none outline-none cursor-not-allowed"
          />
          <button
            onClick={() => setIsEditing(true)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#C0BFB8] hover:text-[#878680] transition-colors"
            aria-label="메모 편집"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      )}

      <button
        onClick={handleCheck}
        disabled={isPending || isEditing}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
          isDoneToday
            ? "bg-[#1D9E7518] text-[#1D9E75] border border-[#1D9E7540]"
            : "text-white"
        }`}
        style={isDoneToday ? {} : { backgroundColor: color }}
      >
        {isPending && !isEditing ? "저장 중..." : isDoneToday ? "✓ 오늘 완료!" : "오늘 체크하기"}
      </button>
    </div>
  );
}
