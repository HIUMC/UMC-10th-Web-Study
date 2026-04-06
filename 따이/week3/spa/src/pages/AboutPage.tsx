export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">소개</h1>
      <p className="text-gray-600 mb-4">
        이 프로젝트는 <strong className="text-gray-900">react-router-dom v6</strong>을 사용한 SPA 예시입니다.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-600">
        <li><code className="bg-gray-100 px-1 rounded text-sm">BrowserRouter</code> — HTML5 History API 기반 라우터</li>
        <li><code className="bg-gray-100 px-1 rounded text-sm">Routes / Route</code> — 경로별 컴포넌트 매핑</li>
        <li><code className="bg-gray-100 px-1 rounded text-sm">Link / NavLink</code> — 페이지 새로고침 없는 이동</li>
        <li><code className="bg-gray-100 px-1 rounded text-sm">useNavigate</code> — JS 코드로 페이지 이동</li>
        <li><code className="bg-gray-100 px-1 rounded text-sm">useParams</code> — URL 파라미터 읽기</li>
      </ul>
    </div>
  );
}
