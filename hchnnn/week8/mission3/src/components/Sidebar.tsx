interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 w-64 bg-white p-6 shadow-xl dark:bg-gray-900 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-4 mt-16">
          <a href="#" className="text-gray-700 dark:text-gray-200 font-medium hover:text-pink-500">
            홈
          </a>
          <a href="#" className="text-gray-700 dark:text-gray-200 font-medium hover:text-pink-500">
            찾기
          </a>
          <a href="#" className="text-gray-700 dark:text-gray-200 font-medium hover:text-pink-500">
            마이페이지
          </a>
        </nav>
      </aside>
    </>
  );
};