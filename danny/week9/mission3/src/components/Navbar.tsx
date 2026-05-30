import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
  const { amount } = useCartStore();

  return (
    <nav className="bg-[#1e232d] text-white py-4 px-6 lg:px-20">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold tracking-wide">YEOP'S MUSIC</h1>
        <div className="relative flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span className="text-lg font-bold">{amount}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
