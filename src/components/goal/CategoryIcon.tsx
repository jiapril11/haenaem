import type { Category } from "@/types";

function p(d: string, sw = "1.8") {
  return `<path d="${d}" stroke="currentColor" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function wrap(content: string) {
  return content;
}

const ICONS: Record<Category, string> = {
  운동: wrap(
    `${p("M9 8v8", "2")}${p("M15 8v8", "2")}${p("M6 10v4", "2.2")}${p("M18 10v4", "2.2")}${p("M3.5 11v2", "2")}${p("M20.5 11v2", "2")}${p("M9 12h6", "1.8")}`
  ),
  학습: wrap(
    `${p("M4 5.5a1 1 0 0 1 1-1h5.5a1.5 1.5 0 0 1 1.5 1.5v13a1.2 1.2 0 0 0-1.2-1.2H4V5.5Z")}${p("M20 5.5a1 1 0 0 0-1-1h-5.5A1.5 1.5 0 0 0 12 6v13a1.2 1.2 0 0 1 1.2-1.2H20V5.5Z")}${p("M6.5 8.5h3M6.5 11.5h3", "1.5")}`
  ),
  커리어: wrap(
    `<rect x="3" y="7" width="18" height="12.5" rx="2.2" stroke="currentColor" stroke-width="1.8" fill="none"/>${p("M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7")}${p("M3 12.5c3 1.5 6 2.2 9 2.2s6-.7 9-2.2", "1.5")}${p("M11 13v1.5h2V13", "1.5")}`
  ),
  예술: wrap(
    `${p("M12 4c4.4 0 8 3.1 8 7 0 2.3-2 3.2-3.5 3.2h-1.8c-1 0-1.7.7-1.7 1.6 0 .5.3.9.3 1.4 0 1-.8 1.8-2.3 1.8-4.4 0-8-3.1-8-7.5S7.6 4 12 4Z")}<circle cx="7.5" cy="10.5" r=".9" fill="currentColor"/><circle cx="10.5" cy="7.5" r=".9" fill="currentColor"/><circle cx="14" cy="7.5" r=".9" fill="currentColor"/><circle cx="16.5" cy="10" r=".9" fill="currentColor"/>`
  ),
  금융: wrap(
    `<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" fill="none"/>${p("M14.5 9.2c-.7-.8-1.7-1.2-2.7-1.2-1.6 0-2.8 1-2.8 2.2 0 1.1 1 1.7 2.6 2 1.8.3 3 1 3 2.2 0 1.3-1.4 2.3-3 2.3-1.3 0-2.5-.5-3.1-1.4")}${p("M12 5.5v1.8M12 16.8v1.7")}`
  ),
  마음: wrap(
    `<circle cx="12" cy="7" r="2.2" stroke="currentColor" stroke-width="1.8" fill="none"/>${p("M6 18c1.8-2.3 3.8-3.3 6-3.3s4.2 1 6 3.3")}${p("M4 18c1 1 2 1.4 3 1.4M20 18c-1 1-2 1.4-3 1.4")}${p("M9.3 12.5c-1.3.3-2.3 1-3.3 2", "1.5")}${p("M14.7 12.5c1.3.3 2.3 1 3.3 2", "1.5")}`
  ),
  습관: wrap(
    `${p("M12 20V10")}${p("M12 10c0-3 2-5 5-5 0 3-2 5-5 5Z")}${p("M12 13c0-2.5-1.7-4.2-4.2-4.2 0 2.5 1.7 4.2 4.2 4.2Z")}${p("M6.5 20h11")}`
  ),
  기타: wrap(
    `${p("M12 4.5c.5 3.3 2.7 5.5 6 6-3.3.5-5.5 2.7-6 6-.5-3.3-2.7-5.5-6-6 3.3-.5 5.5-2.7 6-6Z")}${p("M18.5 4c.2 1.2 1 2 2.2 2.2-1.2.2-2 1-2.2 2.2-.2-1.2-1-2-2.2-2.2 1.2-.2 2-1 2.2-2.2", "1.4")}`
  ),
};

export default function CategoryIcon({
  category,
  size = 20,
  color = "currentColor",
  className = "",
}: {
  category: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const paths = ICONS[category as Category] ?? ICONS["기타"];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ color }}
      className={className}
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}
