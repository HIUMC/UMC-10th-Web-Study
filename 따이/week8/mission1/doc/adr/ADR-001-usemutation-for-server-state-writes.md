# ADR-001: 서버 상태 변경은 useMutation으로 일원화

## 상태

채택

## 맥락

6주차 미션에서 LP 작성, 댓글 CRUD, 로그인/로그아웃, 회원 탈퇴, 프로필 수정 등 다수의 서버 쓰기 작업이 추가됐다.

기존 코드는 이벤트 핸들러 안에서 `try/catch`로 직접 API 호출을 처리하고 있었다. 이 방식은 로딩 상태를 `useState`로 따로 관리해야 하고, 에러 핸들링 로직이 컴포넌트마다 흩어지는 문제가 있었다.

## 결정

모든 서버 쓰기 작업(POST, PATCH, DELETE)은 TanStack Query의 `useMutation`으로 처리한다.

- `mutationFn`: API 호출 함수를 그대로 전달
- `onSuccess`: `queryClient.invalidateQueries`로 관련 쿼리 무효화 → 자동 리페치
- `onError`: 서버 응답의 `error.response.data.message`를 우선 사용, 없으면 fallback 문자열

```ts
const { mutate, isPending } = useMutation({
  mutationFn: (body: RequestCreateLpDto) => createLp(body),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["lps"] });
    onClose();
  },
  onError: (error: unknown) => {
    const msg =
      (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "LP 작성에 실패했습니다.";
    alert(msg);
  },
});
```

## 결과

- `isPending`으로 로딩 상태를 별도 `useState` 없이 처리 가능
- `onSuccess`/`onError` 콜백이 한 곳에 모여 있어 흐름 파악이 쉬움
- `invalidateQueries` 호출로 낙관적 업데이트 없이도 UI가 항상 서버 상태와 동기화됨
