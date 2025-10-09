import React from 'react';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);


const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) {
    return null;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2.5 rounded-full transition-colors text-gray-600 bg-white shadow-sm border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon />
        <span className="sr-only">Previous</span>
      </button>

      <div className="flex items-center gap-2">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors flex items-center justify-center ${
              currentPage === number
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-700 bg-white hover:bg-indigo-50'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === pageNumbers.length}
        className="flex items-center justify-center p-2.5 rounded-full transition-colors text-gray-600 bg-white shadow-sm border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRightIcon />
        <span className="sr-only">Next</span>
      </button>
    </nav>
  );
};

export default Pagination;