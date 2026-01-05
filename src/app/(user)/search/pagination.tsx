"use client";
import { useFilter } from "@/app/hook/useFilter";
import { TypePagination } from "@/app/types/product";
import { buildPagination } from "@/app/utils/helper";
import clsx from "clsx";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function Pagination({
  pagination,
}: {
  pagination: TypePagination;
}) {
  const { pushFilters } = useFilter();
  const handlePagination = (p: number) => {
    pushFilters({ page: p });
  };

  const handleNextPagination = () => {
    const { currentPage, totalPages } = pagination;
    if (!currentPage || currentPage >= totalPages) return;
    pushFilters({ page: Number(currentPage) + 1 });
  };
  const handlePrevPagination = () => {
    const { currentPage } = pagination;
    if (!currentPage || currentPage <= 1) return;
    pushFilters({ page: Number(currentPage) - 1 });
  };

  return (
    pagination &&
    Number(pagination.totalPages) > 1 && (
      <div className="flex-x-center mt-base">
        <div className="pagination flex-y-center gap-x-3 ">
          <button className="pagination__prev" onClick={handlePrevPagination}>
            <IoIosArrowBack className="w-5 h-5 cursor-pointer fill-textGrayDark" />
          </button>
          <ul className="pagination--list flex-y-center gap-x-1">
            {buildPagination(
              Number(pagination.currentPage),
              Number(pagination.totalPages)
            ).map((p, idx) => (
              <li
                key={idx}
                className={clsx(
                  "item flex-center w-10 h-10 rounded-[4px] text-sm font-medium select-none border-[1.5px] cursor-pointer",
                  {
                    active: p === Number(pagination.currentPage),
                    "pointer-events-none": p === "...",
                  }
                )}
                onClick={() => handlePagination(Number(p))}
              >
                {p}
              </li>
            ))}
          </ul>
          <button className="pagination__next" onClick={handleNextPagination}>
            <IoIosArrowForward className="w-5 h-5 cursor-pointer fill-textGrayDark" />
          </button>
        </div>
      </div>
    )
  );
}
