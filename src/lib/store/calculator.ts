type Tok = { t: string; v?: number };

function tokenize(text: string): Tok[] {
  const src = String(text)
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/[−–]/g, "-")
    .replace(/,/g, "");
  const tokens: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i]!;
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j]!)) j++;
      const raw = src.slice(i, j);
      if ((raw.match(/\./g) || []).length > 1 || raw === ".") {
        throw new Error("That number is not valid.");
      }
      tokens.push({ t: "num", v: parseFloat(raw) });
      i = j;
      continue;
    }
    if ("+-*/()%".includes(c)) {
      tokens.push({ t: c });
      i++;
      continue;
    }
    throw new Error(`Unexpected "${c}".`);
  }
  return tokens;
}

type Node = { v: number; pct: boolean };

export function evaluate(text: string): { ok: true; value: number } | { ok: false; error: string } {
  try {
    const tokens = tokenize(text);
    if (tokens.length === 0) return { ok: false, error: "Type a calculation." };
    let pos = 0;
    const peek = () => tokens[pos];
    const take = () => tokens[pos++];

    function parseExpr(): Node {
      let left = parseTerm();
      while (peek() && (peek()!.t === "+" || peek()!.t === "-")) {
        const op = take()!.t;
        const right = parseTerm();
        const rv = right.pct ? left.v * right.v : right.v;
        left = { v: op === "+" ? left.v + rv : left.v - rv, pct: false };
      }
      return left;
    }
    function parseTerm(): Node {
      let left = parseUnary();
      while (peek() && (peek()!.t === "*" || peek()!.t === "/")) {
        const op = take()!.t;
        const right = parseUnary();
        if (op === "/" && right.v === 0) throw new Error("Cannot divide by zero.");
        left = { v: op === "*" ? left.v * right.v : left.v / right.v, pct: false };
      }
      return left;
    }
    function parseUnary(): Node {
      const t = peek();
      if (t && (t.t === "-" || t.t === "+")) {
        take();
        const inner = parseUnary();
        return { v: t.t === "-" ? -inner.v : inner.v, pct: inner.pct };
      }
      return parsePostfix();
    }
    function parsePostfix(): Node {
      const p = parsePrimary();
      if (peek() && peek()!.t === "%") {
        take();
        return { v: p.v / 100, pct: true };
      }
      return p;
    }
    function parsePrimary(): Node {
      const t = take();
      if (!t) throw new Error("The calculation is not finished.");
      if (t.t === "num") return { v: t.v ?? 0, pct: false };
      if (t.t === "(") {
        const inner = parseExpr();
        if (!peek() || peek()!.t !== ")") throw new Error("A bracket is not closed.");
        take();
        return { v: inner.v, pct: false };
      }
      throw new Error("The calculation is not valid.");
    }

    const result = parseExpr();
    if (pos < tokens.length) {
      throw new Error(tokens[pos]!.t === ")" ? "There is an extra closing bracket." : "The calculation is not valid.");
    }
    if (!Number.isFinite(result.v)) throw new Error("The result is too large.");
    return { ok: true, value: Number(result.v.toPrecision(12)) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "The calculation is not valid." };
  }
}
