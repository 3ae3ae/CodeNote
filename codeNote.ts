class Queue<T = number> {
  protected q: T[];
  protected f: number;
  protected r: number;
  constructor(q: T[] = []) {
    this.q = q;
    this.f = 0;
    this.r = this.q.length;
  }

  push(n: T) {
    this.q[this.r++] = n;
  }

  pop() {
    const popedVal = this.q[this.f++];
    if (this.f > 10000) {
      this.q = this.q.slice(this.f);
      this.r -= this.f;
      this.f = 0;
    }
    return popedVal;
  }

  size() {
    return this.r - this.f;
  }
}

function makeHeap<T = number>(
  minMax: "min" | "max" | "Min" | "Max",
  search?: (a: T) => number
) {
  class Heap {
    protected h: T[];
    protected s: (a: T) => number;
    protected compare: (
      a: number | undefined,
      b: number | undefined
    ) => boolean | undefined;
    constructor() {
      this.h = [];
      this.h[0] = {} as T;
      if (search) {
        this.s = (a) => search(a);
      } else {
        this.s = (a) => {
          if (typeof a == "number") return a;
          else throw new Error("서치함수가 필요합니다.");
        };
      }
      if (minMax == "min" || minMax == "Min") {
        this.compare = (a, b) => a! < b!;
      } else {
        this.compare = (a, b) => a! > b!;
      }
    }

    sh(i: number) {
      if (this.h[i] == undefined) {
        return undefined;
      }
      return this.s(this.h[i]);
    }

    swap(a: number, b: number) {
      [this.h[a], this.h[b]] = [this.h[b], this.h[a]];
    }

    push(n: T) {
      this.h.push(n);
      let c = this.h.length - 1;
      let p = Math.floor(c / 2);
      while (p != 0 && this.compare(this.sh(c), this.sh(p))) {
        this.swap(c, p);
        c = p;
        p = Math.floor(c / 2);
      }
    }

    pop() {
      if (this.h.length == 1) {
        throw new Error("힙에 자료가 없습니다.");
      }
      const returnVal = this.h[1];
      if (this.h.length == 2) {
        return this.h.pop();
      }
      this.h[1] = this.h.pop() as T;

      let c = 1;
      let l = 2;
      let r = 3;

      while (
        this.compare(this.sh(l), this.sh(c)) ||
        this.compare(this.sh(r), this.sh(c))
      ) {
        if (this.compare(this.sh(r), this.sh(l))) {
          this.swap(r, c);
          c = r;
        } else {
          this.swap(l, c);
          c = l;
        }
        l = c * 2;
        r = l + 1;
      }
      return returnVal;
    }
  }
  return new Heap();
}
