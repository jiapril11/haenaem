"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { createGoal } from "@/lib/actions/goals";
import type { Category } from "@/types";
import CategoryIcon from "@/components/goal/CategoryIcon";

const CATEGORIES: Category[] = ["운동", "학습", "커리어", "예술", "금융", "마음", "습관", "기타"];

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

interface MilestoneInput {
  title: string;
  target_date: string;
}

export default function NewGoalPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const today = format(new Date(), "yyyy-MM-dd");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  function addMilestone() {
    setMilestones((prev) => [...prev, { title: "", target_date: "" }]);
  }

  function updateMilestone(i: number, field: keyof MilestoneInput, value: string) {
    setMilestones((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m))
    );
  }

  function removeMilestone(i: number) {
    setMilestones((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !category || !endDate) return;
    startTransition(() => {
      createGoal({ title, category, color, start_date: startDate, end_date: endDate, milestones, is_public: isPublic });
    });
  }

  const isValid = title.trim() && category && endDate;

  return (
    <div className="min-h-screen bg-[#F8F8F9] overflow-x-hidden">
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
        <h1 className="text-lg font-bold text-[#2C2C2A]">새 목표 만들기</h1>
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
            placeholder="예: 매일 영어 단어 30개"
            maxLength={40}
            className="w-full bg-white border border-[#E8E8E6] rounded-xl px-4 py-3 text-sm text-[#2C2C2A] placeholder:text-[#C0BFB8] outline-none focus:border-[#6CBFA8]"
          />
          <p className="text-right text-xs text-[#878680] mt-1">{title.length}/40</p>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="text-sm font-semibold text-[#2C2C2A] block mb-2">
            카테고리
          </label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const selected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border text-sm font-medium transition-all ${
                    selected
                      ? "border-[#6CBFA8] bg-[#6CBFA810] text-[#6CBFA8]"
                      : "border-[#E8E8E6] bg-white text-[#878680]"
                  }`}
                >
                  <CategoryIcon category={cat} size={20} color={selected ? "#6CBFA8" : "#878680"} className="mb-1" />
                  {cat}
                </button>
              );
            })}
          </div>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-[#878680] mb-1">시작일</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-[#E8E8E6] rounded-xl px-3 py-2.5 text-sm text-[#2C2C2A] outline-none focus:border-[#6CBFA8]"
              />
            </div>
            <div>
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

        {/* 마일스톤 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[#2C2C2A]">
              마일스톤 <span className="text-[#878680] font-normal">(선택)</span>
            </label>
            <button
              type="button"
              onClick={addMilestone}
              className="text-xs text-[#6CBFA8] font-semibold"
            >
              + 추가
            </button>
          </div>
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => updateMilestone(i, "title", e.target.value)}
                  placeholder={`마일스톤 ${i + 1}`}
                  className="flex-1 bg-white border border-[#E8E8E6] rounded-xl px-3 py-2 text-sm text-[#2C2C2A] placeholder:text-[#C0BFB8] outline-none focus:border-[#6CBFA8]"
                />
                <input
                  type="date"
                  value={m.target_date}
                  onChange={(e) => updateMilestone(i, "target_date", e.target.value)}
                  className="w-32 bg-white border border-[#E8E8E6] rounded-xl px-2 py-2 text-xs text-[#2C2C2A] outline-none focus:border-[#6CBFA8]"
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(i)}
                  className="w-7 h-7 flex items-center justify-center text-[#878680]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 커뮤니티 공개 */}
        <button
          type="button"
          onClick={() => setIsPublic((v) => !v)}
          className="w-full flex items-center justify-between bg-white border border-[#E8E8E6] rounded-xl px-4 py-3.5"
        >
          <div>
            <p className="text-sm font-medium text-[#2C2C2A] text-left">커뮤니티에 공개</p>
            <p className="text-xs text-[#878680] text-left mt-0.5">다른 사람들과 목표를 함께 공유해요</p>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${isPublic ? "bg-[#6CBFA8]" : "bg-[#E8E8E6]"}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isPublic ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </button>

        {/* 제출 버튼 */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4">
          <button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all disabled:opacity-40"
            style={{ backgroundColor: color }}
          >
            {isPending ? "저장 중..." : "목표 만들기"}
          </button>
        </div>
      </form>
    </div>
  );
}
