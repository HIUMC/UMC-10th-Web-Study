# ADR-002: LP 썸네일은 Canvas 리사이즈 후 base64로 전송

## 상태

채택

## 맥락

LP 작성 모달에서 사용자가 이미지를 업로드하면 서버로 썸네일을 전달해야 한다.

두 가지 방법을 시도했다.

1. **FormData 업로드** (`POST /v1/upload`): 서버 엔드포인트가 동작하지 않아 실패.
2. **base64 직접 전송**: File을 `FileReader`로 읽어 `data:image/...` 문자열로 변환 후 `thumbnail` 필드에 포함.

base64 방식은 동작했으나, 원본 고해상도 이미지를 그대로 인코딩하면 페이로드가 수 MB에 달해 서버가 400을 반환하는 문제가 발생했다.

## 결정

파일을 읽은 후 Canvas API로 최대 600×600 이내로 리사이즈하고, JPEG quality 0.7로 재인코딩해서 전송한다.

```ts
img.onload = () => {
  const MAX = 600;
  const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const resized = canvas.toDataURL("image/jpeg", 0.7);
  setThumbnail(resized);
};
```

ratio에 `1`을 포함해 원본이 600px 이하일 때 확대하지 않도록 했다.

## 결과

- 대부분의 사진이 100KB 내외로 줄어들어 서버 400 에러 해소
- 서버 업로드 엔드포인트 없이도 동작
- 단점: base64는 바이너리 대비 약 33% 크기 증가. 서버 업로드 엔드포인트가 생기면 FormData 방식으로 교체하는 것이 낫다.
