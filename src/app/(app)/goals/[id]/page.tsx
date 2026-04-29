import { notFound, redirect } from "next/navigation";
import { format, differenceInDays, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/server";
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
          <Link
            href={`/goals/${id}/edit`}
            className="mb-4 text-sm font-medium px-3 py-1.5 rounded-xl bg-white border border-[#E8E8E6] text-[#878680]"
          >
            수정
          </Link>
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
            <p className="text-xs text-[#878680] mt-0.5">
              {startFmt} – {endFmt}
            </p>
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

        {/* 알림 설정 */}
        {goal.notification_time && (
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#E8E8E6]">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${goal.color}20` }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" fill={goal.color} />
                <path d="M8 4.5a.5.5 0 0 1 .5.5v3.25l2 1.15a.5.5 0 1 1-.5.87l-2.25-1.3A.5.5 0 0 1 7.5 8.5V5a.5.5 0 0 1 .5-.5z" fill={goal.color} />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#878680]">매일 알림</p>
              <p className="text-sm font-semibold text-[#2C2C2A]">{goal.notification_time}</p>
            </div>
          </div>
        )}

        {/* 보관/삭제 */}
        <GoalActions goalId={id} isArchived={goal.is_archived} isPublic={goal.is_public} />
      </div>
    </div>
  );
}
