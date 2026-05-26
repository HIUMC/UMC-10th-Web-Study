# ADR-003: 댓글 소유 여부는 useGetMyInfo로 클라이언트에서 판별

## 상태

채택

## 맥락

댓글 수정/삭제 버튼은 해당 댓글의 작성자에게만 보여야 한다. 서버는 `LpComment.authorId`를 내려주지만, 현재 로그인한 유저의 id를 따로 가져와야 비교할 수 있다.

## 결정

`CommentItem`에서 `useGetMyInfo()`를 호출해 `myInfo.data.id === comment.authorId`로 소유 여부를 판별한다.

```ts
const { data: myInfo } = useGetMyInfo();
const isOwner = myInfo?.data.id === comment.authorId;
```

`useGetMyInfo`는 이미 `staleTime`이 설정된 캐싱 훅이므로, 댓글 목록에 여러 `CommentItem`이 있어도 실제 네트워크 요청은 한 번만 발생한다.

## 결과

- 서버에 별도 권한 확인 API 없이 UI 레벨 소유 판별 가능
- 같은 패턴이 `LpDetailPage`의 LP 수정/삭제 버튼에도 동일하게 적용됨
- 클라이언트 판별이므로 실제 권한은 서버가 최종 검증 (삭제/수정 API 호출 시 403 반환)
