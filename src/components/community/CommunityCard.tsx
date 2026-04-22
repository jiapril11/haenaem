"use client";

import { useState, useTransition } from "react";
import CategoryIcon from "@/components/goal/CategoryIcon";
import ProgressBar from "@/components/goal/ProgressBar";
import { toggleCheer, addComment, deleteComment } from "@/lib/actions/community";
import type { Goal } from "@/types";

export interface CommentData {
  id: string;
  userId: string;
  nickname: string;
  content: string;
  createdAt: string;
}

interface Props {
  goal: Goal;
  nickname: string;
  isMe: boolean;
  streak: number;
  percent: number;
  doneDays: number;
  totalDays: number;
  doneToday: boolean;
  cheerCount: number;
  isCheered: boolean;
  comments: CommentData[];
  currentUserId: string;
  currentNickname: string;
}

export default function CommunityCard({
  goal,
  nickname,
  isMe,
  streak,
  percent,
  doneDays,
  totalDays,
  doneToday,
  cheerCount: initialCheerCount,
  isCheered: initialIsCheered,
  comments: initialComments,
  currentUserId,
  currentNickname,
}: Props) {
  const [cheerCount, setCheerCount] = useState(initialCheerCount);
  const [isCheered, setIsCheered] = useState(initialIsCheered);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCheer() {
    const wasCheeried = isCheered;
    setIsCheered(!wasCheeried);
    setCheerCount((c) => (wasCheeried ? c - 1 : c + 1));
    toggleCheer(goal.id).catch(() => {
      setIsCheered(wasCheeried);
      setCheerCount((c) => (wasCheeried ? c + 1 : c - 1));
    });
  }

  function handleAddComment() {
    const trimmed = commentInput.trim();
    if (!trimmed || isPending) return;
    setCommentError("");
    startTransition(async () => {
      try {
        const newComment = await addComment(goal.id, trimmed);
        setComments((prev) => [
          ...prev,
          {
            id: newComment.id,
            userId: newComment.user_id,
            nickname: currentNickname,
            content: newComment.content,
            createdAt: newComment.created_at,
          },
        ]);
        setCommentInput("");
      } catch (e) {
        setCommentError(e instanceof Error ? e.message : "오류가 발생했어요");
      }
    });
  }

  function handleDeleteComment(commentId: string) {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    deleteComment(commentId).catch(() => {});
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8E8E6]">
      {/* 프로필 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: goal.color }}
          >
            {nickname[0]}
          </div>
          <span className="text-xs font-medium text-[#878680]">
            {nickname}{isMe && <span className="ml-1 text-[#6CBFA8]">· 나</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {doneToday && (
            <span className="text-[10px] font-semibold text-[#6CBFA8] bg-[#6CBFA815] px-2 py-0.5 rounded-full">
              오늘 완료 ✓
            </span>
          )}
          {streak > 0 && (
            <span className="text-xs text-[#878680]">🔥 {streak}일</span>
          )}
        </div>
      </div>

      {/* 목표 정보 */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${goal.color}20` }}
        >
          <CategoryIcon category={goal.category} size={18} color={goal.color} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#2C2C2A] truncate">{goal.title}</p>
          <p className="text-xs text-[#878680]">{goal.category}</p>
        </div>
      </div>

      {/* 진행률 */}
      <ProgressBar percent={percent} color={goal.color} />
      <p className="text-[10px] text-[#C0BFB8] mt-1.5">
        {doneDays}일 완료 / 총 {totalDays}일 · {percent}%
      </p>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F0F0EE]">
        <button
          onClick={handleCheer}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors active:scale-90 ${
            isCheered ? "text-[#F9C675]" : "text-[#C0BFB8]"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isCheered ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          응원{cheerCount > 0 && ` ${cheerCount}`}
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            showComments ? "text-[#6CBFA8]" : "text-[#C0BFB8]"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          댓글{comments.length > 0 && ` ${comments.length}`}
        </button>
      </div>

      {/* 댓글 섹션 */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-[#F0F0EE]">
          {comments.length > 0 && (
            <div className="flex flex-col gap-2.5 mb-3">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#E8E8E6] flex items-center justify-center text-[9px] font-bold text-[#878680] flex-shrink-0 mt-0.5">
                    {c.nickname[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#2C2C2A] mr-1.5">{c.nickname}</span>
                    <span className="text-xs text-[#878680] break-words">{c.content}</span>
                  </div>
                  {c.userId === currentUserId && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-[#C0BFB8] hover:text-[#D75A2F] flex-shrink-0 mt-0.5 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 댓글 입력 */}
          {commentError && (
            <p className="text-xs text-[#D75A2F] mb-2">{commentError}</p>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="응원 한마디 남겨요..."
              maxLength={200}
              className="flex-1 bg-[#F8F8F9] rounded-xl px-3 py-2 text-xs text-[#2C2C2A] placeholder:text-[#C0BFB8] outline-none border border-[#E8E8E6] focus:border-[#6CBFA8]"
            />
            <button
              onClick={handleAddComment}
              disabled={isPending || !commentInput.trim()}
              className="text-[#6CBFA8] disabled:opacity-30 flex-shrink-0 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
