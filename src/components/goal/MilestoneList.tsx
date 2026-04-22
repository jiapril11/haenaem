"use client";

import { useTransition } from "react";
import { toggleMilestone } from "@/lib/actions/milestones";
import type { Milestone } from "@/types";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  milestones: Milestone[];
  goalId: string;
  color: string;
}

export default function MilestoneList({ milestones, goalId, color }: Props) {
  const [isPending, startTransition] = useTransition();

  if (milestones.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E6] overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-[#2C2C2A]">마일스톤</h3>
      </div>
      <ul>
        {milestones.map((m, i) => (
          <li
            key={m.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              i < milestones.length - 1 ? "border-b border-[#F0F0EE]" : ""
            }`}
          >
            {/* 체크박스 */}
            <button
              onClick={() =>
                startTransition(() => toggleMilestone(m.id, goalId, m.is_done))
              }
              disabled={isPending}
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                borderColor: m.is_done ? color : "#C0BFB8",
                backgroundColor: m.is_done ? color : "transparent",
              }}
            >
              {m.is_done && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${
                  m.is_done ? "line-through text-[#878680]" : "text-[#2C2C2A]"
                }`}
              >
                {m.title}
              </p>
              {m.target_date && (
                <p className="text-xs text-[#878680] mt-0.5">
                  {format(parseISO(m.target_date), "M월 d일", { locale: ko })}
                </p>
              )}
            </div>

            {/* 완료 뱃지 */}
            {m.is_done && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                style={{ backgroundColor: `${color}18`, color }}
              >
                완료
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
