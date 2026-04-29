"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGoal } from "@/lib/actions/goals";
import type { Goal } from "@/types";
import { subscribeToPush, isPushSupported } from "@/lib/push";

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
  const [notificationEnabled, setNotificationEnabled] = useState(!!goal.notification_time);
  const [notificationTime, setNotificationTime] = useState(goal.notification_time ?? "09:00");

  async function handleNotificationToggle() {
    if (notificationEnabled) {
      setNotificationEnabled(false);
      return;
    }
    if (!isPushSupported()) {
      alert("이 브라우저는 푸시 알림을 지원하지 않아요.");
      return;
    }
    const success = await subscribeToPush();
    if (success) {
      setNotificationEnabled(true);
    } else {
      alert("알림 권한이 필요해요. 브라우저 설정에서 알림을 허용해주세요.");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !endDate) return;
    startTransition(() => {
      updateGoal(goal.id, {
        title, color, start_date: startDate, end_date: endDate,
        notification_time: notificationEnabled ? notificationTime : null,
      });
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
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#878680] mb-1">시작일</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-[#E8E8E6] rounded-xl px-3 py-2.5 text-sm text-[#2C2C2A] outline-none focus:border-[#6CBFA8]"
              />
            </div>
            <div className="flex-1 min-w-0">
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

        {/* 알림 설정 */}
        <button
          type="button"
          onClick={handleNotificationToggle}
          className="w-full flex items-center justify-between bg-white border border-[#E8E8E6] rounded-xl px-4 py-3.5"
        >
          <div>
            <p className="text-sm font-medium text-[#2C2C2A] text-left">매일 알림 받기</p>
            <p className="text-xs text-[#878680] text-left mt-0.5">설정한 시간에 목표 달성을 독려해드려요</p>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${notificationEnabled ? "bg-[#6CBFA8]" : "bg-[#E8E8E6]"}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notificationEnabled ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </button>
        {notificationEnabled && (
          <div className="flex items-center gap-3 bg-white border border-[#E8E8E6] rounded-xl px-4 py-3">
            <p className="text-sm text-[#878680] flex-shrink-0">알림 시간</p>
            <input
              type="time"
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              className="flex-1 text-sm text-[#2C2C2A] outline-none bg-transparent"
            />
          </div>
        )}

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
