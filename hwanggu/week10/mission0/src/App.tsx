import { memo, useCallback, useMemo, useRef, useState } from "react";
import "./App.css";

// ════════════════════════════════════════
// 렌더 횟수를 세서 보여주는 작은 훅
// (컴포넌트가 리렌더링될 때마다 1씩 증가)
// ※ StrictMode 때문에 개발 모드에선 2씩 늘어납니다.
// ════════════════════════════════════════
function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}

// ════════════════════════════════════════
// memo로 감싼 자식 컴포넌트
//  - props(onClick 함수)의 "참조"가 바뀌면 리렌더링
//  - 참조가 같으면 부모가 리렌더링돼도 스킵
// ════════════════════════════════════════
interface ChildProps {
  label: string;
  onClick: () => void;
}

const Child = memo(function Child({ label, onClick }: ChildProps) {
  const renders = useRenderCount();
  console.log(`[${label}] 렌더링됨`);
  return (
    <div className="card">
      <h2>{label}</h2>
      <p className="sub">
        렌더링 횟수: <b className="count">{renders}</b>
      </p>
      <button onClick={onClick}>자식 버튼</button>
    </div>
  );
});

// ════════════════════════════════════════
// 에라토스테네스의 체 — 일부러 무거운 계산
//  - limit 이하의 소수 개수를 구한다.
// ════════════════════════════════════════
function countPrimes(limit: number): number {
  const isComposite = new Uint8Array(limit + 1);
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    if (!isComposite[i]) {
      count++;
      for (let j = i * i; j <= limit; j += i) isComposite[j] = 1;
    }
  }
  return count;
}

const LIMITS = [1_000_000, 5_000_000, 10_000_000];

// ════════════════════════════════════════
// useMemo 데모
//  - limit이 바뀔 때만 무거운 계산을 다시 한다.
//  - "관련 없는 리렌더(tick)"에는 캐시된 값을 그대로 쓴다.
// ════════════════════════════════════════
function SieveDemo() {
  const [limit, setLimit] = useState(LIMITS[0]);
  const [tick, setTick] = useState(0);

  // 실제로 "무거운 계산"을 몇 번 돌렸는지 세는 카운터
  const noMemoRuns = useRef(0);
  const memoRuns = useRef(0);

  // ❌ useMemo 없음 → 어떤 이유로든 리렌더되면 매번 다시 계산
  const t1 = performance.now();
  const noMemoCount = countPrimes(limit);
  const noMemoTime = (performance.now() - t1).toFixed(1);
  noMemoRuns.current += 1;

  // ✅ useMemo 사용 → limit이 바뀔 때만 계산, tick 변경엔 캐시 재사용
  const memo = useMemo(() => {
    console.log("✅ useMemo 재계산! limit =", limit);
    memoRuns.current += 1;
    const s = performance.now();
    const count = countPrimes(limit);
    return { count, time: (performance.now() - s).toFixed(1) };
  }, [limit]);

  return (
    <>
      <div className="card company control">
        <h2>소수 개수 (≤ {limit.toLocaleString()})</h2>
        <p className="sub">
          한계값(limit)을 바꾸면 무거운 계산이 필요합니다. "관련 없는 리렌더"는
          계산 결과와 무관한 상태만 바꿉니다.
        </p>
        <div className="btn-group">
          {LIMITS.map((v) => (
            <button
              key={v}
              className={v === limit ? "active" : ""}
              onClick={() => setLimit(v)}
            >
              limit = {v.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="btn-group">
          <button onClick={() => setTick((p) => p + 1)}>
            관련 없는 리렌더 (tick: {tick})
          </button>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <h2>❌ useMemo 없음</h2>
          <p className="sub">
            소수 개수: <b>{noMemoCount.toLocaleString()}</b>
          </p>
          <p className="sub">
            이번 렌더 계산 시간: <b className="count">{noMemoTime}ms</b>
          </p>
          <p className="sub">
            누적 계산 횟수: <b className="count bad">{noMemoRuns.current}</b>
          </p>
        </div>
        <div className="card">
          <h2>✅ useMemo 사용</h2>
          <p className="sub">
            소수 개수: <b>{memo.count.toLocaleString()}</b>
          </p>
          <p className="sub">
            마지막 계산 시간: <b className="count">{memo.time}ms</b>
          </p>
          <p className="sub">
            누적 계산 횟수: <b className="count">{memoRuns.current}</b>
          </p>
        </div>
      </div>

      <p className="hint">
        "관련 없는 리렌더 (tick)" 버튼을 눌러보세요. 왼쪽은 <b>누적 계산 횟수가
        계속 증가</b>(매번 재계산)하지만, 오른쪽은 <b>limit이 바뀔 때만</b> 증가하고
        tick에는 멈춰 있습니다. 콘솔의 "✅ useMemo 재계산!" 로그도 tick엔 안 찍혀요.
        <br />
        <span className="muted">
          ※ memo는 "컴포넌트"를, useMemo는 "값(계산 결과)"을 메모이제이션합니다.
          개발 모드(StrictMode)에선 계산이 2번 호출됩니다.
        </span>
      </p>
    </>
  );
}

// ════════════════════════════════════════
// App
//  - count를 올리면 App이 리렌더링됨
//  - 그때 두 자식이 어떻게 반응하는지 비교
// ════════════════════════════════════════
export default function App() {
  const [count, setCount] = useState(0);

  // ❌ useCallback 없음 → App이 리렌더될 때마다 "새 함수"가 생성됨
  //    → memo(Child)가 props 바뀐 걸로 판단 → 매번 리렌더링
  const handleWithout = () => {
    console.log("without 클릭");
  };

  // ✅ useCallback 사용 → 의존성([])이 안 바뀌므로 "같은 함수"를 재사용
  //    → memo(Child)가 props 동일로 판단 → 리렌더링 스킵
  const handleWith = useCallback(() => {
    console.log("with 클릭");
  }, []);

  return (
    <main>
      <section className="section">
        <h1 className="section-title">useCallback &amp; memo</h1>
        <div className="card company control">
          <h2>부모(App) 카운터: {count}</h2>
          <p className="sub">
            아래 버튼을 누르면 App이 리렌더링됩니다. 그때 두 자식의 렌더링 횟수를
            비교해보세요.
          </p>
          <button onClick={() => setCount((prev) => prev + 1)}>
            부모 리렌더링 (+1)
          </button>
        </div>

        <div className="row">
          <Child label="❌ useCallback 없음" onClick={handleWithout} />
          <Child label="✅ useCallback 사용" onClick={handleWith} />
        </div>

        <p className="hint">
          왼쪽은 매번 새 함수가 내려가서 <b>memo가 무력화</b> → 부모와 함께 계속
          리렌더링됩니다. 오른쪽은 함수 참조가 고정되어 <b>리렌더링이 스킵</b>되어
          첫 렌더 이후 숫자가 멈춥니다.
          <br />
          <span className="muted">
            ※ 개발 모드(StrictMode)에선 렌더 횟수가 2씩 증가합니다. 비교만 보세요.
          </span>
        </p>
      </section>

      <section className="section">
        <h1 className="section-title">useMemo — 에라토스테네스의 체</h1>
        <SieveDemo />
      </section>
    </main>
  );
}
