import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-slate-200 dark:border-gray-800  transition-colors duration-300">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center text-sm text-slate-500 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} SpinningSpinning Dolimpan. All
          rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <Link
            to="#"
            className="hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="#"
            className="hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
