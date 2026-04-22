import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format, differenceInDays, parseISO } from "date-fns";
import Link from "next/link";
import CommunityCard from "@/components/community/CommunityCard";
import type { CommentData } from "@/components/community/CommunityCard";

function calcCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort();
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  let cursor = sorted.includes(today) ? today : yesterday;
  if (!sorted.includes(cursor)) return 0;
  let streak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i] === cursor) {
      streak++;
      const prev = new Date(cursor);
      prev.setDate(prev.getDate() - 1);
      cursor = format(prev, "yyyy-MM-dd");
    } else if (sorted[i] < cursor) break;
  }
  return streak;
}

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = format(new Date(), "yyyy-MM-dd");

  const [
    { data: publicGoals },
    { data: records },
    { data: profiles },
    { data: cheers },
    { data: allComments },
  ] = await Promise.all([
    supabase.from("goals").select("*").eq("is_public", true).eq("is_archived", false).gte("end_date", today).order("created_at", { ascending: false }),
    supabase.from("records").select("goal_id, date"),
    supabase.from("profiles").select("id, nickname, avatar_url"),
    supabase.from("cheers").select("goal_id, user_id"),
    supabase.from("comments").select("id, goal_id, user_id, content, created_at").order("created_at", { ascending: true }),
  ]);

  const goals = publicGoals ?? [];
  const allRecords = records ?? [];
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const allCheers = cheers ?? [];
  const commentList = allComments ?? [];

  const currentNickname =
    profileMap[user.id]?.nickname ??
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "사용자";

  const feed = goals.map((goal) => {
    const goalRecords = allRecords.filter((r) => r.goal_id === goal.id).map((r) => r.date);
    const totalDays = differenceInDays(parseISO(goal.end_date), parseISO(goal.start_date)) + 1;
    const doneDays = goalRecords.length;
    const percent = Math.round((doneDays / totalDays) * 100);
    const streak = calcCurrentStreak(goalRecords);
    const doneToday = goalRecords.includes(today);
    const profile = profileMap[goal.user_id];
    const nickname = profile?.nickname ?? (goal.user_id === user.id ? "나" : "익명");
    const isMe = goal.user_id === user.id;

    // 응원
    const goalCheers = allCheers.filter((c) => c.goal_id === goal.id);
    const cheerCount = goalCheers.length;
    const isCheered = goalCheers.some((c) => c.user_id === user.id);

    // 댓글
    const goalComments: CommentData[] = commentList
      .filter((c) => c.goal_id === goal.id)
      .map((c) => ({
        id: c.id,
        userId: c.user_id,
        nickname: profileMap[c.user_id]?.nickname ?? "익명",
        content: c.content,
        createdAt: c.created_at,
      }));

    return { goal, doneDays, totalDays, percent, streak, doneToday, nickname, isMe, cheerCount, isCheered, goalComments };
  }).sort((a, b) => b.streak - a.streak || b.percent - a.percent);

  const myPublicCount = goals.filter((g) => g.user_id === user.id).length;

  return (
    <div className="px-4 pt-8 pb-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-[#2C2C2A]">커뮤니티</h1>
        <div className="flex items-center gap-3">
          <Link href="/my-comments" className="text-xs text-[#6CBFA8] font-semibold">
            내 댓글
          </Link>
          <span className="text-xs text-[#878680]">공개 목표 {goals.length}개</span>
        </div>
      </div>

      {myPublicCount === 0 && (
        <div className="bg-[#6CBFA810] border border-[#6CBFA830] rounded-2xl px-4 py-3.5 mb-5">
          <p className="text-sm font-semibold text-[#6CBFA8] mb-0.5">목표를 공개해보세요</p>
          <p className="text-xs text-[#878680] mb-3">다른 사람들과 함께 목표를 이뤄가요</p>
          <Link href="/goals/new" className="inline-block bg-[#6CBFA8] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
            목표 추가하기
          </Link>
        </div>
      )}

      {feed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-4xl mb-3">🌱</p>
          <p className="font-semibold text-[#2C2C2A] mb-1">아직 공개된 목표가 없어요</p>
          <p className="text-sm text-[#878680]">목표를 공개하면 여기에 표시돼요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {feed.map(({ goal, doneDays, totalDays, percent, streak, doneToday, nickname, isMe, cheerCount, isCheered, goalComments }) => (
            <CommunityCard
              key={goal.id}
              goal={goal}
              nickname={nickname}
              isMe={isMe}
              streak={streak}
              percent={percent}
              doneDays={doneDays}
              totalDays={totalDays}
              doneToday={doneToday}
              cheerCount={cheerCount}
              isCheered={isCheered}
              comments={goalComments}
              currentUserId={user.id}
              currentNickname={currentNickname}
            />
          ))}
        </div>
      )}
    </div>
  );
}
