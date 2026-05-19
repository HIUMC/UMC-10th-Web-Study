# ADR-006: LP 폼 유효성 검사는 submitted 상태 기반 인라인 표시

## 상태

채택

## 맥락

LP 작성/수정 모달에서 제목, 내용, 썸네일이 필수 항목이다.

초기 구현에서 필수 항목이 비어 있으면 제출 버튼 자체를 `disabled` 처리했다. 그런데 썸네일 조건(`!thumbnail`)을 `isDisabled`에 포함하면 이미지를 선택하기 전까지 버튼이 항상 비활성화되어, 사용자가 왜 버튼을 누를 수 없는지 알 수 없는 UX 문제가 있었다.

## 결정

`submitted` boolean state를 두고, 제출 버튼 클릭 시 `true`로 설정한다. 유효성 실패 시 함수를 early return하고, 각 필드 하단에 에러 메시지를 조건부 렌더링한다.

```ts
const handleSubmit = () => {
  setSubmitted(true);
  if (!title.trim() || !content.trim() || !thumbnail) return;
  mutate({ title: title.trim(), content: content.trim(), thumbnail, published: true, tags });
};
```

버튼은 `isPending`일 때만 `disabled` 처리해 중복 제출을 막는다.

## 결과

- 사용자가 버튼을 눌러야 비로소 어떤 항목이 비어있는지 인라인으로 확인 가능
- 제출 전 버튼이 항상 활성화되어 있어 상호작용 가능하다는 신호를 줌
- 로딩 중 중복 제출 방지는 `isPending` disabled로 별도 처리
