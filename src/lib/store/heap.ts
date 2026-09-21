export class MinHeap<T> {
  cmp: (a: T, b: T) => number;
  a: T[];

  constructor(cmp?: (a: T, b: T) => number) {
    this.cmp = cmp || ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    this.a = [];
  }

  static from<T>(items: T[], cmp?: (a: T, b: T) => number) {
    const h = new MinHeap(cmp);
    h.a = items.slice();
    for (let i = (h.a.length >> 1) - 1; i >= 0; i--) h._down(i);
    return h;
  }

  size() {
    return this.a.length;
  }
  isEmpty() {
    return this.a.length === 0;
  }
  peek() {
    return this.a[0];
  }
  push(item: T) {
    this.a.push(item);
    this._up(this.a.length - 1);
  }
  pop() {
    const a = this.a;
    if (a.length === 0) return undefined;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      this._down(0);
    }
    return top;
  }
  forEach(fn: (item: T) => void) {
    this.a.forEach(fn);
  }
  toArray() {
    return this.a.slice();
  }
  removeWhere(pred: (item: T) => boolean) {
    const kept = this.a.filter((x) => !pred(x));
    const removed = this.a.length - kept.length;
    if (removed > 0) {
      this.a = kept;
      for (let i = (kept.length >> 1) - 1; i >= 0; i--) this._down(i);
    }
    return removed;
  }
  _up(i: number) {
    const a = this.a;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(a[i]!, a[p]!) >= 0) break;
      [a[i], a[p]] = [a[p]!, a[i]!];
      i = p;
    }
  }
  _down(i: number) {
    const a = this.a;
    const n = a.length;
    while (true) {
      const l = 2 * i + 1;
      const r = l + 1;
      let m = i;
      if (l < n && this.cmp(a[l]!, a[m]!) < 0) m = l;
      if (r < n && this.cmp(a[r]!, a[m]!) < 0) m = r;
      if (m === i) break;
      [a[i], a[m]] = [a[m]!, a[i]!];
      i = m;
    }
  }
}
