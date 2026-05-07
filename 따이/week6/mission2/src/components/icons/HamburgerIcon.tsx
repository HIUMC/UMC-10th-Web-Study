import type { SVGProps } from "react";

const HamburgerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
      d="M7.95 11.95h32m-32 12h32m-32 12h32"
    />
  </svg>
);

export default HamburgerIcon;
