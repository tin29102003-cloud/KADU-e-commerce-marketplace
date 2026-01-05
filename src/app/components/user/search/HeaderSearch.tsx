"use client";
import productServices from "@/app/services/productServices";
import { ApiError, TypeProduct } from "@/app/types/type";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { CiSearch } from "react-icons/ci";
import ImgLazy from "../../shared/Imglazy";
import { formatMoney } from "@/app/utils/helper";
import Spinner from "../../shared/Spinner";
import BtnPrimary from "../button/BtnPrimary";

// interface
export default function HeaderSearch() {
  const router = useRouter();
  const pathName = usePathname();
  const [keyword, setKeyword] = useState<string>("");
  const [dataSearch, setDataSearch] = useState<TypeProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const key = keyword.trim();
    if (!key) {
      setDataSearch([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const debounce = setTimeout(() => {
      // handle Search
      (async () => {
        try {
          const res = await productServices.searchProductHeader(keyword);
          if (!res.success) return;
          setDataSearch(res.data.result.data);
        } catch (err) {
          const error = err as ApiError;
          console.log(error.message);
        } finally {
          setLoading(false);
        }
      })();
    }, 500);

    return () => clearTimeout(debounce);
  }, [keyword]);

  const handleSearchNextPage = () => {
    if (!keyword.trim()) return;
    router.push(`/search?query=${keyword}`);
  };

  // reset search khi next page
  useEffect(() => {
    setLoading(false);
    setDataSearch([]);
    setKeyword("");
  }, [pathName]);

  const showDropdown = keyword.trim() !== "" || loading;
  return (
    <>
      <div className="w-full relative">
        <input
          type="text"
          className="w-full text-sm h-[var(--sizeInpSearchHeader)] rounded-full border border-[#A0D1E6] outline-none p-[0_calc(var(--sizeInpSearchHeader)-var(--spaceBtnSearchHeader)+12px)_0_16px]"
          placeholder="Tìm kiếm..."
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchNextPage();
          }}
          value={keyword}
        />
        <button
          className="absolute w-[calc(var(--sizeInpSearchHeader)-(var(--spaceBtnSearchHeader)*2))] h-[calc(var(--sizeInpSearchHeader)-(var(--spaceBtnSearchHeader)*2))] right-[var(--spaceBtnSearchHeader)] top-[var(--spaceBtnSearchHeader)] flex items-center justify-center bg-accentColor rounded-full"
          onClick={handleSearchNextPage}
        >
          <CiSearch className="w-5 h-5 stroke-[1.1px] stroke-white" />
        </button>
      </div>

      {/* dropdown  */}
      {showDropdown && (
        <div className="search--result absolute top-full left-0 w-full p-6 rounded-md bg-white z-10 shadow-[1.5px_1.5px_4px] shadow-black/20">
          {loading && (
            <div className="wrap--spinner flex-center p-2">
              <Spinner />
            </div>
          )}
          {!loading && dataSearch.length > 0 && (
            // result product
            <>
              <ul className="searchPrd--list flex flex-col gap-y-2">
                {dataSearch.slice(0, 4).map((item) => (
                  <li key={item.id} className="item flex-y-center gap-x-3">
                    <div className="block--img flex-[0_0_12%]">
                      <Link href="#!" className="block w-full h-full">
                        <ImgLazy
                          src="/images/product/product-2.png"
                          alt="Hình sản phẩm search"
                          className="ratio-img"
                          wrapperClassName="ratio-box ratio-1_1 block w-full h-full rounded-md"
                        />
                      </Link>
                    </div>
                    <div className="block--info">
                      <div className="info__name text-sm font-medium">
                        <Link href="#!" className=" line-clamp-2">
                          {item.ten_sp}
                        </Link>
                      </div>
                      <div className="info__price flex gap-x-2 items-end flex-wrap mt-1">
                        <span className="text-sm text-accentColor font-semibold">
                          {item.gia_da_giam
                            ? formatMoney(item.gia_da_giam)
                            : formatMoney(item.gia)}
                        </span>
                        {item.gia_da_giam && (
                          <span className="text-xs text-price-old line-through">
                            {formatMoney(item.gia)}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <BtnPrimary
                content={`Xem thêm ${dataSearch.length - 4} kết quả`}
                onClick={handleSearchNextPage}
                className="w-full text-center mt-3"
              />
            </>
          )}
          {!loading && dataSearch.length === 0 && (
            <div className="no-result">Không tìm thấy sản phẩm!</div>
          )}
        </div>
      )}

      {/* <div className="overflow-hidden mt-2 max-h-[16px]">
        <ul className="history--search flex flex-wrap gap-[4px_16px] ">
          <li className="flex">
            <Link
              href="#!"
              className="text-xs text-textGrayDark font-medium capitalize "
            >
              Đồ chơi
            </Link>
          </li>
        </ul>
      </div> */}
    </>
  );
}
