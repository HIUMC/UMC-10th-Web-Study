interface PageIndicatorProps {
  page: number;
  onClick: (i: number) => void;
}

export const PageIndicator = ({ page, onClick }: PageIndicatorProps) => {
  return (
    <>
      {" "}
      <button
        className="bg-[#b7dce5] text-white px-6 py-3 rounded-lg  shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer disabled:cursor-not-allowed
          "
        disabled={page === 1}
        onClick={() => onClick(-1)}
      >{`<`}</button>
      <span>{page} 페이지</span>
      <button
        className="bg-[#b7dce5] text-white px-6 py-3 rounded-lg  shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer"
        onClick={() => onClick(1)}
      >{`>`}</button>
    </>
  );
};
