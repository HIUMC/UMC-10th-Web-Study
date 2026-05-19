# 🎯 useQuery 핵심 옵션 실습

이 프로젝트는 **useQuery의 핵심 옵션들을 직접 구현해보며 이해**하는 실습입니다.

## 📁 프로젝트 구조

```
week6/
├── src/
│   ├── hooks/
│   │   ├── useCustomFetch.js    # 기본 Custom Hook
│   │   └── useQuery.js          # 확장된 useQuery Hook (핵심!)
│   ├── App.js                   # 예제 컴포넌트
│   └── index.js                 # 진입점
├── index.html                   # HTML 템플릿
├── vite.config.js              # Vite 설정
└── package.json                # 프로젝트 설정
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열림

## 📚 핵심 개념 설명

### 1. **queryKey** - 캐시를 식별하는 키
```javascript
useQuery({
  queryKey: ['user', userId],  // 배열로 지정
  queryFn: () => fetch(...),
})
```
- 배열 형태로 쿼리를 고유하게 식별
- `userId`가 변경되면 새로운 캐시가 필요
- `JSON.stringify`로 문자열로 변환되어 캐시 키로 사용

### 2. **staleTime** - 데이터의 신선함 유지 시간
```javascript
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetch(...),
  staleTime: 5000,  // 5초 동안은 캐시된 데이터를 신선하다고 판단
})
```

**시나리오:**
- T=0s: 데이터 fetch → 캐시에 저장
- T=3s: 다시 컴포넌트가 마운트 → 캐시 사용 (신선함), 새로 fetch 안 함
- T=6s: 다시 컴포넌트가 마운트 → 캐시는 stale → 새로 fetch

**vs cacheTime:**
- `staleTime`: "이 데이터를 다시 fetch할 필요가 있나?"
- `cacheTime`: "캐시를 메모리에서 삭제할까?"

### 3. **retry** - 실패 시 자동 재시도
```javascript
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetch(...),
  retry: 3,           // 최대 3번 재시도
  retryDelay: 1000,   // 1초 간격으로 재시도 (exponential backoff 적용)
})
```

**동작:**
1. 첫 시도: 실패
2. 1초 후 두 번째 시도: 실패
3. 2초 후 세 번째 시도: 실패
4. 4초 후 네 번째 시도: 실패
5. 에러 처리

### 4. **enabled** - 조건부 실행
```javascript
useQuery({
  queryKey: ['posts', userId],
  queryFn: () => fetch(`/posts/${userId}`),
  enabled: !!user,  // user가 존재할 때만 fetch
})
```

**사용 사례:**
- 선행 데이터가 필요한 경우 (dependent queries)
- 특정 조건에서만 API 호출이 필요한 경우

### 5. **select** - 데이터 변환 함수
```javascript
useQuery({
  queryKey: ['user', userId],
  queryFn: async () => {
    const res = await fetch(...);
    return res.json();  // { id, name, email }
  },
  select: (data) => ({
    ...data,
    displayName: `${data.name} (${data.email})`
  })
})
```

**장점:**
- API 응답을 UI 형태로 미리 변환
- 캐시에는 원본 데이터 저장, 상태에는 변환된 데이터 저장
- 메모리 효율적

## 🧪 실습 시나리오

### 시나리오 1: staleTime 효과 체감

1. **staleTime을 5000(5초)으로 설정**
2. User 1을 조회하면 데이터가 fetch됨
3. **5초 내에 User 1을 다시 조회** → 캐시 사용, fetch 안 함
4. **5초 이후에 User 1을 다시 조회** → 데이터가 stale, 새로 fetch

**콘솔에서 확인:**
```javascript
// 콘솔 탭 열기
console.log('📡 Fetching user 1...')  // 처음에만 나타남
```

### 시나리오 2: retry 효과 체감

1. **retry를 0으로 설정**
2. 네트워크를 느리거나 끊으면 → 에러 발생
3. **retry를 3으로 변경**
4. 네트워크 끊으면 → 자동으로 3번 재시도 후 에러 표시

### 시나리오 3: enabled로 종속 쿼리 만들기

위 예제에서:
```javascript
const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: async () => fetch(...),
  enabled: !!user,  // ← user가 없으면 실행 안 함
})
```

**동작:**
- User 데이터 로드 완료 → Posts 자동으로 로드
- enabled가 false면 refetch() 호출할 때까지 대기

### 시나리오 4: 캐시 무효화

```javascript
// "❌ Invalidate User Cache" 버튼 클릭
queryClient.invalidateQueries(['user', 1])
// ↓
// 해당 캐시가 stale로 표시됨
// 다음에 useQuery가 마운트될 때 새로 fetch
```

## 📖 실제 TanStack Query와 비교

### 우리 구현 vs TanStack Query

| 기능 | 우리 구현 | TanStack |
|------|---------|---------|
| 기본 캐싱 | ✅ | ✅ |
| staleTime | ✅ | ✅ |
| retry | ✅ | ✅ |
| enabled | ✅ | ✅ |
| select | ✅ | ✅ |
| 백그라운드 리페칭 | ❌ | ✅ |
| 동적 스케줄링 | ❌ | ✅ |
| 낙관적 업데이트 | ❌ | ✅ |
| 동기화 | ❌ | ✅ |
| 무한 쿼리 | ❌ | ✅ |
| Mutations | ❌ | ✅ |
| Devtools | ❌ | ✅ |

## 💡 핵심 배운 점

1. **왜 useQuery를 써야 할까?**
   - ✅ 캐싱으로 불필요한 API 호출 방지
   - ✅ 자동 재시도로 안정성 향상
   - ✅ 로딩/에러 상태 자동 관리
   - ✅ 종속 쿼리로 복잡한 흐름 단순화

2. **staleTime vs cacheTime의 차이**
   - staleTime: 데이터 신선도 판단
   - cacheTime: 메모리 정리 시점

3. **캐시 키 설계가 중요**
   - `['user', userId]` ← userId 변경 시 새로 fetch
   - `['user']` ← 모든 user 조회 시 같은 캐시

## 🔗 다음 단계

1. **TanStack Query 라이브러리 사용해보기**
   ```javascript
   import { useQuery } from '@tanstack/react-query';
   ```

2. **mutations 구현해보기** (POST, PUT, DELETE)

3. **Infinite Queries** (무한 스크롤)

4. **DevTools로 캐시 실시간 모니터링**

## 📝 주의사항

- 이 구현은 학습용입니다. 실제 프로덕션에서는 TanStack Query 사용 권장
- 글로벌 Map으로 구현했으므로 서버사이드 렌더링(SSR)에서는 주의 필요
- 고급 기능(백그라운드 리페칭, 동기화 등)은 구현되지 않음

## 🆘 트러블슈팅

### 문제: "Failed to fetch"
- CORS 에러일 가능성
- 네트워크 꺼짐
- API 엔드포인트 확인

### 문제: 데이터가 캐시되지 않음
- `staleTime` 값 확인
- `queryKey`가 동일한지 확인
- 브라우저 DevTools 콘솔 확인

### 문제: 무한 로딩
- `enabled` 옵션이 false인지 확인
- `queryFn`에서 Promise가 resolve되는지 확인

---

**Happy Coding! 🚀**
