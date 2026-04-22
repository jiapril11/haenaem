"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isBefore,
  parseISO,
} from "date-fns";
import { ko } from "date-fns/locale";

interface MonthlyCalendarProps {
  completedDates: string[];
  startDate: string;
  endDate: string;
  color?: string;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthlyCalendar({
  completedDates,
  startDate,
  endDate,
  color = "#6CBFA8",
}: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const completedSet = new Set(completedDates);
  const today = format(new Date(), "yyyy-MM-dd");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function prevMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function getDayState(day: Date): "done" | "missed" | "today" | "future" | "inactive" | "out-of-range" {
    const dayStr = format(day, "yyyy-MM-dd");

    if (!isSameMonth(day, currentMonth)) return "inactive";
    if (dayStr < startDate || dayStr > endDate) return "out-of-range";

    if (completedSet.has(dayStr)) return "done";
    if (dayStr === today) return "today";
    if (dayStr > today) return "future";
    return "missed";
  }

  const monthCompletedCount = days.filter((d) => {
    const dayStr = format(d, "yyyy-MM-dd");
    return isSameMonth(d, currentMonth) && completedSet.has(dayStr);
  }).length;

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#878680] active:bg-[#F8F8F9]"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-semibold text-[#2C2C2A] text-base">
            {format(currentMonth, "yyyy년 M월", { locale: ko })}
          </p>
          <p className="text-xs text-[#878680] mt-0.5">
            이번 달 {monthCompletedCount}일 완료
          </p>
        </div>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#878680] active:bg-[#F8F8F9]"
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? "text-[#D75A2F]" : i === 6 ? "text-[#4A9EE8]" : "text-[#878680]"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const state = getDayState(day);
          const dayNum = format(day, "d");
          const isInactive = state === "inactive";
          const isOutOfRange = state === "out-of-range";

          let bgColor = "transparent";
          let textColor = "#2C2C2A";
          let ring = "";

          if (isInactive) {
            textColor = "#C0BFB8";
          } else if (isOutOfRange) {
            textColor = "#C0BFB8";
          } else if (state === "done") {
            bgColor = color;
            textColor = "#FFFFFF";
          } else if (state === "today") {
            ring = `2px solid ${color}`;
            textColor = color;
          } else if (state === "missed") {
            bgColor = "#D75A2F20";
            textColor = "#D75A2F";
          } else if (state === "future") {
            textColor = "#878680";
          }

          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className="flex items-center justify-center"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  outline: ring ? ring : undefined,
                  outlineOffset: ring ? "-2px" : undefined,
                }}
              >
                {dayNum}
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#E8E8E6] flex-wrap">
        {[
          { color, label: "완료" },
          { color: "#D75A2F20", textColor: "#D75A2F", label: "공백" },
          { color: "transparent", outline: color, label: "오늘" },
          { color: "transparent", textColor: "#878680", label: "예정" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full border"
              style={{
                backgroundColor: item.color,
                borderColor: item.outline ?? "transparent",
              }}
            />
            <span className="text-xs" style={{ color: item.textColor ?? "#2C2C2A" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
