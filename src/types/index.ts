export type Category = "운동" | "학습" | "커리어" | "예술" | "금융" | "마음" | "습관" | "기타";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: Category;
  color: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  is_public: boolean;
  is_archived: boolean;
  archive_reason: "expired" | "manual" | null;
  notification_time: string | null; // HH:MM
  created_at: string;
}

export interface Record {
  id: string;
  goal_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  note: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  target_date: string | null;
  is_done: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
}
