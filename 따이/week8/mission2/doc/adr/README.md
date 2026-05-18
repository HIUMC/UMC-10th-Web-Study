# Architecture Decision Records

6주차 미션(LP CRUD, 댓글 CRUD, 마이페이지, 인증) 구현 과정에서 내린 주요 결정을 기록한다.

| 번호 | 제목 | 상태 |
|------|------|------|
| [ADR-001](./ADR-001-usemutation-for-server-state-writes.md) | 서버 상태 변경은 useMutation으로 일원화 | 채택 |
| [ADR-002](./ADR-002-base64-thumbnail-with-canvas-resize.md) | LP 썸네일은 Canvas 리사이즈 후 base64로 전송 | 채택 |
| [ADR-003](./ADR-003-comment-ownership-via-usegetmyinfo.md) | 댓글 소유 여부는 useGetMyInfo로 클라이언트에서 판별 | 채택 |
| [ADR-004](./ADR-004-comment-order-cache-invalidation.md) | 댓글 정렬 전환 시 removeQueries로 캐시 초기화 | 채택 |
| [ADR-005](./ADR-005-auth-cleartokens-for-account-deletion.md) | 회원 탈퇴는 clearTokens로 클라이언트 토큰을 즉시 제거 | 채택 |
| [ADR-006](./ADR-006-lp-form-validation-via-submitted-state.md) | LP 폼 유효성 검사는 submitted 상태 기반 인라인 표시 | 채택 |
