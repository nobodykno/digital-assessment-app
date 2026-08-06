import { IPaginationProps } from '../../props/file-pagination-props';
/**
 * 
 * @param pagination 
 * @returns view for pagination
 */
const Pagination = (pagination: IPaginationProps) => {

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-center gap-4"
    >
      <button
        type="button"
        disabled={pagination.pagination.page === 1}
        onClick={() => pagination.onPageChange(pagination.pagination.page - 1)}
        aria-label="Go to previous page"
        className="
          rounded-[var(--border-radius)]
          border
          border-[var(--color-border)]
          px-4
          py-2
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[var(--color-primary)]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Previous
      </button>
  
      <span
        aria-live="polite"
        aria-atomic="true"
      >
        Page {pagination.pagination.page} of {pagination.pagination.totalPages}
      </span>
  
      <button
        type="button"
        disabled={
          pagination.pagination.page === pagination.pagination.totalPages
        }
        onClick={() => pagination.onPageChange(pagination.pagination.page + 1)}
        aria-label="Go to next page"
        className="
          rounded-[var(--border-radius)]
          border
          border-[var(--color-border)]
          px-4
          py-2
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[var(--color-primary)]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;