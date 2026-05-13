import Link from "next/link";
import { differenceInDays, format, parseISO } from "date-fns";
import ProgressBar from "./ProgressBar";
import DotRow from "./DotRow";
import TodayToggleButton from "./TodayToggleButton";
import type { Goal } from "@/types";
import CategoryIcon from "./CategoryIcon";

interface GoalCardProps {
  goal: Goal;
  completedDates: string[];
  streak: number;
  todayNote?: string;
}

export default function GoalCard({ goal, completedDates, streak, todayNote }: GoalCardProps) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const isDoneToday = completedDates.includes(today);
  const isNotStarted = goal.start_date > today;

  const totalDays = differenceInDays(parseISO(goal.end_date), parseISO(goal.start_date)) + 1;
  const doneDays = completedDates.length;
  const progressPercent = Math.round((doneDays / totalDays) * 100);

  const startFmt = format(parseISO(goal.start_date), "M.d");
  const endFmt = format(parseISO(goal.end_date), "M.d");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E8E6]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <Link href={`/goals/${goal.id}`} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <CategoryIcon category={goal.category} size={20} color={goal.color} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[#2C2C2A] text-sm leading-tight truncate">
              {goal.title}
            </h3>
            <p className="text-[#878680] text-xs mt-0.5">
              {startFmt} – {endFmt}
            </p>
          </div>
        </Link>

        {/* 스트릭 pill */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2"
          style={{ backgroundColor: `${goal.color}18`, color: goal.color }}
        >
          🔥 {streak}일
        </div>
      </div>

      {/* 진행률 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#878680] mb-1.5">
          <span>{doneDays}/{totalDays}일</span>
          <span>{progressPercent}%</span>
        </div>
        <ProgressBar percent={progressPercent} color={goal.color} />
      </div>

      {/* 점 행 */}
      <div className="mb-4">
        <DotRow
          completedDates={completedDates}
          startDate={goal.start_date}
          endDate={goal.end_date}
          color={goal.color}
        />
      </div>

      {/* 오늘 체크 버튼 */}
      {isNotStarted ? (
        <button
          disabled
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#F0F0EE] text-[#C0BFB8] disabled:opacity-100"
        >
          {startFmt} 시작 예정
        </button>
      ) : (
        <TodayToggleButton
          goalId={goal.id}
          isDoneToday={isDoneToday}
          color={goal.color}
          todayNote={todayNote}
        />
      )}
    </div>
  );
}
