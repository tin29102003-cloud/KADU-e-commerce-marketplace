"use client";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import Product from "@/app/components/user/product/Product";
import TitleSection from "@/app/components/user/TitleSection";
import { TypePagination } from "@/app/types/product";
import { TypeProduct } from "@/app/types/type";
import { buildPagination } from "@/app/utils/helper";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
export default function SectionAllProduct({
  productList,
  pagination,
}: {
  productList: TypeProduct[] | null;
  pagination: TypePagination;
}) {
  const router = useRouter();
  const searchParam = useSearchParams();

  const handlePagination = (p: number) => {
    const params = new URLSearchParams(searchParam.toString());
    params.set("page", String(p));
    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <section className="section--allProduct section-py">
      <div className="container">
        <div className="allProduct">
          <TitleSection title="Tất cả sản phẩm" />
          {productList ? (
            productList && productList.length > 0 ? (
              <ul className="allProduct-list grid-col4 mt-base">
                {productList
                  .filter((item) => Number(item.so_luong) > 0)
                  .map((p) => (
                    <Product product={p} />
                  ))}
              </ul>
            ) : (
              <MessageBlock
                content="Hiện tại chưa có sản phẩm"
                className="mt-base"
              />
            )
          ) : (
            <ErrorBlock desc="Đã có lỗi vui lòng thử lại sau!" />
          )}
          {/* {productList && productList.length > 0 ? (
            <ul className="allProduct-list grid-col4 mt-base">
              {productList
                .filter((item) => Number(item.so_luong) > 0)
                .map((p) => (
                  <Product product={p} />
                ))}
            </ul>
          ) : (
            <MessageBlock
              content="Hiện tại chưa có sản phẩm"
              className="mt-base"
            />
          )} */}

          {/* pagination  */}
          {pagination && Number(pagination.totalPages) > 1 && (
            <div className="flex-x-center mt-base">
              <div className="pagination flex-y-center gap-x-3 ">
                <button className="pagination__prev">
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
                      onClick={() =>
                        typeof p === "number" && handlePagination(p)
                      }
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <button className="pagination__next">
                  <IoIosArrowForward className="w-5 h-5 cursor-pointer fill-textGrayDark" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
