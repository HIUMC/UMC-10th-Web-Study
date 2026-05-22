import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem('accessToken')
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(!isLoggedIn)

  if (!isLoggedIn) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
      }}>
        {showModal && (
          <div style={{
            background: '#1a1a1a', border: '1px solid #333',
            padding: 32, borderRadius: 12, textAlign: 'center', color: '#fff'
          }}>
            <p style={{ marginBottom: 20, fontSize: 16 }}>
              로그인이 필요한 페이지입니다.
            </p>
            <button
              onClick={() => {
                setShowModal(false)
                navigate('/login', { state: { from: location }, replace: true })
              }}
              style={{
                padding: '10px 28px', borderRadius: 8,
                background: '#FF2E7E', color: '#fff',
                border: 'none', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              확인
            </button>
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}