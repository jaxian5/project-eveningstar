import { Dates } from "./dates";

export function peso(n: number, locale = "en-PH") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: "PHP" }).format(n);
  } catch {
    return `₱${n.toFixed(2)}`;
  }
}

export function fmtDate(str: string, locale = "en-PH") {
  if (!str) return "";
  return Dates.parse(str).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtTime(iso: string, locale = "en-PH") {
  return new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

export function fmtClock(iso: string, locale = "en-PH") {
  return new Date(iso).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

export function dayLabel(daysLeft: number) {
  if (daysLeft < 0) return `Expired ${-daysLeft}d ago`;
  if (daysLeft === 0) return "Expires today";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft}d left`;
}
