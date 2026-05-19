# ADR-004: 댓글 정렬 전환 시 removeQueries로 캐시 초기화

## 상태

채택

## 맥락

댓글 목록은 `order` 파라미터(`asc` / `desc`)를 포함한 쿼리 키로 캐싱된다.

```ts
// lpCommentsQueryKey
["lpComments", lpid, order, cursor, limit]
```

`useInfiniteQuery`는 order별로 별개의 캐시를 유지한다. 사용자가 "최신순 → 오래된순"으로 전환할 때 이전 order의 캐시가 남아 있어도 문제가 없지만, 실제로는 **새 order에 해당하는 캐시가 없거나 비어있어 아무것도 렌더링되지 않는 증상**이 발생했다.

원인: `order` state가 바뀌어 새 쿼리 키가 만들어지지만, `useInfiniteQuery`의 초기 fetch가 예상대로 트리거되지 않아 `data`가 `undefined`인 상태로 머무는 케이스.

## 결정

정렬 버튼 클릭 시 `queryClient.removeQueries`로 해당 LP의 모든 댓글 캐시(`["lpComments", lpid]` prefix)를 제거한 뒤 `setOrder`를 호출한다.

```ts
const handleOrderChange = (newOrder: CommentOrder) => {
  queryClient.removeQueries({ queryKey: ["lpComments", lpid] });
  setOrder(newOrder);
};
```

`invalidateQueries` 대신 `removeQueries`를 선택한 이유: `invalidate`는 캐시를 stale 처리할 뿐 즉시 제거하지 않아, 전환 직후 stale 데이터가 잠깐 보일 수 있다. `remove`는 캐시 엔트리 자체를 삭제하므로 다음 렌더에서 반드시 새로 fetch한다.

## 결과

- 정렬 전환 시 항상 서버에서 새 데이터를 받아와 올바른 순서로 표시됨
- 전환 중 스켈레톤 UI가 정상 노출됨 (`isPending: true` 상태 경유)
