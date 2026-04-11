interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination = ({
  page,
  totalPages,
  onPrev,
  onNext,
}: PaginationProps) => {
  const isPrevDisabled = page === 1;
  const isNextDisabled = page === totalPages;

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={onPrev}
        disabled={isPrevDisabled}
        className={`pagination-button ${isPrevDisabled ? 'disabled' : 'enabled'}`}
      >
        {'<'}
      </button>

      <span className="pagination-text">{page}페이지</span>

      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className={`pagination-button ${isNextDisabled ? 'disabled' : 'enabled'}`}
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;