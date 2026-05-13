import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = { isOpen: boolean; onClose: () => void }

export default function Sidebar({ isOpen, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

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

  return (
    <>
      {/* 모바일 오버레이 — 사이드바 뒤 어두운 배경 */}
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

        {/* 하단 탈퇴하기 */}
        <button
          onClick={() => handleNavigate('/mypage')}
          className="px-3 py-3 text-[#666] hover:text-white text-sm text-left transition-colors"
        >
          탈퇴하기
        </button>
      </div>
    </>
  )
}