import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GoalCard from "@/components/goal/GoalCard";
import OnboardingView from "@/components/layout/OnboardingView";
import type { Goal } from "@/types";
import { getTodayKST, getNowKST, formatKST } from "@/lib/utils/date";

function calcStreak(dates: string[]): number {
  const today = getTodayKST();
  const sorted = [...dates].sort().reverse();
  let streak = 0;
  let cursor = today;
  for (const d of sorted) {
    if (d === cursor) {
      streak++;
      const prev = new Date(cursor);
      prev.setDate(prev.getDate() - 1);
      cursor = format(prev, "yyyy-MM-dd"); // 날짜 계산용 (날짜 문자열 기준이라 timezone 무관)
    } else {
      break;
    }
  }
  return streak;
}

function getGreeting(hour: number): string {
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 18) return "좋은 오후예요";
  return "좋은 저녁이에요";
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: goals }, { data: records }, { data: profile }] = await Promise.all([
    supabase.from("goals").select("*").eq("user_id", user.id).eq("is_archived", false).order("created_at", { ascending: false }),
    supabase.from("records").select("goal_id, date, note").eq("user_id", user.id).gte("date", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)),
    supabase.from("profiles").select("nickname").eq("id", user.id).single(),
  ]);

  const activeGoals: Goal[] = (goals ?? []).filter((g) => g.end_date >= today);
  const today = getTodayKST();
  const todayFmt = formatKST("M월 d일 (EEE)", { locale: ko });
  const hour = getNowKST().getHours();

  const displayName =
    profile?.nickname ??
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "사용자";

  const recordsByGoal: Record<string, string[]> = {};
  const todayNoteByGoal: Record<string, string> = {};
  for (const r of records ?? []) {
    if (!recordsByGoal[r.goal_id]) recordsByGoal[r.goal_id] = [];
    recordsByGoal[r.goal_id].push(r.date);
    if (r.date === today && r.note) todayNoteByGoal[r.goal_id] = r.note;
  }

  const todayDoneCount = activeGoals.filter(
    (g) => (recordsByGoal[g.id] ?? []).includes(today)
  ).length;

  return (
    <div className="px-4 pt-8 pb-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#878680] text-sm">{todayFmt}</p>
          <h1 className="text-xl font-bold text-[#2C2C2A] mt-1">
            {getGreeting(hour)},<br />{displayName}님! 👋
          </h1>
        </div>
        <Link
          href="/goals/new"
          className="w-10 h-10 bg-[#6CBFA8] rounded-xl flex items-center justify-center text-white text-2xl font-light flex-shrink-0 mt-1 cursor-pointer"
        >
          +
        </Link>
      </div>

      {/* 인사이트 배너 */}
      {activeGoals.length > 0 && (
        <div className="bg-[#6CBFA818] rounded-2xl px-4 py-3.5 mb-6 border border-[#6CBFA830]">
          <p className="text-[#6CBFA8] text-sm font-semibold">
            💡 {activeGoals.length}개 목표 진행 중 · 오늘 {todayDoneCount}개 완료
          </p>
          <p className="text-xs mt-1 text-[#878680]">
            꾸준함이 쌓이면 반드시 결과가 따라옵니다.
          </p>
        </div>
      )}

      {/* 목표 카드 목록 */}
      {activeGoals.length === 0 ? (
        <OnboardingView name={displayName} />
      ) : (
        <div className="flex flex-col gap-4">
          {activeGoals.map((goal) => {
            const completedDates = recordsByGoal[goal.id] ?? [];
            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                completedDates={completedDates}
                streak={calcStreak(completedDates)}
                todayNote={todayNoteByGoal[goal.id]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
