/*
 * calculator.js
 * ---------------------------------------------------------------
 * A small, safe expression evaluator for the Finance calculator.
 * It does NOT use eval(). It reads the text with a recursive-descent parser:
 *
 *   expr    := term   { ("+" | "-") term }
 *   term    := unary  { ("*" | "/") unary }
 *   unary   := ("-" | "+") unary | postfix
 *   postfix := primary [ "%" ]
 *   primary := number | "(" expr ")"
 *
 * Percent works like a shop calculator:
 *   50%        = 0.5
 *   200 + 10%  = 220     (10% of the 200)
 *   200 - 10%  = 180
 *   200 * 10%  = 20
 */
(function (root) {
  'use strict';

  function tokenize(text) {
    const src = String(text)
      .replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-')
      .replace(/,/g, '');
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < src.length && /[0-9.]/.test(src[j])) j++;
        const raw = src.slice(i, j);
        if ((raw.match(/\./g) || []).length > 1 || raw === '.') throw new Error('That number is not valid.');
        tokens.push({ t: 'num', v: parseFloat(raw) });
        i = j;
        continue;
      }
      if ('+-*/()%'.includes(c)) { tokens.push({ t: c }); i++; continue; }
      throw new Error(`Unexpected "${c}".`);
    }
    return tokens;
  }

  function evaluate(text) {
    try {
      const tokens = tokenize(text);
      if (tokens.length === 0) return { ok: false, error: 'Type a calculation.' };
      let pos = 0;
      const peek = () => tokens[pos];
      const take = () => tokens[pos++];

      // each parse function returns { v: number, pct: boolean }
      // pct is true only when the whole term was a single "n%"
      function parseExpr() {
        let left = parseTerm();
        while (peek() && (peek().t === '+' || peek().t === '-')) {
          const op = take().t;
          const right = parseTerm();
          const rv = right.pct ? left.v * right.v : right.v;      // "200 + 10%" means 10% of 200
          left = { v: op === '+' ? left.v + rv : left.v - rv, pct: false };
        }
        return left;
      }
      function parseTerm() {
        let left = parseUnary();
        while (peek() && (peek().t === '*' || peek().t === '/')) {
          const op = take().t;
          const right = parseUnary();
          if (op === '/' && right.v === 0) throw new Error('Cannot divide by zero.');
          left = { v: op === '*' ? left.v * right.v : left.v / right.v, pct: false };
        }
        return left;
      }
      function parseUnary() {
        const t = peek();
        if (t && (t.t === '-' || t.t === '+')) {
          take();
          const inner = parseUnary();
          return { v: t.t === '-' ? -inner.v : inner.v, pct: inner.pct };
        }
        return parsePostfix();
      }
      function parsePostfix() {
        const p = parsePrimary();
        if (peek() && peek().t === '%') { take(); return { v: p.v / 100, pct: true }; }
        return p;
      }
      function parsePrimary() {
        const t = take();
        if (!t) throw new Error('The calculation is not finished.');
        if (t.t === 'num') return { v: t.v, pct: false };
        if (t.t === '(') {
          const inner = parseExpr();
          if (!peek() || peek().t !== ')') throw new Error('A bracket is not closed.');
          take();
          return { v: inner.v, pct: false };
        }
        throw new Error('The calculation is not valid.');
      }

      const result = parseExpr();
      if (pos < tokens.length) throw new Error(tokens[pos].t === ')' ? 'There is an extra closing bracket.' : 'The calculation is not valid.');
      if (!Number.isFinite(result.v)) throw new Error('The result is too large.');
      return { ok: true, value: Number(result.v.toPrecision(12)) };   // hides 0.1 + 0.2 = 0.30000000000000004
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  const api = { evaluate };
  root.Calculator = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
