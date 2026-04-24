import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import CategoryIcon from "@/components/goal/CategoryIcon";
import MyCommentDeleteButton from "@/components/community/MyCommentDeleteButton";

export default async function MyCommentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myComments } = await supabase
    .from("comments")
    .select("id, content, created_at, goal_id, goals(id, title, color, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const comments = myComments ?? [];

  return (
    <div className="px-4 pt-6 pb-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/community" className="w-9 h-9 rounded-xl bg-white border border-[#E8E8E6] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#878680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-[#2C2C2A]">내 댓글</h1>
      </div>

      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-semibold text-[#2C2C2A] mb-1">아직 댓글이 없어요</p>
          <p className="text-sm text-[#878680]">커뮤니티에서 응원 한마디를 남겨보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => {
            const goal = (Array.isArray(comment.goals) ? comment.goals[0] : comment.goals) as { id: string; title: string; color: string; category: string } | null;
            const dateStr = format(parseISO(comment.created_at), "M월 d일 (EEE)", { locale: ko });
            return (
              <div key={comment.id} className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
                {/* 목표 정보 */}
                {goal && (
                  <div className="flex items-center gap-2 mb-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <CategoryIcon category={goal.category} size={14} color={goal.color} />
                    </div>
                    <p className="text-xs font-semibold text-[#878680] truncate">{goal.title}</p>
                  </div>
                )}
                {/* 댓글 내용 */}
                <p className="text-sm text-[#2C2C2A] leading-relaxed mb-2.5">{comment.content}</p>
                {/* 날짜 + 삭제 */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#C0BFB8]">{dateStr}</p>
                  <MyCommentDeleteButton commentId={comment.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
