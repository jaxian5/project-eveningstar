/*
 * structures.js
 * ---------------------------------------------------------------
 * The data structure this project is built around: a binary MIN-HEAP
 * (priority queue). The smallest item, according to `cmp`, is always at
 * index 0, so PEEK is O(1) and PUSH / POP are O(log n).
 *
 * The heap lives in a plain array. For the item at index i:
 *   parent      = (i - 1) >> 1        (integer division by 2)
 *   left child  = 2i + 1
 *   right child = 2i + 2
 *
 * In this project the items are stock BATCHES and the ordering key is the
 * expiry date, so the batch that expires first is always on top (FEFO:
 * first-expired, first-out).
 *
 * No DOM code here, so the same file runs in the browser and in Node.
 */
(function (root) {
  'use strict';

  class MinHeap {
    /** @param {(a:any,b:any)=>number} cmp negative if a should come out before b */
    constructor(cmp) {
      this.cmp = cmp || ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      this.a = [];
    }

    /** Build a heap from an existing array in O(n) (Floyd's heapify). */
    static from(items, cmp) {
      const h = new MinHeap(cmp);
      h.a = items.slice();
      for (let i = (h.a.length >> 1) - 1; i >= 0; i--) h._down(i);
      return h;
    }

    size() { return this.a.length; }
    isEmpty() { return this.a.length === 0; }

    /** Smallest item without removing it. O(1) */
    peek() { return this.a[0]; }

    /** Insert an item. O(log n): add at the end, then sift UP. */
    push(item) {
      this.a.push(item);
      this._up(this.a.length - 1);
    }

    /** Remove and return the smallest item. O(log n): move last to root, sift DOWN. */
    pop() {
      const a = this.a;
      if (a.length === 0) return undefined;
      const top = a[0];
      const last = a.pop();
      if (a.length > 0) {
        a[0] = last;
        this._down(0);
      }
      return top;
    }

    /** Visit every item in storage order (NOT sorted order). O(n) */
    forEach(fn) { this.a.forEach(fn); }

    /** Copy of the items in storage order. O(n) */
    toArray() { return this.a.slice(); }

    /**
     * Remove every item matching `pred`, then restore the heap property.
     * O(n): filter, then heapify. Used for rare edits (deleting one batch).
     */
    removeWhere(pred) {
      const kept = this.a.filter(x => !pred(x));
      const removed = this.a.length - kept.length;
      if (removed > 0) {
        this.a = kept;
        for (let i = (kept.length >> 1) - 1; i >= 0; i--) this._down(i);
      }
      return removed;
    }

    // ---- internals -------------------------------------------------

    /** Sift up: while the item is smaller than its parent, swap with it. */
    _up(i) {
      const a = this.a;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.cmp(a[i], a[p]) >= 0) break;
        [a[i], a[p]] = [a[p], a[i]];
        i = p;
      }
    }

    /** Sift down: swap with the smaller child until the item is in place. */
    _down(i) {
      const a = this.a, n = a.length;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < n && this.cmp(a[l], a[m]) < 0) m = l;
        if (r < n && this.cmp(a[r], a[m]) < 0) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
  }

  root.Structures = { MinHeap };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.Structures;
})(typeof window !== 'undefined' ? window : globalThis);
