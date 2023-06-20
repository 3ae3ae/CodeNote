/**
 * 큐
 */
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

/**
 * 최소, 최대힙을 만들어주는 함수
 * @param minMax
 * @param search 정렬기준함수. sort함수와 같은 양식.
 * @returns
 */
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

/**
 * bfs, dfs용 Visited 클래스
 */
class Visited {
  visited: Map<number, Map<number, number>>;
  constructor(y?: number, x?: number) {
    if (y !== undefined && x !== undefined)
      this.visited = new Map([[y, new Map([[x, 1]])]]);
    else this.visited = new Map();
  }

  push(y: number, x: number) {
    if (this.visited.has(y)) this.visited.get(y)?.set(x, 1);
    else this.visited.set(y, new Map([[x, 1]]));
  }

  has(y: number, x: number) {
    if (this.visited.get(y)?.has(x)) return true;
    else return false;
  }

  area() {
    return [...this.visited.values()].reduce((a, c) => a + c.size, 0);
  }

  entries() {
    return [...this.visited.keys()].flatMap((y) =>
      [...this.visited.get(y)!.keys()].map((x) => [y, x])
    );
  }
}

/**
 * 행렬 관련 함수 제공 클래스
 */
class Matrix {
  static matrix: bigint[][];

  /**
   * number[][] 리스트를 매트릭스 타입으로 변환해줌
   */
  makeMatrix(l: number[][]): typeof Matrix.matrix {
    if (l.some((ll) => ll.length !== l[0].length))
      throw new Error(`Can't make matrix`);
    return l.map((ll) => ll.map((lll) => BigInt(lll)));
  }
  /**
   * 행렬곱 함수
   */
  multiMatrix(
    mat1: typeof Matrix.matrix,
    mat2: typeof Matrix.matrix
  ): typeof Matrix.matrix {
    if (mat1[0].length !== mat2.length) throw new Error("행렬곱 불가");
    return Array.from({ length: mat1.length }, (_, y) =>
      new Array(mat2[0].length)
        .fill(0)
        .map((__, x) =>
          mat1[y].reduce((a, c, i) => a + c * mat2[i][x], BigInt(0))
        )
    );
  }
  /**
   * 행렬 제곱 함수
   */
  powMatrix(mat: typeof Matrix.matrix): typeof Matrix.matrix {
    return this.multiMatrix(mat, mat);
  }
  /**
   * 빠른 행렬 제곱 함수
   * @param mat 행렬을
   * @param n 번 제곱
   */
  fastPowMatrix(mat: typeof Matrix.matrix, n: bigint): typeof Matrix.matrix {
    const bin = n.toString(2);
    const pows = new Array(bin.length).fill(0);

    pows.forEach((x, i, pows) =>
      i === 0 ? (pows[i] = mat) : (pows[i] = this.powMatrix(pows[i - 1]))
    );
    const unit: typeof Matrix.matrix = Array.from({ length: mat.length }, () =>
      new Array(mat.length).fill(BigInt(0))
    );

    for (let i = 0; i < unit.length; i++) unit[i][i] = BigInt(1);

    return [...bin]
      .reverse()
      .reduce(
        (a, c, i) => (c === "1" ? this.multiMatrix(a, pows[i]) : a),
        unit
      );
  }
}

/**
 * 숫자 제곱 함수
 * @param num 밑
 * @param n 지수
 * @returns num**n
 */
function fastPow(num: number, n: number): number {
  const bin = n.toString(2);
  const pows = [num];
  for (let i=1; i<bin.length; i++) pows[i] = pows[i-1]**2;
  return [...bin]
    .reverse()
    .reduce((a, c, i) => (c === "1" ? a * pows[i] : a), 1);
}

/**
 * 피보나치 구하는 함수
 * @param input 번쨰 피보나치 수
 * @param mod 나누는 몫
 */
function getFibo(input: string, mod: number): number {
  const biSame = (a: bigint, b: bigint) => a.toString() === b.toString();
  const Input = BigInt(input);
  if (biSame(Input, BigInt(0))) return 0;
  type matrix = bigint[][];

  function multiMatrix(mat1: matrix, mat2: matrix): matrix {
    if (mat1[0].length !== mat2.length) throw new Error("행렬곱 불가");
    return Array.from({ length: mat1.length }, (_, y) =>
      new Array(mat2[0].length)
        .fill(0)
        .map(
          (__, x) =>
            mat1[y].reduce((a, c, i) => a + c * mat2[i][x], BigInt(0)) %
            BigInt(mod)
        )
    );
  }
  function powMatrix(mat: matrix): matrix {
    return multiMatrix(mat, mat);
  }
  function fastPowMatrix(mat: matrix, n: bigint): matrix {
    const bin = n.toString(2);
    const pows = new Array(bin.length).fill(0);

    pows.forEach((x, i, pows) =>
      i === 0 ? (pows[i] = mat) : (pows[i] = powMatrix(pows[i - 1]))
    );
    const unit: matrix = Array.from({ length: mat.length }, () =>
      new Array(mat.length).fill(BigInt(0))
    );

    for (let i = 0; i < unit.length; i++) unit[i][i] = BigInt(1);

    return [...bin]
      .reverse()
      .reduce((a, c, i) => (c === "1" ? multiMatrix(a, pows[i]) : a), unit);
  }
  function getFi(n: bigint): number {
    const mat1 = [
      [BigInt(1), BigInt(1)],
      [BigInt(1), BigInt(0)],
    ];

    const temp = fastPowMatrix(mat1, n);
    return Number(temp[0][1]);
  }

  return getFi(Input) % mod;
}
