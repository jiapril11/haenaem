import { formatInTimeZone } from "date-fns-tz";
import type { Locale } from "date-fns";

const KST = "Asia/Seoul";

export function getTodayKST(): string {
  return formatInTimeZone(new Date(), KST, "yyyy-MM-dd");
}

export function getYesterdayKST(): string {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return formatInTimeZone(d, KST, "yyyy-MM-dd");
}

export function getNowKST(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: KST }));
}

export function formatKST(fmt: string, options?: { locale?: Locale }): string {
  return formatInTimeZone(new Date(), KST, fmt, options);
}
