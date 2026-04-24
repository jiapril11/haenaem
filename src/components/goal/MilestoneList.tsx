"use client";

import { useState, useTransition } from "react";
import { toggleMilestone, createMilestone, updateMilestone, deleteMilestone } from "@/lib/actions/milestones";
import type { Milestone } from "@/types";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  milestones: Milestone[];
  goalId: string;
  color: string;
}

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MilestoneList({ milestones, goalId, color }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  function startEdit(m: Milestone) {
    setEditingId(m.id);
    setEditTitle(m.title);
    setEditDate(m.target_date ?? "");
  }

  function handleUpdate(m: Milestone) {
    if (!editTitle.trim()) return;
    startTransition(() => updateMilestone(m.id, goalId, editTitle, editDate || null));
    setEditingId(null);
  }

  function handleCreate() {
    if (!newTitle.trim()) return;
    startTransition(() => createMilestone(goalId, newTitle, newDate || null));
    setIsAdding(false);
    setNewTitle("");
    setNewDate("");
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E6]">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-[#2C2C2A]">마일스톤</h3>
      </div>

      {milestones.length > 0 && (
        <ul className="w-full">
          {milestones.map((m, i) => (
            <li
              key={m.id}
              className={`px-4 py-3 ${i < milestones.length - 1 ? "border-b border-[#F0F0EE]" : ""}`}
            >
              {editingId === m.id ? (
                <div className="w-full min-w-0 flex flex-col gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full min-w-0 text-sm border border-[#E8E8E6] rounded-lg px-3 py-2 outline-none focus:border-[#6CBFA8]"
                    autoFocus
                  />
                  <div className="relative w-full">
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full block text-sm border border-[#E8E8E6] rounded-lg pl-3 pr-9 py-2 outline-none focus:border-[#6CBFA8]"
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0BFB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="text-xs text-[#878680] px-3 py-1.5">
                      취소
                    </button>
                    <button
                      onClick={() => handleUpdate(m)}
                      disabled={!editTitle.trim() || isPending}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg text-white disabled:opacity-40"
                      style={{ backgroundColor: color }}
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startTransition(() => toggleMilestone(m.id, goalId, m.is_done))}
                    disabled={isPending}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: m.is_done ? color : "#C0BFB8",
                      backgroundColor: m.is_done ? color : "transparent",
                    }}
                  >
                    {m.is_done && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${m.is_done ? "line-through text-[#878680]" : "text-[#2C2C2A]"}`}>
                      {m.title}
                    </p>
                    {m.target_date && (
                      <p className="text-xs text-[#878680] mt-0.5">
                        {format(parseISO(m.target_date), "M월 d일", { locale: ko })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(m)} className="p-1.5 text-[#C0BFB8] hover:text-[#878680] transition-colors">
                      <PencilIcon />
                    </button>
                    <button
                      onClick={() => startTransition(() => deleteMilestone(m.id, goalId))}
                      disabled={isPending}
                      className="p-1.5 text-[#C0BFB8] hover:text-red-400 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAdding ? (
        <div className={`px-4 py-3 w-full min-w-0 flex flex-col gap-2 ${milestones.length > 0 ? "border-t border-[#F0F0EE]" : ""}`}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="마일스톤 이름"
            className="w-full min-w-0 text-sm border border-[#E8E8E6] rounded-lg px-3 py-2 outline-none focus:border-[#6CBFA8]"
            autoFocus
          />
          <div className="relative w-full">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full block text-sm border border-[#E8E8E6] rounded-lg pl-3 pr-9 py-2 outline-none focus:border-[#6CBFA8]"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0BFB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setIsAdding(false); setNewTitle(""); setNewDate(""); }}
              className="text-xs text-[#878680] px-3 py-1.5"
            >
              취소
            </button>
            <button
              onClick={handleCreate}
              disabled={!newTitle.trim() || isPending}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-white disabled:opacity-40"
              style={{ backgroundColor: color }}
            >
              추가
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={`w-full px-4 py-3 text-sm text-[#878680] flex items-center gap-2 hover:bg-[#F8F8F9] transition-colors rounded-b-2xl ${milestones.length > 0 ? "border-t border-[#F0F0EE]" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          마일스톤 추가
        </button>
      )}
    </div>
  );
}
