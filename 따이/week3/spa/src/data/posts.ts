export type Post = {
  id: number;
  title: string;
  body: string;
};

export const POSTS: Post[] = [
  {
    id: 1,
    title: "SPA란 무엇인가?",
    body: "SPA는 Single Page Application의 약자로, 하나의 HTML 파일 위에서 JavaScript가 화면을 동적으로 교체하는 방식입니다.",
  },
  {
    id: 2,
    title: "react-router-dom",
    body: "react-router-dom은 React에서 클라이언트 사이드 라우팅을 구현해주는 라이브러리입니다. BrowserRouter, Routes, Route, Link 등을 제공합니다.",
  },
  {
    id: 3,
    title: "useNavigate / useParams",
    body: "useNavigate()는 JS 코드로 페이지를 이동할 때 사용하고, useParams()는 URL의 동적 파라미터(:id 등)를 꺼낼 때 사용합니다.",
  },
];
