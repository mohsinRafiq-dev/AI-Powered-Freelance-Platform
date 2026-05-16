import { ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-brand-deeper rounded mb-2"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-brand-deepest rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full text-center py-12 bg-gray-50 dark:bg-brand-deepest rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-gray-200/50 dark:border-gray-700/30 backdrop-blur-sm ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="backdrop-blur-md bg-gradient-to-r from-brand-light/60 via-brand-light/50 to-brand-light/60 dark:from-gray-800/60 dark:via-gray-800/50 dark:to-gray-800/60 border-b border-gray-300/50 dark:border-gray-700/50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`
                  px-6 py-4 text-left text-sm font-semibold 
                  text-gray-900 dark:text-white
                  ${column.headerClassName || ''}
                `}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="backdrop-blur-sm">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                border-b border-gray-200/50 dark:border-gray-700/30
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white/30 dark:bg-gray-900/30'}
                ${hoverable ? 'hover:bg-brand-light/40 dark:hover:bg-gray-700/40 transition-all duration-200 hover:shadow-sm' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`
                    px-6 py-4 text-sm text-gray-700 dark:text-gray-300
                    ${column.cellClassName || ''}
                  `}
                >
                  {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  className = '',
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/30 rounded-b-xl ${className}`}>
      {/* Info */}
      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
        Showing <span className="font-semibold text-brand dark:text-brand-light">{startItem}</span> to{' '}
        <span className="font-semibold text-brand dark:text-brand-light">{endItem}</span> of{' '}
        <span className="font-semibold text-brand dark:text-brand-light">{totalItems}</span> results
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg backdrop-blur-sm bg-white/50 border border-gray-300/50 
            dark:bg-gray-800/50 dark:border-gray-700/50
            transition-all duration-200
            ${currentPage === 1 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-brand-light/60 dark:hover:bg-gray-700/60 hover:shadow-md hover:scale-105'
            }
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Show first, last, current, and neighbors
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm
                    transition-all duration-200
                    ${pageNumber === currentPage
                      ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-md scale-105'
                      : 'bg-white/50 text-gray-700 hover:bg-brand-light/60 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/60 hover:scale-105'
                    }
                  `}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg backdrop-blur-sm bg-white/50 border border-gray-300/50 
            dark:bg-gray-800/50 dark:border-gray-700/50
            transition-all duration-200
            ${currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-brand-light/60 dark:hover:bg-gray-700/60 hover:shadow-md hover:scale-105'
            }
          `}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default Table;
