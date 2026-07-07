

"use client"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  if (totalItems === 0) return null;

 const getVisiblePages = () => {
  // ✅ If only one page, return just one
  if (totalPages <= 1) return [1];

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 640;

  const delta = isMobile ? 0 : 1;
  const range: number[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  const pages: (number | string)[] = [1];

  if (currentPage - delta > 2) {
    pages.push("...");
  }

  pages.push(...range);

  if (currentPage + delta < totalPages - 1) {
    pages.push("...");
  }

  // ✅ Only push last page if it is not already 1
  if (totalPages !== 1) {
    pages.push(totalPages);
  }

  return pages;
};

 
let availableLimits = [];

if (totalItems > 100) {
  availableLimits = [10, 25, 50, 100, 500];
} else {
  availableLimits = [10, 25, 50, 100];
}

// Agar totalItems 10 se bhi kam hai
if (availableLimits.length === 0 && totalItems > 0) {
  availableLimits.push(totalItems);
}
  const visiblePages = getVisiblePages();
  const handleJump = () => {
  if (inputPage < 1 || inputPage > totalPages) {
    toast.error(`Please enter a page between 1 and ${totalPages}`);
    return;
  }

  onPageChange(inputPage);
};

  return (
    <div className="w-full flex flex-col gap-6 py-8 px-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
      
      {/* Top Row: Info & Limit Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-50 dark:border-gray-800 pb-4">
        <div className="flex flex-col items-center sm:items-start">
         
          <p className="text-gray-500">
            Showing <span className="text-red-600 dark:text-red-400">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-red-600 dark:text-red-400">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of {totalItems} entries
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700">
          <span className=" text-gray-400 ml-2">LIMIT</span>
          {availableLimits.map((num) => (
            <button
              key={num}
              onClick={() => onLimitChange(num)}
              className={`px-4 py-1.5 rounded-xl  transition-all ${
                itemsPerPage === num 
                ? "bg-red-500 text-white shadow-lg shadow-red-200" 
                : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row: Controls */}
      <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4">
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="group flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-red-500 transition-all disabled:opacity-30 disabled:hover:border-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Numbers */}
          <div className="flex items-center gap-2 px-2">
            {visiblePages.map((page, idx) => (
              page === "..." ? (
                <span key={`dots-${idx}`} className="text-gray-300 ">···</span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(Number(page))}
                  className={`w-15 h-15 rounded-2xl  transition-all duration-300 ${
                    page === currentPage
                      ? "bg-red-500 text-black shadow-xl shadow-red-300 scale-110 rotate-1"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="group flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-red-500 transition-all disabled:opacity-30 disabled:hover:border-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Quick Jump Input */}
        <div className="hidden sm:flex items-center gap-3 bg-red-50 dark:bg-red-900/10 p-2 rounded-2xl border border-red-100 dark:border-red-900/30">
          <span className=" text-red-600 uppercase ml-2">Jump to</span>
          <input
            type="number"
            value={inputPage}

            onChange={(e) => setInputPage(Number(e.target.value))}
         onKeyDown={(e) => e.key === "Enter" && handleJump()}
            className="w-15 h-12 text-center  rounded-xl bg-white dark:bg-gray-800 border-none ring-2 ring-red-200 focus:ring-red-500 focus:outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};
