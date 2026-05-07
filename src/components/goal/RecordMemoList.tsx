"use client";

import { useState, useTransition } from "react";
import { updateRecordNote, deleteRecordNote } from "@/lib/actions/records";

interface RecordMemo {
  id: string;
  date: string;
  note: string;
}

interface Props {
  records: RecordMemo[];
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

export default function RecordMemoList({ records, goalId, color }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");

  if (records.length === 0) return null;

  function startEdit(r: RecordMemo) {
    setEditingId(r.id);
    setEditNote(r.note);
  }

  function handleUpdate(r: RecordMemo) {
    startTransition(() => updateRecordNote(r.id, goalId, editNote));
    setEditingId(null);
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#2C2C2A] mb-3">기록 메모</h3>
      <div className="flex flex-col gap-2">
        {records.map((r) => (
          <div key={r.id} className="bg-white border border-[#E8E8E6] rounded-xl px-4 py-3">
            <p className="text-xs font-medium mb-1" style={{ color }}>
              {r.date.replace(/-/g, ".").slice(2)}
            </p>
            {editingId === r.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full text-sm border border-[#E8E8E6] rounded-lg px-3 py-2 outline-none focus:border-[#6CBFA8] resize-none block"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="text-xs text-[#878680] px-3 py-1.5 cursor-pointer">
                    취소
                  </button>
                  <button
                    onClick={() => handleUpdate(r)}
                    disabled={isPending}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg text-white cursor-pointer"
                    style={{ backgroundColor: color }}
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-sm text-[#2C2C2A] leading-relaxed flex-1">{r.note}</p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(r)} className="p-1.5 text-[#C0BFB8] hover:text-[#878680] transition-colors cursor-pointer">
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => startTransition(() => deleteRecordNote(r.id, goalId))}
                    disabled={isPending}
                    className="p-1.5 text-[#C0BFB8] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
