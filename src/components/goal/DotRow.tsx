import {
  format,
  addDays,
  subDays,
  isToday,
  isBefore,
  isAfter,
  parseISO,
  eachDayOfInterval,
} from "date-fns";

interface DotRowProps {
  completedDates: string[];
  startDate: string;
  endDate: string;
  color?: string;
  window?: number;
}

export default function DotRow({
  completedDates,
  startDate,
  endDate,
  color = "#6CBFA8",
  window: WINDOW = 20,
}: DotRowProps) {
  const today = new Date();
  const goalStart = parseISO(startDate);
  const goalEnd = parseISO(endDate);
  const completedSet = new Set(completedDates);

  // 오늘을 중앙(10번째)에 배치하는 윈도우
  let wStart = subDays(today, 9);
  let wEnd = addDays(today, WINDOW - 10);

  // 윈도우가 목표 시작일보다 앞이면 → 시작일 기준으로 당기기
  if (isBefore(wStart, goalStart)) {
    wStart = goalStart;
    wEnd = addDays(goalStart, WINDOW - 1);
  }

  // 윈도우가 목표 종료일보다 뒤면 → 종료일 기준으로 당기기
  if (isAfter(wEnd, goalEnd)) {
    wEnd = goalEnd;
    wStart = subDays(goalEnd, WINDOW - 1);
    // 목표 기간이 WINDOW보다 짧으면 시작일로 고정
    if (isBefore(wStart, goalStart)) wStart = goalStart;
  }

  const days = eachDayOfInterval({ start: wStart, end: wEnd });

  return (
    <div className="flex gap-1 flex-wrap">
      {days.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const isTodayDate = isToday(date);
        const isFutureDate = isAfter(date, today) && !isTodayDate;

        let bg = "#E8E8E6"; // 미래
        if (completedSet.has(dateStr)) bg = color;
        else if (isTodayDate) bg = `${color}66`;
        else if (isFutureDate) bg = "#E8E8E6";
        else bg = "#D75A2F"; // 과거 미완료 (공백)

        return (
          <div
            key={dateStr}
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: bg }}
          />
        );
      })}
    </div>
  );
}
