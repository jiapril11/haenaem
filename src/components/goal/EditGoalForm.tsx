"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGoal } from "@/lib/actions/goals";
import type { Goal } from "@/types";

const COLORS = [
  "#7E77B7",
  "#6CBFA8",
  "#D75A2F",
  "#F9C675",
  "#4A9EE8",
  "#E87CA0",
  "#1D9E75",
  "#2C2C2A",
];

export default function EditGoalForm({ goal }: { goal: Goal }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(goal.title);
  const [color, setColor] = useState(goal.color);
  const [startDate, setStartDate] = useState(goal.start_date);
  const [endDate, setEndDate] = useState(goal.end_date);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !endDate) return;
    startTransition(() => {
      updateGoal(goal.id, { title, color, start_date: startDate, end_date: endDate });
    });
  }

  const isValid = title.trim() && endDate;

  return (
    <div className="min-h-screen bg-[#F8F8F9]">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#E8E8E6]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 5l-5 5 5 5" stroke="#2C2C2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[#2C2C2A]">목표 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pb-32 space-y-6">
        {/* 제목 */}
        <div>
          <label className="text-sm font-semibold text-[#2C2C2A] block mb-2">
            목표 이름
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={40}
            className="w-full bg-white border border-[#E8E8E6] rounded-xl px-4 py-3 text-sm text-[#2C2C2A] outline-none focus:border-[#6CBFA8]"
          />
          <p className="text-right text-xs text-[#878680] mt-1">{title.length}/40</p>
        </div>

        {/* 색상 */}
        <div>
          <label className="text-sm font-semibold text-[#2C2C2A] block mb-2">
            색상
          </label>
          <div className="grid grid-cols-8 gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? c : "transparent",
                  boxShadow: color === c ? `0 0 0 3px ${c}40` : "none",
                }}
              >
                {color === c && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 기간 */}
        <div>
          <label className="text-sm font-semibold text-[#2C2C2A] block mb-2">
            기간
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs text-[#878680] mb-1">시작일</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-[#E8E8E6] rounded-xl px-3 py-2.5 text-sm text-[#2C2C2A] outline-none focus:border-[#6CBFA8]"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#878680] mb-1">종료일</p>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-[#E8E8E6] rounded-xl px-3 py-2.5 text-sm text-[#2C2C2A] outline-none focus:border-[#6CBFA8]"
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4">
          <button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all disabled:opacity-40"
            style={{ backgroundColor: color }}
          >
            {isPending ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
