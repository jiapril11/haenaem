import { notFound, redirect } from "next/navigation";
import { format, differenceInDays, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getTodayKST } from "@/lib/utils/date";
import MonthlyCalendar from "@/components/calendar/MonthlyCalendar";
import ProgressBar from "@/components/goal/ProgressBar";
import BackButton from "@/components/layout/BackButton";
import MilestoneList from "@/components/goal/MilestoneList";
import RecordMemoList from "@/components/goal/RecordMemoList";
import GoalActions from "@/components/goal/GoalActions";
import Link from "next/link";
import CategoryIcon from "@/components/goal/CategoryIcon";

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: goal }, { data: records }, { data: milestones }] = await Promise.all([
    supabase.from("goals").select("*").eq("id", id).eq("user_id", user.id).single(),
    supabase.from("records").select("id, date, note").eq("goal_id", id).eq("user_id", user.id).order("date", { ascending: false }),
    supabase.from("milestones").select("*").eq("goal_id", id).order("target_date", { ascending: true, nullsFirst: false }),
  ]);

  if (!goal) notFound();

  const isExpired = goal.end_date < getTodayKST();

  const completedDates = (records ?? []).map((r) => r.date);
  const notedRecords = (records ?? []).filter((r): r is { id: string; date: string; note: string } => !!r.note);
  const totalDays =
    differenceInDays(parseISO(goal.end_date), parseISO(goal.start_date)) + 1;
  const doneDays = completedDates.length;
  const progressPercent = Math.round((doneDays / totalDays) * 100);
  const startFmt = format(parseISO(goal.start_date), "yyyy.M.d");
  const endFmt = format(parseISO(goal.end_date), "yyyy.M.d");
  const missedDays = Math.max(
    0,
    differenceInDays(new Date(), parseISO(goal.start_date)) + 1 - doneDays,
  );

  return (
    <div className="min-h-screen bg-[#F8F8F9]">
      {/* 헤더 */}
      <div
        className="px-4 pt-6 pb-8 rounded-b-3xl"
        style={{ backgroundColor: `${goal.color}18` }}
      >
        <div className="flex items-center justify-between mb-0">
          <BackButton />
          {!isExpired && (
            <Link
              href={`/goals/${id}/edit`}
              className="mb-4 text-sm font-medium px-3 py-1.5 rounded-xl bg-white border border-[#E8E8E6] text-[#878680]"
            >
              수정
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}30` }}
          >
            <CategoryIcon category={goal.category} size={22} color={goal.color} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: goal.color }}>
              {goal.category}
            </p>
            <h1 className="text-lg font-bold text-[#2C2C2A]">{goal.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-[#878680]">
                {startFmt} – {endFmt}
              </p>
              <div className="w-px h-3 bg-[#D8D8D4]" />
              {goal.notification_time ? (
                <div className="flex items-center gap-1">
                  <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
                    <path d="M6.5 0.875C6.5 0.875 6.5 0.875 6.5 0.875C4.01472 0.875 2 2.88972 2 5.375V8.125L0.875 9.625H12.125L11 8.125V5.375C11 2.88972 8.98528 0.875 6.5 0.875Z" fill={goal.color} />
                    <path d="M5 11.375C5 12.2034 5.67157 12.875 6.5 12.875C7.32843 12.875 8 12.2034 8 11.375" stroke={goal.color} strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: goal.color }}>{goal.notification_time}</span>
                </div>
              ) : (
                <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
                  <path d="M6.5 0.875C4.01472 0.875 2 2.88972 2 5.375V8.125L0.875 9.625H12.125L11 8.125V5.375C11 2.88972 8.98528 0.875 6.5 0.875Z" fill="#C8C8C4" />
                  <path d="M5 11.375C5 12.2034 5.67157 12.875 6.5 12.875C7.32843 12.875 8 12.2034 8 11.375" stroke="#C8C8C4" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1.5" y1="1.5" x2="11.5" y2="12.5" stroke="#C8C8C4" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="bg-white rounded-xl p-3">
          <div className="flex justify-between text-xs text-[#878680] mb-1.5">
            <span>
              {doneDays}일 완료 / {totalDays}일 전체
            </span>
            <span className="font-semibold" style={{ color: goal.color }}>
              {progressPercent}%
            </span>
          </div>
          <ProgressBar percent={progressPercent} color={goal.color} />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-10">
        {/* 통계 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "완료", value: `${doneDays}일` },
            { label: "공백", value: `${missedDays}일` },
            { label: "달성률", value: `${progressPercent}%` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-3 text-center border border-[#E8E8E6]"
            >
              <p className="text-xs text-[#878680] mb-1">{stat.label}</p>
              <p className="font-bold text-[#2C2C2A]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 마일스톤 */}
        <MilestoneList
          milestones={milestones ?? []}
          goalId={id}
          color={goal.color}
        />

        {/* 캘린더 */}
        <MonthlyCalendar
          completedDates={completedDates}
          startDate={goal.start_date}
          endDate={goal.end_date}
          color={goal.color}
        />

        {/* 기록 메모 */}
        <RecordMemoList
          records={notedRecords as { id: string; date: string; note: string }[]}
          goalId={id}
          color={goal.color}
        />

        {/* 보관/삭제 */}
        <GoalActions goalId={id} isArchived={goal.is_archived} archiveReason={goal.archive_reason} isPublic={goal.is_public} />
      </div>
    </div>
  );
}
