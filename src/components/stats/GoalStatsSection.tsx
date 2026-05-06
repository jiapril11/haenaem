"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import ProgressBar from "@/components/goal/ProgressBar";
import CategoryIcon from "@/components/goal/CategoryIcon";
import type { Goal } from "@/types";

type ActiveStat = { goal: Goal; doneDays: number; totalDays: number; percent: number; streak: number };
type ArchivedStat = { goal: Goal; doneDays: number; totalDays: number; percent: number };

const TABS = [
  { key: "active", label: "진행 중" },
  { key: "completed", label: "완료" },
  { key: "archived", label: "보관" },
] as const;

type Tab = (typeof TABS)[number]["key"];

interface Props {
  activeGoalStats: ActiveStat[];
  completedGoalStats: ArchivedStat[];
  archivedGoalStats: ArchivedStat[];
}

export default function GoalStatsSection({ activeGoalStats, completedGoalStats, archivedGoalStats }: Props) {
  const [tab, setTab] = useState<Tab>("active");

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
      <h2 className="text-sm font-semibold text-[#2C2C2A] mb-3">목표별 현황</h2>

      {/* 탭 */}
      <div className="flex gap-1 bg-[#F0F0EE] rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors ${
              tab === t.key ? "bg-white text-[#2C2C2A] shadow-sm" : "text-[#878680]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "active" && (
          activeGoalStats.length === 0 ? (
            <p className="text-sm text-[#878680] text-center py-4">진행 중인 목표가 없어요</p>
          ) : (
            <div className="space-y-4">
              {activeGoalStats.map(({ goal, doneDays, totalDays, percent, streak }) => (
                <Link key={goal.id} href={`/goals/${goal.id}`} className="block">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${goal.color}20` }}>
                        <CategoryIcon category={goal.category} size={14} color={goal.color} />
                      </div>
                      <span className="text-sm text-[#2C2C2A] truncate">{goal.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {streak > 0 && <span className="text-xs text-[#878680]">🔥 {streak}일</span>}
                      <span className="text-xs font-semibold" style={{ color: goal.color }}>{percent}%</span>
                    </div>
                  </div>
                  <ProgressBar percent={percent} color={goal.color} />
                  <p className="text-[10px] text-[#C0BFB8] mt-1">{doneDays}일 / {totalDays}일</p>
                </Link>
              ))}
            </div>
          )
        )}

        {(tab === "completed" || tab === "archived") && (() => {
          const stats = tab === "completed" ? completedGoalStats : archivedGoalStats;
          return stats.length === 0 ? (
            <p className="text-sm text-[#878680] text-center py-4">
              {tab === "completed" ? "완료된 목표가 없어요" : "보관된 목표가 없어요"}
            </p>
          ) : (
            <div className="space-y-4">
              {stats.map(({ goal, doneDays, totalDays, percent }) => (
                <Link key={goal.id} href={`/goals/${goal.id}`} className="block">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${goal.color}20` }}>
                        <CategoryIcon category={goal.category} size={14} color={goal.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#2C2C2A] truncate">{goal.title}</p>
                        <p className="text-[10px] text-[#C0BFB8]">
                          {format(parseISO(goal.start_date), "yy.MM.dd")} – {format(parseISO(goal.end_date), "yy.MM.dd")}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold flex-shrink-0 ml-2" style={{ color: goal.color }}>{percent}%</span>
                  </div>
                  <ProgressBar percent={percent} color={goal.color} />
                  <p className="text-[10px] text-[#C0BFB8] mt-1">{doneDays}일 / {totalDays}일 완료</p>
                </Link>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
