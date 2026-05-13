import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function CreatePage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.user) {
      const confirmed = window.confirm('LP 생성을 위해 로그인해야 합니다. 로그인 페이지로 이동하시겠습니까?');
      if (confirmed) {
        navigate('/login', { state: { from: '/create' } });
      } else {
        navigate('/v1/lps');
      }
    }
  }, [auth.user, navigate]);

  if (!auth.user) {
    return null;
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <h1>LP 생성</h1>
        <p>현재는 생성 폼이 준비 중입니다. 나중에 추가 기능을 확장할 수 있습니다.</p>
      </div>
      <div className="info-block">
        <p>새로운 LP를 만들려면, 실제 서비스에서는 여기에 제목/이미지/본문 입력 폼이 들어갑니다.</p>
      </div>
    </section>
  );
}
