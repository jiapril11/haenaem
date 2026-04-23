import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format, differenceInDays, parseISO, getDaysInMonth, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, getDay } from "date-fns";
import { getTodayKST, getYesterdayKST, getNowKST } from "@/lib/utils/date";
import { ko } from "date-fns/locale";
import ProgressBar from "@/components/goal/ProgressBar";
import CategoryIcon from "@/components/goal/CategoryIcon";

function calcStreak(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(dates)].sort();
  const today = getTodayKST();
  const yesterday = getYesterdayKST();

  let current = 0;
  let cursor = sorted.includes(today) ? today : yesterday;
  if (sorted.includes(cursor)) {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i] === cursor) {
        current++;
        const prev = new Date(cursor);
        prev.setDate(prev.getDate() - 1);
        cursor = format(prev, "yyyy-MM-dd");
      } else if (sorted[i] < cursor) break;
    }
  }

  let longest = 1, temp = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInDays(parseISO(sorted[i]), parseISO(sorted[i - 1]));
    if (diff === 1) { temp++; longest = Math.max(longest, temp); }
    else temp = 1;
  }
  return { current, longest };
}

export default async function StatsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: goals }, { data: records }] = await Promise.all([
    supabase.from("goals").select("*").eq("user_id", user.id),
    supabase.from("records").select("goal_id, date").eq("user_id", user.id),
  ]);

  const allGoals = goals ?? [];
  const allRecords = records ?? [];
  const activeGoals = allGoals.filter((g) => !g.is_archived);

  const allDates = [...new Set(allRecords.map((r) => r.date))];
  const { current: currentStreak, longest: longestStreak } = calcStreak(allDates);

  const now = getNowKST();
  const today = getTodayKST();
  const monthStr = format(now, "yyyy-MM");
  const thisMonthDates = new Set(allDates.filter((d) => d.startsWith(monthStr)));

  // 이번 주 현황 (월요일 시작)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weekDoneSet = new Set(allDates);
  const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

  // 이번 달 히트맵
  const monthDays = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) });
  const firstDayOfWeek = (getDay(startOfMonth(now)) + 6) % 7; // 월요일=0 기준
  const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

  // 요일별 패턴 (월=0 ~ 일=6)
  const dayPattern = Array(7).fill(0).map(() => ({ done: 0, total: 0 }));
  allDates.forEach((d) => {
    const dow = (getDay(parseISO(d)) + 6) % 7;
    dayPattern[dow].done++;
  });
  // 전체 해당 요일 수 계산 (목표 기간 기준)
  activeGoals.forEach((goal) => {
    const start = parseISO(goal.start_date);
    const end = parseISO(goal.end_date) < now ? parseISO(goal.end_date) : now;
    if (start > end) return;
    eachDayOfInterval({ start, end }).forEach((d) => {
      const dow = (getDay(d) + 6) % 7;
      dayPattern[dow].total++;
    });
  });
  const maxDayDone = Math.max(...dayPattern.map((d) => d.done), 1);

  // 목표별 달성률
  const goalStats = activeGoals.map((goal) => {
    const goalRecords = allRecords.filter((r) => r.goal_id === goal.id).map((r) => r.date);
    const totalDays = differenceInDays(parseISO(goal.end_date), parseISO(goal.start_date)) + 1;
    const doneDays = goalRecords.length;
    const percent = Math.round((doneDays / totalDays) * 100);
    const { current } = calcStreak(goalRecords);
    return { goal, doneDays, totalDays, percent, streak: current };
  }).sort((a, b) => b.percent - a.percent);

  if (allGoals.length === 0) {
    return (
      <div className="px-4 pt-8 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-sm text-[#878680]">목표를 추가하면 통계가 쌓여요</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-6 space-y-5">
      <h1 className="text-xl font-bold text-[#2C2C2A]">통계</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "진행 중 목표", value: `${activeGoals.length}개` },
          { label: "총 완료일", value: `${allDates.length}일` },
          { label: "현재 스트릭", value: currentStreak > 0 ? `${currentStreak}일 🔥` : "0일" },
          { label: "최장 스트릭", value: longestStreak > 0 ? `${longestStreak}일 ⚡` : "0일" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
            <p className="text-xs text-[#878680] mb-1">{item.label}</p>
            <p className="text-lg font-bold text-[#2C2C2A]">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 이번 주 현황 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
        <h2 className="text-sm font-semibold text-[#2C2C2A] mb-3">이번 주</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day, i) => {
            const dayStr = format(day, "yyyy-MM-dd");
            const isFuture = dayStr > today;
            const isDone = weekDoneSet.has(dayStr);
            const isToday = dayStr === today;
            return (
              <div key={dayStr} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-medium ${isToday ? "text-[#6CBFA8]" : "text-[#878680]"}`}>
                  {DAY_LABELS[i]}
                </span>
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isDone ? "#6CBFA8" : isFuture ? "#F0F0EE" : "#FFE8E3",
                  }}
                >
                  {isDone && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 이번 달 히트맵 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#2C2C2A]">
            {format(now, "M월", { locale: ko })} 현황
          </h2>
          <span className="text-xs text-[#878680]">
            {thisMonthDates.size} / {now.getDate()}일 완료
          </span>
        </div>
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEK_LABELS.map((d) => (
            <div key={d} className="text-center text-[10px] text-[#C0BFB8] font-medium">{d}</div>
          ))}
        </div>
        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDayOfWeek).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {monthDays.map((day) => {
            const dayStr = format(day, "yyyy-MM-dd");
            const isFuture = dayStr > today;
            const isDone = thisMonthDates.has(dayStr);
            const isToday = dayStr === today;
            let bg = "#F0F0EE";
            if (isDone) bg = "#6CBFA8";
            else if (isToday) bg = "#6CBFA840";
            else if (!isFuture) bg = "#FFE8E3";
            return (
              <div key={dayStr} className="aspect-square rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                <span className={`text-[10px] font-medium ${isDone ? "text-white" : "text-[#878680]"}`}>
                  {format(day, "d")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 요일별 패턴 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
        <h2 className="text-sm font-semibold text-[#2C2C2A] mb-4">요일별 패턴</h2>
        <div className="flex items-end justify-between gap-2 h-20">
          {dayPattern.map((d, i) => {
            const height = maxDayDone > 0 ? Math.max((d.done / maxDayDone) * 100, d.done > 0 ? 10 : 0) : 0;
            const isTop = d.done === maxDayDone && d.done > 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center" style={{ height: 56 }}>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${height}%`,
                      minHeight: d.done > 0 ? 6 : 0,
                      backgroundColor: isTop ? "#6CBFA8" : "#6CBFA850",
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#878680]">{DAY_LABELS[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 목표별 현황 */}
      {goalStats.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
          <h2 className="text-sm font-semibold text-[#2C2C2A] mb-4">목표별 현황</h2>
          <div className="space-y-4">
            {goalStats.map(({ goal, doneDays, totalDays, percent, streak }) => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${goal.color}20` }}>
                      <CategoryIcon category={goal.category} size={14} color={goal.color} />
                    </div>
                    <span className="text-sm text-[#2C2C2A] truncate">{goal.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {streak > 0 && (
                      <span className="text-xs text-[#878680]">🔥 {streak}일</span>
                    )}
                    <span className="text-xs font-semibold" style={{ color: goal.color }}>{percent}%</span>
                  </div>
                </div>
                <ProgressBar percent={percent} color={goal.color} />
                <p className="text-[10px] text-[#C0BFB8] mt-1">{doneDays}일 / {totalDays}일</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
