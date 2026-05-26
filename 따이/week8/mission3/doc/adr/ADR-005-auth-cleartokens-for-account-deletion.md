# ADR-005: 회원 탈퇴는 clearTokens로 클라이언트 토큰을 즉시 제거

## 상태

채택

## 맥락

회원 탈퇴 API(`DELETE /v1/auth/me`) 성공 후 사용자를 로그아웃 상태로 만들어야 한다.

기존 `logout` 함수는 `POST /v1/auth/logout` 서버 요청을 포함한다. 탈퇴 직후에 logout API를 다시 호출하면 이미 만료된 계정으로 요청을 보내게 되어 불필요하거나 실패할 수 있다.

## 결정

`AuthContext`에 `clearTokens()` 함수를 별도로 추가한다. 이 함수는 서버 요청 없이 로컬 스토리지와 메모리의 토큰만 제거한다.

```ts
const clearTokens = () => {
  removeAccessTokenFromStorage();
  removeRefreshTokenFromStorage();
  setAccessToken(null);
  setRefreshToken(null);
};
```

탈퇴 `onSuccess`에서 `clearTokens()` → `navigate("/login")`을 호출한다.

## 결과

- 탈퇴 후 불필요한 logout API 호출 없이 클라이언트 상태를 깔끔하게 초기화
- 로그아웃(`logout`)과 탈퇴(`clearTokens`) 경로가 분리되어 역할이 명확해짐
