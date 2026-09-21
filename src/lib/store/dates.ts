export const Dates = {
  pad: (n: number) => String(n).padStart(2, "0"),
  todayStr(d = new Date()) {
    return `${d.getFullYear()}-${Dates.pad(d.getMonth() + 1)}-${Dates.pad(d.getDate())}`;
  },
  isValid(str: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    const [y, m, d] = str.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  },
  parse(str: string) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  },
  daysBetween(fromStr: string, toStr: string) {
    return Math.round((Dates.parse(toStr).getTime() - Dates.parse(fromStr).getTime()) / 86400000);
  },
  addDays(str: string, n: number) {
    const d = Dates.parse(str);
    d.setDate(d.getDate() + n);
    return Dates.todayStr(d);
  },
};

export const NO_EXPIRY = "9999-12-31";
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const toCents = (n: number) => Math.round(n * 100);
export const fail = (error: string) => ({ ok: false as const, error });
export const normSku = (s: unknown) => String(s == null ? "" : s).trim().toUpperCase();
export const parsePrice = (v: unknown) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? round2(n) : null;
};
export const parseReorder = (v: unknown, fallback: number) => {
  if (v === "" || v == null) return fallback;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : null;
};
export const parseQty = (v: unknown) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};
