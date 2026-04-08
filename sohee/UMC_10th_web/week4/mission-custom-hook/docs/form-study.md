# react-hook-form 학습 내용 정리

- `useForm`은 `register`, `handleSubmit`, `watch`, `trigger`, `formState`를 통해 입력값 등록, 제출 처리, 값 구독, 수동 검증, 에러 상태 관리를 한 번에 묶어준다.
- `formState`의 `errors`, `isValid`, `isSubmitting`, `touchedFields`를 활용하면 버튼 활성화, 에러 메시지 노출, 제출 중 UI 제어를 비교적 적은 코드로 구현할 수 있다.
- `mode: 'onChange'`를 사용하면 입력값이 바뀔 때마다 유효성 검사가 다시 실행되어 다단계 폼의 "다음" 버튼 활성화 조건을 자연스럽게 제어할 수 있다.
- `trigger`는 특정 필드만 골라 검증할 수 있어서 단계별 폼 전환에 잘 맞는다. 이번 구현에서는 이메일 단계, 비밀번호 단계에서 필요한 필드만 검사했다.
- `@hookform/resolvers/zod`를 사용하면 Zod 스키마를 그대로 `resolver`로 연결할 수 있어 폼 상태 관리와 스키마 검증을 분리하면서도 함께 동작하게 만들 수 있다.

공식 문서:
- https://react-hook-form.com/

# Zod 학습 내용 정리

- Zod는 TypeScript 친화적인 스키마 검증 라이브러리로, 스키마 정의와 타입 추론을 한 번에 가져갈 수 있다.
- `z.object`, `z.string`, `min`, `max` 같은 조합으로 입력 제약 조건을 선언적으로 작성할 수 있다.
- `refine`를 사용하면 "비밀번호와 비밀번호 확인 일치" 같은 필드 간 검증 규칙도 스키마 안에서 함께 표현할 수 있다.
- `safeParse`는 예외를 던지지 않고 성공 여부를 반환하므로 버튼 활성화 여부처럼 즉시 판별이 필요한 UI 로직에 잘 어울린다.
- 폼 전체 스키마 외에도 이메일 단계, 비밀번호 단계처럼 목적별로 작은 스키마를 분리해 두면 다단계 폼 검증에 재사용하기 좋다.

공식 문서:
- https://zod.dev/
