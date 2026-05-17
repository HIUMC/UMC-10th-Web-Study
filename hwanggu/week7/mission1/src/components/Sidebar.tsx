import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAccount } from '../apis/auth'

type Props = { isOpen: boolean; onClose: () => void }

export default function Sidebar({ isOpen, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }

  // ✅ 탈퇴 mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear()
      navigate('/login', { replace: true })
    },
    onError: () => alert('탈퇴 처리에 실패했습니다.'),
  })

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}

      {/* 사이드바 본체 */}
      <div
        ref={ref}
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-55 bg-[#111] z-30
          flex flex-col justify-between py-6 px-4
          transition-transform duration-300
          md:static md:translate-x-0 md:flex md:z-auto md:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* 메뉴 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleNavigate('/lps')}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-[#222] transition-colors text-left"
          >
            <span>🔍</span>
            <span className="text-sm">찾기</span>
          </button>
          <button
            onClick={() => handleNavigate('/mypage')}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-[#222] transition-colors text-left"
          >
            <span>👤</span>
            <span className="text-sm">마이페이지</span>
          </button>
        </div>

        {/* ✅ 탈퇴하기 - 빨간 글씨, 클릭 시 모달 */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-3 py-3 text-[#FF2E7E] hover:text-red-400 text-sm text-left transition-colors"
        >
          탈퇴하기
        </button>
      </div>

      {/* ✅ 탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#1a1a1a', borderRadius: 16, padding: '2rem',
              width: '100%', maxWidth: 340, textAlign: 'center',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', margin: 0 }}>
              정말 탈퇴하시겠어요?
            </h2>
            <p style={{ color: '#aaa', fontSize: 14, margin: 0 }}>
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  background: '#333', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 15,
                }}
              >
                아니오
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  deleteMutation.mutate()
                }}
                disabled={deleteMutation.isPending}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  background: '#FF2E7E', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: 15,
                }}
              >
                {deleteMutation.isPending ? '처리 중...' : '예'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}