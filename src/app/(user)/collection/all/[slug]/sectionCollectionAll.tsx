"use client";
import Link from "next/link";
import clsx from "clsx";

// icons
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { CiFilter } from "react-icons/ci";

// types
import type { TypeProduct } from "@/app/types/type";

// components

import Product from "@/app/components/user/product/Product";
import PriceSlider from "@/app/components/user/SliderRange";
import BlockAside from "./blockAside";
// services
import productServices from "@/app/services/productServices";
import { Placeholder } from "react-select/animated";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import productServicesServer from "@/app/services/productServices-server";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import { TypeCartItem } from "@/app/types/cart";
import { TypeCategoriesAll } from "@/app/types/category";
import { TypePagination, TypeTrademark } from "@/app/types/product";
import FilterBar from "./filterBar";
import { buildPagination } from "@/app/utils/helper";
import { useFilter } from "@/app/hook/useFilter";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationPage from "@/app/components/user/PaginationPage";

export default function SectionCollectionAll({
  categoryList,
  slug,
  trademarkList,
  productFilterList,
  pagination,
  currentDmId,
}: {
  categoryList: {
    parent: {
      id: number;
      ten_dm: string;
      slug: string;
    };
    children: [TypeCategoriesAll];
  };
  slug: string;
  trademarkList: TypeTrademark[] | null;
  productFilterList: TypeProduct[];
  pagination: TypePagination;
  currentDmId: number;
}) {
  const searchParam = useSearchParams();
  const { pushFilters } = useFilter();
  // const handlePagination = (p: number) => {
  //   pushFilters({ page: p });
  // };

  // const handleNextPagination = () => {
  //   const { currentPage, totalPages } = pagination;
  //   if (!currentPage || currentPage >= totalPages) return;
  //   pushFilters({ page: Number(currentPage) + 1 });
  // };
  // const handlePrevPagination = () => {
  //   const { currentPage } = pagination;
  //   if (!currentPage || currentPage <= 1) return;
  //   pushFilters({ page: Number(currentPage) - 1 });
  // };
  console.log(productFilterList);
  return (
    <section className="section--collectionAll section-py">
      <div className="container">
        <div className="collection row">
          {/* left */}
          <BlockAside
            categoryList={categoryList}
            slug={slug}
            trademarkList={trademarkList}
            currentDmId={currentDmId}
          />
          {/* right */}
          <div className="block--collection col-9">
            {/* list product  */}
            <FilterBar />
            {productFilterList ? (
              productFilterList.length > 0 && (
                <div className="list--collectionPrd grid-col4 mt-base">
                  {productFilterList.map((p) => (
                    <Product key={p.id} product={p} />
                  ))}
                </div>
              )
            ) : (
              <ErrorBlock desc="Đã có lỗi xảy ra vui lòng thử lại!" />
            )}
            <PaginationPage pagination={pagination} />
            {/* {pagination && Number(pagination.totalPages) > 1 && (
              <div className="flex-x-center mt-base">
                <div className="pagination flex-y-center gap-x-3 ">
                  <button
                    className="pagination__prev"
                    onClick={handlePrevPagination}
                  >
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
                  <button
                    className="pagination__next"
                    onClick={handleNextPagination}
                  >
                    <IoIosArrowForward className="w-5 h-5 cursor-pointer fill-textGrayDark" />
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
}
